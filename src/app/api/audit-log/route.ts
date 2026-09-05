import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const format = searchParams.get('format'); // 'csv' or null
  const search = searchParams.get('search') || '';

  const whereClause: any = {
    organizationId: user.organizationId,
  };

  if (search) {
    whereClause.OR = [
      { aiRecommendation: { contains: search } },
      { outcome: { contains: search } },
      { policyDecision: { contains: search } },
      { merchantApproval: { contains: search } },
    ];
  }

  const auditLogs = await db.auditLogEntry.findMany({
    where: whereClause,
    orderBy: { timestamp: 'desc' },
    include: {
      transaction: {
        select: {
          transactionId: true,
          customerName: true,
          amount: true,
          bank: true,
        },
      },
    },
  });

  if (format === 'csv') {
    const headers = ['ID', 'Timestamp', 'Transaction ID', 'Customer', 'Amount', 'AI Recommendation', 'Confidence', 'Merchant Approval', 'Status', 'Outcome'];
    const rows = auditLogs.map((log) => [
      log.id,
      log.timestamp.toISOString(),
      log.transaction?.transactionId || 'N/A',
      log.transaction?.customerName || 'N/A',
      log.transaction?.amount ? `₹${log.transaction.amount}` : 'N/A',
      `"${log.aiRecommendation.replace(/"/g, '""')}"`,
      `${Math.round(log.aiConfidence * 100)}%`,
      log.merchantApproval,
      log.status,
      `"${log.outcome.replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="revenueshield-audit-log-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  }

  return NextResponse.json({ auditLogs });
}
