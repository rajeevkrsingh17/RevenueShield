import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') || 'ALL';
  const method = searchParams.get('method') || 'ALL';
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  const whereClause: any = {
    organizationId: user.organizationId,
  };

  if (status !== 'ALL') {
    whereClause.status = status;
  }

  if (method !== 'ALL') {
    whereClause.paymentMethod = method;
  }

  if (search) {
    whereClause.OR = [
      { transactionId: { contains: search } },
      { customerName: { contains: search } },
      { bank: { contains: search } },
      { failureReason: { contains: search } },
    ];
  }

  const total = await db.transaction.count({ where: whereClause });

  const transactions = await db.transaction.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
    include: {
      recoveryActions: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });

  return NextResponse.json({
    transactions,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
}
