# RevenueShield API Documentation

## Endpoints

### 1. Dashboard Stats
`GET /api/dashboard/stats`
Returns core KPIs (Total processed, Successful, At Risk, AI Recoverable, Recovered).

### 2. Strategy Simulation
`POST /api/recovery/simulate`
**Request Body**:
```json
{
  "transaction_id": "tx_4999_key",
  "amount": 4999,
  "payment_method": "upi",
  "bank_name": "Bank X",
  "failure_reason": "Temporary Issuer Timeout",
  "attempts": 1,
  "risk_score": 12
}
```

**Response**:
```json
{
  "recommended_strategy": "retry_90s",
  "recommended_action": "Retry after 90 seconds",
  "recovery_probability": 0.86,
  "expected_recovery": 4299,
  "policy_decision": {
    "allowed": true,
    "status": "Allowed",
    "explanation": "Retry limit not exceeded."
  }
}
```

### 3. Razorpay Webhook Endpoint
`POST /api/webhooks/razorpay`
Listens for optional live test payment failure webhooks.
