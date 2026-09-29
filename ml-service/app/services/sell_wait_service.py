# ml-service/app/services/sell_wait_service.py

from app.models.sell_wait_engine import SellWaitEngine
from app.schemas.sell_wait_schema import SellWaitAnalysisRequest, SellWaitAnalysisResponse

engine = SellWaitEngine()

def run_sell_wait_analysis(payload: SellWaitAnalysisRequest) -> SellWaitAnalysisResponse:
    qty = payload.quantityQuintals if payload.quantityQuintals is not None else (payload.quantity or 30.0)
    current_price = payload.currentMarketPrice if payload.currentMarketPrice is not None else (payload.current_price or 2700.0)
    
    weather_desc = payload.weather if isinstance(payload.weather, str) else "Rain in 48 hrs"
    trend_desc = str(payload.historical_price_trend or "+4.5% (Upward)")

    res = engine.analyze(
        crop=payload.crop,
        quantity_quintals=qty,
        current_market_price=current_price,
        historical_price_trend=trend_desc,
        weather_description=weather_desc,
        has_cold_storage=payload.hasColdStorage,
        storage_daily_rate=payload.storageDailyRatePerQuintal or (payload.storage_cost / 5.0 if payload.storage_cost else 16.0),
        expected_future_price=payload.expected_future_price,
        weather_forecast_days=payload.weatherForecastDays or 5
    )

    return SellWaitAnalysisResponse(**res)
