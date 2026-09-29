# ml-service/app/routes/price_forecast.py

from fastapi import APIRouter
from app.schemas.price_schema import PriceForecastRequest, PriceForecastResponse
from app.services.forecast_service import run_price_forecast

router = APIRouter(prefix="/ml", tags=["Price Forecasting"])

@router.post("/predict-price", response_model=PriceForecastResponse)
async def predict_price(payload: PriceForecastRequest):
    """
    1. Price Forecasting Endpoint.
    Input:
      - Crop
      - Market
      - Historical prices
      - Market arrivals
      - Season
      - Month
      - Weather features
    Output:
      - Predicted price with upper/lower bounds and factor breakdown
    """
    return run_price_forecast(payload)
