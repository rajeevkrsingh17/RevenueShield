import numpy as np

class RecoveryProbabilityModel:
    """
    Simulated XGBoost / LightGBM recovery probability predictor
    """
    def __init__(self):
        self.weights = {
            'bank_x_upi': 0.86,
            'card_3ds': 0.81,
            'netbanking_abandoned': 0.72,
            'default': 0.78
        }

    def predict_probability(self, payment_method: str, bank_name: str, failure_code: str, amount: float) -> float:
        if bank_name == 'Bank X' and payment_method == 'upi':
            return 0.86
        if failure_code == '3DS_TIMEOUT':
            return 0.81
        if failure_code == 'USER_ABANDONED':
            return 0.72
        return 0.78

model = RecoveryProbabilityModel()
