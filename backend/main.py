from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import datetime

app = FastAPI(
    title="RevenueShield Backend Service",
    description="AI-Powered Revenue Recovery & Leakage Intelligence API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class StrategyInput(BaseModel):
    transaction_id: str
    amount: float
    payment_method: str
    bank_name: str
    failure_reason: str
    attempts: int
    risk_score: int

class StrategyOutput(BaseModel):
    strategy_id: str
    name: string
    recovery_probability: float
    expected_recovery: float
    friction: str
    risk: str
    score: float
    policy_allowed: bool
    policy_action: str

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "RevenueShield API",
        "version": "1.0.0",
        "environment": "DEMO / TEST"
    }

@app.get("/api/dashboard/stats")
def get_dashboard_stats():
    return {
        "total_processed": 5240000,
        "successful_revenue": 4380000,
        "revenue_at_risk": 780000,
        "ai_recoverable": 510000,
        "revenue_recovered": 270000,
        "active_anomalies_count": 3
    }

@app.post("/api/recovery/simulate")
def simulate_recovery_strategy(input_data: StrategyInput):
    amount = input_data.amount
    # XGBoost ML Probability Simulation
    p90 = 0.86 if amount == 4999 else 0.82
    ev90 = round(amount * p90)

    return {
        "recommended_strategy": "retry_90s",
        "recommended_action": "Retry after 90 seconds",
        "recovery_probability": p90,
        "expected_recovery": ev90,
        "policy_decision": {
            "allowed": True,
            "status": "Allowed",
            "explanation": "Retry limit not exceeded, transaction value within limit."
        },
        "reasoning": f"Temporary issuer timeout detected at {input_data.bank_name}. 90-second delayed retry provides maximum expected recovery of ₹{ev90} with low customer friction."
    }

@app.post("/api/webhooks/razorpay")
def razorpay_webhook_listener(payload: dict):
    # Optional Razorpay Test Mode Webhook Handler
    event = payload.get("event", "payment.failed")
    return {"status": "received", "event": event}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
