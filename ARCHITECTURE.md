# RevenueShield Architecture & Decision Model

## Dual Intelligence System Architecture

```
                                  [ Payment Gateway / Dataset ]
                                               │
                       ┌───────────────────────┴───────────────────────┐
                       ▼                                               ▼
          [ Module 1: Revenue Leakage ]                    [ Module 2: Payment Recovery ]
          - Failure Spikes Anomaly                         - XGBoost Recovery Prediction
          - Bank Switch Degradation                        - Strategy Simulator (EV Score)
          - Refund Spike Detection                         - Safety Policy Engine
                       │                                               │
                       └───────────────────────┬───────────────────────┘
                                               ▼
                                   [ Deterministic Policy Check ]
                                   - Max Retries (≥3)
                                   - High Value (≥₹50,000)
                                   - Risk Threshold (≥75)
                                               │
                                               ▼
                                   [ Merchant Execution & Audit ]
```

## Decision Engine Formula
```
Expected Value = (Recovery Probability × Amount) - Friction Penalty - Retry Cost - Risk Penalty
```

## Safety Policy Engine Rules
1. **Rule #1**: `IF retry_count >= 3` &rarr; Block automatic retry.
2. **Rule #2**: `IF risk_score >= 75` &rarr; Require manual compliance review.
3. **Rule #3**: `IF transaction_amount >= 50,000` &rarr; Require merchant authorization.
4. **Rule #4**: `IF recent_retry_timestamp < 60s` &rarr; Enforce cooldown period.
