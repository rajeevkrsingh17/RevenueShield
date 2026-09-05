import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Helper to compute realistic recovery probability based on failure category & tier
function calculateRecoveryProbability(failureReason: string, failureCategory: string, tier: string, amount: number): number {
  let baseProb = 0.50;

  switch (failureCategory) {
    case 'TIMEOUT':
      baseProb = 0.88; // Timeouts recover very well on smart retry
      break;
    case 'BANK_DOWN':
      baseProb = 0.76; // Bank downtime recovers after switching route or retrying later
      break;
    case 'USER_ERROR':
      baseProb = 0.62; // PIN mismatch / session expiry recovers well with payment link / reminder
      break;
    case 'DECLINED':
      baseProb = 0.35; // Issuer declined / insufficient funds recover poorly
      break;
    case 'COMPLIANCE':
      baseProb = 0.20; // International block / 2FA non-compliant
      break;
    default:
      baseProb = 0.50;
  }

  // Tier modifier
  if (tier === 'VIP' || tier === 'Enterprise') baseProb += 0.08;
  if (tier === 'Premium') baseProb += 0.04;

  // High ticket size slight penalty (harder user impulse retry)
  if (amount > 20000) baseProb -= 0.05;

  return Math.min(0.98, Math.max(0.12, Math.round(baseProb * 100) / 100));
}

function getRecommendedAction(category: string, failureReason: string): string {
  if (category === 'TIMEOUT' || failureReason.includes('Timeout')) return 'RETRY';
  if (category === 'BANK_DOWN' || failureReason.includes('Server')) return 'SWITCH_METHOD';
  if (category === 'USER_ERROR' || failureReason.includes('PIN') || failureReason.includes('Session')) return 'SEND_LINK';
  return 'ESCALATE';
}

async function main() {
  console.log('🌱 Starting RevenueShield Database Seeding...');

  // Clean old data
  await prisma.notification.deleteMany();
  await prisma.anomaly.deleteMany();
  await prisma.auditLogEntry.deleteMany();
  await prisma.recoveryAction.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Create Organizations
  const org1 = await prisma.organization.create({
    data: {
      name: 'Acme SaaS India',
      demoSandboxMode: true,
    }
  });

  const org2 = await prisma.organization.create({
    data: {
      name: 'RazorPay Sandbox Store',
      demoSandboxMode: true,
    }
  });

  const org3 = await prisma.organization.create({
    data: {
      name: 'BharatPay Digital',
      demoSandboxMode: true,
    }
  });

  // 2. Create Primary Demo User attached to Org 1
  const demoUser = await prisma.user.create({
    data: {
      name: 'Rajeev Singh',
      email: 'admin@revenueshield.ai',
      passwordHash: hashedPassword,
      role: 'ADMIN',
      organizationId: org1.id
    }
  });

  // Update Org 1 ownerId
  await prisma.organization.update({
    where: { id: org1.id },
    data: { ownerId: demoUser.id }
  });

  // Indian customer pool
  const customers = [
    { name: 'Rahul Sharma', tier: 'VIP' },
    { name: 'Priya Patel', tier: 'Enterprise' },
    { name: 'Ananya Roy', tier: 'Premium' },
    { name: 'Vikram Malhotra', tier: 'Standard' },
    { name: 'Siddharth Rao', tier: 'VIP' },
    { name: 'Neha Gupta', tier: 'Standard' },
    { name: 'Arjun Mehta', tier: 'Enterprise' },
    { name: 'Kavya Nair', tier: 'Premium' },
    { name: 'Rohan Verma', tier: 'Standard' },
    { name: 'Sneha Joshi', tier: 'VIP' },
    { name: 'Aditya Kulkarni', tier: 'Standard' },
    { name: 'Pooja Sundaram', tier: 'Enterprise' },
  ];

  const failureTypes = [
    { reason: '3D Secure Timeout', category: 'TIMEOUT', method: 'Credit Card', bank: 'HDFC Bank' },
    { reason: 'Bank Server Timeout', category: 'BANK_DOWN', method: 'UPI', bank: 'SBI' },
    { reason: 'UPI PIN Mismatch', category: 'USER_ERROR', method: 'UPI', bank: 'PhonePe' },
    { reason: 'Netbanking Session Expired', category: 'USER_ERROR', method: 'Netbanking', bank: 'ICICI Bank' },
    { reason: 'Insufficient Funds', category: 'DECLINED', method: 'Debit Card', bank: 'Axis Bank' },
    { reason: 'Card Declined by Issuer', category: 'DECLINED', method: 'Credit Card', bank: 'Kotak Bank' },
    { reason: 'International Card Blocked', category: 'COMPLIANCE', method: 'Credit Card', bank: 'Citibank' },
    { reason: 'UPI Autopay Mandate Timeout', category: 'TIMEOUT', method: 'UPI', bank: 'Google Pay' },
  ];

  const orgs = [org1, org2, org3];

  for (const org of orgs) {
    console.log(`📦 Seeding transactions for organization: ${org.name}`);

    // Generate 45 transactions per organization across past 30 days
    const txCount = 45;
    for (let i = 0; i < txCount; i++) {
      const cust = customers[i % customers.length];
      const fail = failureTypes[i % failureTypes.length];
      
      // Random realistic Indian amounts: ₹499 to ₹85,000
      const amounts = [1499, 2999, 4999, 9999, 14999, 24999, 45000, 78000];
      const amount = amounts[i % amounts.length] + Math.floor(Math.random() * 50);

      const prob = calculateRecoveryProbability(fail.reason, fail.category, cust.tier, amount);
      const expectedAmount = Math.round(amount * prob);
      const action = getRecommendedAction(fail.category, fail.reason);

      // Status distribution: 50% RECOVERABLE, 30% RECOVERED, 15% LOST, 5% FAILED
      let status = 'RECOVERABLE';
      if (i % 5 === 1) status = 'RECOVERED';
      else if (i % 7 === 0) status = 'LOST';
      else if (i % 11 === 0) status = 'FAILED';

      const createdDaysAgo = (i * 0.6) + Math.random() * 0.3;
      const createdAt = new Date(Date.now() - createdDaysAgo * 24 * 60 * 60 * 1000);

      const displayId = `pay_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

      const tx = await prisma.transaction.create({
        data: {
          organizationId: org.id,
          transactionId: displayId,
          amount,
          currency: 'INR',
          customerName: cust.name,
          customerTier: cust.tier,
          paymentMethod: fail.method,
          bank: fail.bank,
          failureReason: fail.reason,
          failureCategory: fail.category,
          status,
          recoveryProbability: prob,
          expectedRecoveryAmount: expectedAmount,
          recommendedAction: action,
          createdAt,
          updatedAt: createdAt,
        }
      });

      // If RECOVERED or LOST, create a matching RecoveryAction & AuditLogEntry
      if (status === 'RECOVERED' || status === 'LOST') {
        const actionStatus = status === 'RECOVERED' ? 'EXECUTED' : 'FAILED';
        const outcome = status === 'RECOVERED' ? `Recovered ₹${amount.toLocaleString('en-IN')} via ${action}` : `Retry failed: Customer declined`;

        const recoveryAction = await prisma.recoveryAction.create({
          data: {
            transactionId: tx.id,
            actionType: action,
            status: actionStatus,
            aiConfidence: prob,
            executedAt: createdAt,
            outcome,
          }
        });

        await prisma.auditLogEntry.create({
          data: {
            organizationId: org.id,
            transactionId: tx.id,
            timestamp: createdAt,
            aiRecommendation: `${action} (Confidence: ${Math.round(prob * 100)}%)`,
            aiConfidence: prob,
            policyDecision: 'AUTO_APPROVED',
            merchantApproval: 'APPROVED',
            status: actionStatus === 'EXECUTED' ? 'SUCCESS' : 'FAILED',
            outcome,
          }
        });
      } else if (status === 'RECOVERABLE') {
        // Create initial pending action
        await prisma.recoveryAction.create({
          data: {
            transactionId: tx.id,
            actionType: action,
            status: 'PENDING',
            aiConfidence: prob,
          }
        });

        // Add initial audit log entry for recommendation
        await prisma.auditLogEntry.create({
          data: {
            organizationId: org.id,
            transactionId: tx.id,
            timestamp: createdAt,
            aiRecommendation: `${action} recommended for ${fail.reason}`,
            aiConfidence: prob,
            policyDecision: 'PENDING_MERCHANT',
            merchantApproval: 'PENDING',
            status: 'PENDING',
            outcome: `Target expected recovery: ₹${expectedAmount.toLocaleString('en-IN')}`,
          }
        });
      }
    }

    // 3. Create Anomalies per Organization
    await prisma.anomaly.createMany({
      data: [
        {
          organizationId: org.id,
          title: 'HDFC Bank UPI Timeout Spike (+38%)',
          severity: 'CRITICAL',
          confidence: 0.94,
          description: 'Failure rates for HDFC UPI transactions surged over 38% above 30-day baseline during peak 6 PM - 9 PM hours due to gateway response delays.',
          resolved: false,
          detectedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        },
        {
          organizationId: org.id,
          title: 'ICICI Netbanking 3D-Secure OTP Latency',
          severity: 'HIGH',
          confidence: 0.89,
          description: 'SMS OTP delivery latency increased to >45s for ICICI Netbanking, leading to session timeouts.',
          resolved: false,
          detectedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        },
        {
          organizationId: org.id,
          title: 'PhonePe Autopay Mandate Execution Failure',
          severity: 'MEDIUM',
          confidence: 0.81,
          description: 'Recurring monthly subscription mandate executions failing on PhonePe handle @ybl due to gateway API response timeout.',
          resolved: true,
          detectedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        }
      ]
    });

    // 4. Create Notifications per Organization
    await prisma.notification.createMany({
      data: [
        {
          organizationId: org.id,
          title: 'Critical Anomaly Detected',
          message: 'HDFC Bank UPI Timeout Spike (+38%) detected. Recommended: Auto-switch route to Axis UPI.',
          type: 'ANOMALY',
          isRead: false,
        },
        {
          organizationId: org.id,
          title: 'High-Value Payment Recovered',
          message: 'Recovered ₹45,000 for Vikram Malhotra via Smart Retry.',
          type: 'ACTION',
          isRead: false,
        },
        {
          organizationId: org.id,
          title: 'Weekly Recovery Summary Ready',
          message: 'Your organization recovered 68.4% of high-probability payment failures this week.',
          type: 'SYSTEM',
          isRead: true,
        }
      ]
    });
  }

  console.log('✅ Database Seeding Complete!');
  console.log('👤 Demo User: admin@revenueshield.ai / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
