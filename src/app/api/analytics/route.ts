import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const orgId = user.organizationId;

  const transactions = await db.transaction.findMany({
    where: { organizationId: orgId },
  });

  // 1. Failure Reason Breakdown
  const reasonMap: Record<string, number> = {};
  transactions.forEach((tx) => {
    reasonMap[tx.failureReason] = (reasonMap[tx.failureReason] || 0) + 1;
  });

  const failureReasons = Object.entries(reasonMap).map(([reason, count]) => ({
    reason,
    count,
    percentage: Math.round((count / transactions.length) * 100),
  }));

  // 2. Recovery Rate by Payment Method
  const methodMap: Record<string, { total: number; recovered: number; amount: number }> = {};
  transactions.forEach((tx) => {
    if (!methodMap[tx.paymentMethod]) {
      methodMap[tx.paymentMethod] = { total: 0, recovered: 0, amount: 0 };
    }
    methodMap[tx.paymentMethod].total += 1;
    if (tx.status === 'RECOVERED') {
      methodMap[tx.paymentMethod].recovered += 1;
      methodMap[tx.paymentMethod].amount += tx.amount;
    }
  });

  const methodPerformance = Object.entries(methodMap).map(([method, data]) => ({
    method,
    total: data.total,
    recovered: data.recovered,
    rate: Math.round((data.recovered / data.total) * 100),
    recoveredAmount: data.amount,
  }));

  // 3. Bank Success/Failure Matrix
  const bankMap: Record<string, { total: number; recovered: number }> = {};
  transactions.forEach((tx) => {
    if (!bankMap[tx.bank]) bankMap[tx.bank] = { total: 0, recovered: 0 };
    bankMap[tx.bank].total += 1;
    if (tx.status === 'RECOVERED') bankMap[tx.bank].recovered += 1;
  });

  const bankStats = Object.entries(bankMap).map(([bank, data]) => ({
    bank,
    recoveryRate: Math.round((data.recovered / data.total) * 100),
    failedCount: data.total - data.recovered,
  }));

  return NextResponse.json({
    failureReasons,
    methodPerformance,
    bankStats,
  });
}
