import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const transactionId = params.id;
  const { actionType = 'RETRY' } = await req.json().catch(() => ({}));

  const transaction = await db.transaction.findFirst({
    where: {
      id: transactionId,
      organizationId: user.organizationId,
    },
  });

  if (!transaction) {
    return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
  }

  if (transaction.status !== 'RECOVERABLE') {
    return NextResponse.json(
      { error: `Transaction is already resolved as ${transaction.status}` },
      { status: 400 }
    );
  }

  // Weighted probability execution based on recoveryProbability
  const isSuccessful = Math.random() <= transaction.recoveryProbability;
  const newStatus = isSuccessful ? 'RECOVERED' : 'LOST';
  const actionStatus = isSuccessful ? 'EXECUTED' : 'FAILED';
  
  const outcomeText = isSuccessful
    ? `Successfully recovered ₹${transaction.amount.toLocaleString('en-IN')} via ${actionType} action on ${transaction.bank}`
    : `Recovery execution failed: Customer declined retry notification on ${transaction.bank}`;

  // Update Transaction
  const updatedTx = await db.transaction.update({
    where: { id: transaction.id },
    data: {
      status: newStatus,
      updatedAt: new Date(),
    },
  });

  // Create or Update RecoveryAction
  const recoveryAction = await db.recoveryAction.create({
    data: {
      transactionId: transaction.id,
      actionType: actionType || transaction.recommendedAction,
      status: actionStatus,
      aiConfidence: transaction.recoveryProbability,
      executedAt: new Date(),
      outcome: outcomeText,
    },
  });

  // Create Audit Log Entry
  const auditLog = await db.auditLogEntry.create({
    data: {
      organizationId: user.organizationId,
      transactionId: transaction.id,
      timestamp: new Date(),
      aiRecommendation: `${transaction.recommendedAction} (Probability: ${Math.round(transaction.recoveryProbability * 100)}%)`,
      aiConfidence: transaction.recoveryProbability,
      policyDecision: 'MANUAL_OVERRIDE',
      merchantApproval: 'APPROVED',
      status: isSuccessful ? 'SUCCESS' : 'FAILED',
      outcome: outcomeText,
    },
  });

  // Create Notification
  await db.notification.create({
    data: {
      organizationId: user.organizationId,
      title: isSuccessful ? 'Payment Successfully Recovered' : 'Recovery Attempt Failed',
      message: `${transaction.customerName} (${transaction.transactionId}): ${outcomeText}`,
      type: 'ACTION',
      isRead: false,
    },
  });

  return NextResponse.json({
    success: true,
    isSuccessful,
    transaction: updatedTx,
    recoveryAction,
    auditLog,
  });
}
