import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const orgId = user.organizationId;

  // Clear existing transactions, audit logs, notifications, anomalies for this org
  await db.notification.deleteMany({ where: { organizationId: orgId } });
  await db.anomaly.deleteMany({ where: { organizationId: orgId } });
  await db.auditLogEntry.deleteMany({ where: { organizationId: orgId } });
  
  // Delete transactions via cascading
  await db.transaction.deleteMany({ where: { organizationId: orgId } });

  // Re-seed 40 fresh transactions
  const failureTypes = [
    { reason: '3D Secure Timeout', category: 'TIMEOUT', method: 'Credit Card', bank: 'HDFC Bank' },
    { reason: 'Bank Server Timeout', category: 'BANK_DOWN', method: 'UPI', bank: 'SBI' },
    { reason: 'UPI PIN Mismatch', category: 'USER_ERROR', method: 'UPI', bank: 'PhonePe' },
    { reason: 'Netbanking Session Expired', category: 'USER_ERROR', method: 'Netbanking', bank: 'ICICI Bank' },
    { reason: 'Insufficient Funds', category: 'DECLINED', method: 'Debit Card', bank: 'Axis Bank' },
  ];

  const customers = ['Rahul Sharma', 'Priya Patel', 'Ananya Roy', 'Vikram Malhotra', 'Siddharth Rao'];

  for (let i = 0; i < 40; i++) {
    const cust = customers[i % customers.length];
    const fail = failureTypes[i % failureTypes.length];
    const amount = 1499 + (i * 850);
    const prob = Math.round((0.55 + (i % 4) * 0.1) * 100) / 100;
    const action = fail.category === 'TIMEOUT' ? 'RETRY' : fail.category === 'BANK_DOWN' ? 'SWITCH_METHOD' : 'SEND_LINK';
    const displayId = `pay_reset_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const tx = await db.transaction.create({
      data: {
        organizationId: orgId,
        transactionId: displayId,
        amount,
        customerName: cust,
        customerTier: i % 2 === 0 ? 'VIP' : 'Standard',
        paymentMethod: fail.method,
        bank: fail.bank,
        failureReason: fail.reason,
        failureCategory: fail.category,
        status: i % 4 === 0 ? 'RECOVERED' : 'RECOVERABLE',
        recoveryProbability: prob,
        expectedRecoveryAmount: Math.round(amount * prob),
        recommendedAction: action,
      }
    });

    if (tx.status === 'RECOVERABLE') {
      await db.recoveryAction.create({
        data: {
          transactionId: tx.id,
          actionType: action,
          status: 'PENDING',
          aiConfidence: prob,
        }
      });
    }
  }

  // Create Anomaly
  await db.anomaly.create({
    data: {
      organizationId: orgId,
      title: 'HDFC UPI Network Failure Surge',
      severity: 'CRITICAL',
      confidence: 0.95,
      description: 'Spike in UPI timeouts detected on HDFC gateway.',
      resolved: false,
    }
  });

  return NextResponse.json({ success: true, message: 'Demo data reset successfully' });
}
