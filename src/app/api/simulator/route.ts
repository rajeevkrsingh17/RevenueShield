import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { computeRecoveryScore } from '@/lib/scoring';

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { amount, paymentMethod, bank, failureReason, customerTier } = body;

  if (!amount || !paymentMethod || !bank || !failureReason) {
    return NextResponse.json(
      { error: 'Missing required parameters: amount, paymentMethod, bank, failureReason' },
      { status: 400 }
    );
  }

  const result = computeRecoveryScore({
    amount: parseFloat(amount),
    paymentMethod,
    bank,
    failureReason,
    customerTier,
  });

  return NextResponse.json({ result });
}
