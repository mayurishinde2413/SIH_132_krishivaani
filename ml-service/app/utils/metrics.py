# ml-service/app/utils/metrics.py

from typing import Dict, Any

def format_currency(value: float, symbol: str = "₹") -> str:
    """Format floating point values into Indian Rupee string formatting."""
    return f"{symbol}{value:,.2f}"

def calculate_mape(actual: float, predicted: float) -> float:
    """Mean Absolute Percentage Error."""
    if actual == 0:
        return 0.0
    return abs((actual - predicted) / actual) * 100.0

def build_model_metadata(
    model_name: str,
    algorithm: str,
    status: str = "Prototype estimation",
    data_source: str = "APMC Mandi arrivals + simulated seasonal indicators"
) -> Dict[str, Any]:
    return {
        "model_name": model_name,
        "algorithm": algorithm,
        "status": status,
        "is_production_trained": False,
        "data_source": data_source,
        "notice": "This estimation is computed using transparent domain baseline logic with Scikit-learn/XGBoost feature wrappers. Plug-and-play for retrained production weights."
    }
