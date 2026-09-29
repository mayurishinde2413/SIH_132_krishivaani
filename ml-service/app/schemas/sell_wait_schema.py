# ml-service/app/schemas/sell_wait_schema.py

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any, Union

class SellWaitAnalysisRequest(BaseModel):
    crop: str = Field(..., example="Tomato")
    quantity: Optional[float] = Field(default=30.0, description="Quantity in quintals")
    quantityQuintals: Optional[float] = None
    current_price: Optional[float] = Field(default=2700.0, description="Current price in Rs per quintal")
    currentMarketPrice: Optional[float] = None
    historical_price_trend: Optional[Union[str, float]] = Field(default="+4.5% (Upward)")
    weather: Optional[Union[str, Dict[str, Any]]] = Field(default="Rain in 48 hrs")
    perishability: Optional[str] = Field(default="High (2-4 days)")
    storage_cost: Optional[float] = Field(default=80.0, description="Total storage cost or daily rate")
    storageDailyRatePerQuintal: Optional[float] = None
    hasColdStorage: Optional[bool] = True
    expected_future_price: Optional[float] = None
    originLocation: Optional[str] = "Baramati, Pune"
    weatherForecastDays: Optional[int] = 5

class SellWaitComparisonFactor(BaseModel):
    factor: str
    sellNow: str
    wait: str
    meaning: str

class SellWaitAnalysisResponse(BaseModel):
    crop: str
    quantityQuintals: float
    currentMarketPrice: float
    recommendation: str
    recommendation_summary: str
    sellNow: Dict[str, Any]
    waitOption: Dict[str, Any]
    net_difference: float
    currentSituation: Dict[str, Any]
    comparisonFactors: List[SellWaitComparisonFactor]
    decisionSupport: Dict[str, Any]
    status: str = "Prototype estimation"
    model_metadata: Dict[str, Any]
