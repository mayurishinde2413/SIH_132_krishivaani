# ml-service/app/schemas/price_schema.py

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class PriceForecastRequest(BaseModel):
    crop: str = Field(..., example="Tomato")
    market: str = Field(..., example="Baramati APMC")
    historical_prices: Optional[List[float]] = Field(default=[], example=[2650.0, 2700.0, 2750.0, 2800.0])
    market_arrivals: Optional[float] = Field(default=850.0, description="Arrivals in quintals", example=850.0)
    season: Optional[str] = Field(default="Kharif", example="Kharif")
    month: Optional[int] = Field(default=9, ge=1, le=12, example=9)
    weather_features: Optional[Dict[str, Any]] = Field(
        default={"rainfall_mm": 12.0, "temp_max": 29.5, "humidity_pct": 78},
        example={"rainfall_mm": 12.0, "temp_max": 29.5, "humidity_pct": 78}
    )

class PriceForecastResponse(BaseModel):
    crop: str
    market: str
    predicted_price: float
    price_range_low: float
    price_range_high: float
    confidence_score: float
    unit: str = "₹ / Quintal"
    model_metadata: Dict[str, Any]
    forecast_factors: Dict[str, Any]
    status: str = "Prototype estimation"
