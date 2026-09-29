# ml-service/app/services/forecast_service.py

from app.models.price_forecaster import PriceForecaster
from app.schemas.price_schema import PriceForecastRequest, PriceForecastResponse

forecaster = PriceForecaster()

def run_price_forecast(payload: PriceForecastRequest) -> PriceForecastResponse:
    res = forecaster.predict(
        crop=payload.crop,
        market=payload.market,
        historical_prices=payload.historical_prices,
        market_arrivals=payload.market_arrivals or 850.0,
        season=payload.season or "Kharif",
        month=payload.month or 9,
        weather_features=payload.weather_features
    )
    return PriceForecastResponse(**res)
