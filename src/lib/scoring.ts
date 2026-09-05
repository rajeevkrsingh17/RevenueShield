export interface SimulationInput {
  amount: number;
  paymentMethod: string; // UPI, Netbanking, Credit Card, Debit Card, Wallet
  bank: string;
  failureReason: string;
  customerTier?: string; // VIP, Enterprise, Premium, Standard
}

export interface SimulationResult {
  recoveryProbability: number; // 0 to 1
  expectedRecoveryAmount: number;
  recommendedAction: 'RETRY' | 'SWITCH_METHOD' | 'SEND_LINK' | 'ESCALATE';
  failureCategory: string;
  aiConfidence: number;
  explanation: string;
  recommendedTimeframe: string;
  suggestedRoute?: string;
}

export function computeRecoveryScore(input: SimulationInput): SimulationResult {
  const { amount, paymentMethod, bank, failureReason, customerTier = 'Standard' } = input;

  let baseProb = 0.50;
  let category = 'USER_ERROR';
  let explanation = '';
  let recommendedTimeframe = 'Immediate (Within 5 mins)';
  let suggestedRoute = undefined;

  const reasonLower = failureReason.toLowerCase();

  if (reasonLower.includes('timeout') || reasonLower.includes('latency')) {
    category = 'TIMEOUT';
    baseProb = 0.88;
    explanation = 'Gateway/network timeout failures have high recovery potential when retried via auto-failover routing.';
    recommendedTimeframe = 'Smart Retry (T+3 mins)';
    suggestedRoute = `${bank} Direct Netbanking / Backup Gateway`;
  } else if (reasonLower.includes('server') || reasonLower.includes('down') || reasonLower.includes('unavailable')) {
    category = 'BANK_DOWN';
    baseProb = 0.76;
    explanation = 'Issuer bank downtime is transient. Switching payment method or delaying retry by 15 mins yields high success.';
    recommendedTimeframe = 'T+15 mins Retry';
    suggestedRoute = 'Axis / ICICI Alternate Gateway';
  } else if (reasonLower.includes('pin') || reasonLower.includes('session') || reasonLower.includes('otp')) {
    category = 'USER_ERROR';
    baseProb = 0.65;
    explanation = 'User friction issue (incorrect PIN or expired OTP session). Sending an instant WhatsApp payment link recovers most checkouts.';
    recommendedTimeframe = 'Immediate WhatsApp / SMS Link';
  } else if (reasonLower.includes('insufficient') || reasonLower.includes('decline') || reasonLower.includes('limit')) {
    category = 'DECLINED';
    baseProb = 0.35;
    explanation = 'Issuer declined transaction due to card limits or insufficient balance. Escalation or alternative payment method required.';
    recommendedTimeframe = 'Prompt Customer Choice';
  } else if (reasonLower.includes('international') || reasonLower.includes('block') || reasonLower.includes('fraud')) {
    category = 'COMPLIANCE';
    baseProb = 0.22;
    explanation = 'Card flagged for security or international 3DS policy. Requires manual customer verification or alternative domestic card.';
    recommendedTimeframe = 'Manual Review / Escalation';
  }

  // Tier Boost
  if (customerTier === 'VIP' || customerTier === 'Enterprise') baseProb += 0.08;
  if (customerTier === 'Premium') baseProb += 0.04;

  // Amount Adjustment
  if (amount > 50000) baseProb -= 0.06;

  // Clamp probability between 0.10 and 0.98
  const recoveryProbability = Math.min(0.98, Math.max(0.10, Math.round(baseProb * 100) / 100));
  const expectedRecoveryAmount = Math.round(amount * recoveryProbability);
  const aiConfidence = Math.min(0.99, Math.max(0.70, Math.round((0.82 + Math.random() * 0.15) * 100) / 100));

  let recommendedAction: 'RETRY' | 'SWITCH_METHOD' | 'SEND_LINK' | 'ESCALATE' = 'RETRY';
  if (category === 'TIMEOUT') recommendedAction = 'RETRY';
  else if (category === 'BANK_DOWN') recommendedAction = 'SWITCH_METHOD';
  else if (category === 'USER_ERROR') recommendedAction = 'SEND_LINK';
  else recommendedAction = 'ESCALATE';

  return {
    recoveryProbability,
    expectedRecoveryAmount,
    recommendedAction,
    failureCategory: category,
    aiConfidence,
    explanation,
    recommendedTimeframe,
    suggestedRoute,
  };
}
