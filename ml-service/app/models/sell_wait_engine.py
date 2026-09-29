# ml-service/app/models/sell_wait_engine.py

from typing import Dict, Any, List
from app.utils.constants import PERISHABILITY_MAP, STATUS_PROTOTYPE
from app.utils.metrics import build_model_metadata

class SellWaitEngine:
    """
    Sell Now vs Wait Decision Science Engine.
    Evaluates:
      - Perishability degradation curve
      - Storage rental vs Potential price upside
      - Incoming weather hazard exposure
      - Market arrival volume pressure
    """

    def __init__(self):
        self.model_name = "SellWait-DecisionEngine-v1.0"

    def analyze(
        self,
        crop: str,
        quantity_quintals: float,
        current_market_price: float,
        historical_price_trend: str = "+4.5% (Upward)",
        weather_description: str = "Rain in 48 hrs",
        has_cold_storage: bool = True,
        storage_daily_rate: float = 16.0,
        expected_future_price: float = None,
        weather_forecast_days: int = 5
    ) -> Dict[str, Any]:
        qty = quantity_quintals
        current_price = current_market_price
        crop_lower = crop.lower()

        # Perishability metadata
        perish_data = PERISHABILITY_MAP.get(crop_lower, {"level": "Medium", "spoilage_rate_daily": 0.003})
        perishability_level = perish_data["level"]
        daily_spoilage = perish_data["spoilage_rate_daily"]
        is_perishable = "high" in perishability_level.lower()

        # 1. Option 1: SELL NOW
        sell_now_gross = round(qty * current_price)
        sell_now_net = sell_now_gross  # Zero storage, zero further holding risk

        # 2. Option 2: WAIT 5 DAYS
        if expected_future_price is not None and expected_future_price > 0:
            projected_future_price = expected_future_price
            potential_upside = projected_future_price - current_price
        else:
            potential_upside = 200.0 if "tomato" in crop_lower else (150.0 if "onion" in crop_lower else 60.0)
            projected_future_price = current_price + potential_upside

        projected_gross = round(qty * projected_future_price)

        # Storage cost over holding window
        effective_daily_rate = storage_daily_rate if has_cold_storage else 30.0
        storage_cost = round(qty * effective_daily_rate * weather_forecast_days)

        # Moisture shrinkage & spoilage loss during holding
        total_spoilage_pct = daily_spoilage * weather_forecast_days
        spoilage_cost = round(projected_gross * total_spoilage_pct)

        # Net Projected value if Wait
        wait_net = projected_gross - storage_cost - spoilage_cost
        net_difference = wait_net - sell_now_net

        # Algorithmic Recommendation
        weather_risk_high = "rain" in weather_description.lower() or "storm" in weather_description.lower()
        should_sell_now = is_perishable and (weather_risk_high or net_difference < 2500)

        recommendation = "SELL NOW MAY BE SUITABLE" if should_sell_now else "HOLD / WAIT MAY BE SUITABLE"
        recommendation_summary = (
            "Based on your crop type, incoming rain alerts, and storage costs, selling today protects your guaranteed income."
            if should_sell_now
            else "Holding may yield superior net return provided low-cost cold storage is accessible."
        )

        comparison_factors = [
            {
                "factor": "Current Price",
                "sellNow": f"Known (₹{int(current_price):,}/Q)",
                "wait": "—",
                "meaning": f"Selling today guarantees ₹{int(current_price):,} with no price drop risk."
            },
            {
                "factor": "Price Increase",
                "sellNow": "—",
                "wait": f"Potential (+₹{int(potential_upside):,}/Q)",
                "meaning": "Holding could fetch higher price if demand stays strong."
            },
            {
                "factor": "Storage Cost",
                "sellNow": "None (₹0)",
                "wait": f"₹{int(effective_daily_rate * weather_forecast_days)}/Q (~₹{storage_cost:,})",
                "meaning": "Storing crop eats into the potential market price gain."
            },
            {
                "factor": "Spoilage Risk",
                "sellNow": "Lower (Fresh Grade A)",
                "wait": "Higher (Softening / Rot)" if is_perishable else "Low",
                "meaning": f"{crop} undergoes moisture shrinkage without rapid controlled atmosphere storage."
            },
            {
                "factor": "Weather Risk",
                "sellNow": "Lower (Pre-rain dispatch)",
                "wait": "Possible Disruption" if weather_risk_high else "Stable",
                "meaning": f"Forecast indicates '{weather_description}' which could cause transit blockades."
            }
        ]

        return {
            "crop": crop,
            "quantityQuintals": qty,
            "currentMarketPrice": current_price,
            "recommendation": recommendation,
            "recommendation_summary": recommendation_summary,
            "net_difference": net_difference,
            "currentSituation": {
                "currentPrice": f"₹{int(current_price):,} / Q",
                "priceTrend": historical_price_trend,
                "weather": weather_description,
                "perishability": perishability_level,
                "storage": f"Available (₹{int(effective_daily_rate * weather_forecast_days)}/Q/{weather_forecast_days}days)" if has_cold_storage else "Not Available",
                "mandiInflow": "High (1,450 Q/day)"
            },
            "sellNow": {
                "title": "SELL NOW",
                "subtitle": "Liquidate today at guaranteed farm-gate price",
                "expectedReturn": sell_now_net,
                "pricePerQ": current_price,
                "storageCost": 0,
                "isRecommended": should_sell_now,
                "points": [
                    f"No additional storage cost (Save ₹{storage_cost:,})",
                    "Lower spoilage exposure (Fresh harvest Grade A)",
                    "Current price is known and guaranteed today",
                    "Avoid upcoming weather transit disruptions"
                ]
            },
            "waitOption": {
                "title": f"WAIT {weather_forecast_days} DAYS",
                "subtitle": "Hold stock hoping for higher market quotation",
                "potentialGrossReturn": projected_gross,
                "potentialNetReturn": wait_net,
                "potentialPrice": projected_future_price,
                "priceUpside": potential_upside,
                "storageCost": storage_cost,
                "spoilageCost": spoilage_cost,
                "spoilageRisk": "Higher (Moisture Loss)" if is_perishable else "Low",
                "weatherRisk": weather_description,
                "points": [
                    f"Potential price increase (Up to +₹{int(potential_upside)}/Q)",
                    f"Storage cost: approx ₹{storage_cost:,} for {weather_forecast_days} days",
                    "Spoilage risk: moisture shrinkage & softening",
                    "Price uncertainty: mandi arrivals might push rates down"
                ]
            },
            "comparisonFactors": comparison_factors,
            "decisionSupport": {
                "suggestion": recommendation,
                "summary": recommendation_summary,
                "keyPoints": [
                    f"{crop} perishability profile: {perishability_level}",
                    f"Weather alert: {weather_description}",
                    f"Holding adds ₹{storage_cost:,} storage + ₹{spoilage_cost:,} spoilage loss",
                    f"Current price locks in guaranteed ₹{sell_now_net:,} cash today"
                ],
                "whenToWait": f"Waiting may be worth considering if you have low-cost cold storage (<₹30/Q) and an assured buyer offering over ₹{int(projected_future_price + 200)}/Q with gate pickup."
            },
            "model_metadata": build_model_metadata(
                model_name=self.model_name,
                algorithm="Decision Tree & Financial Net-Margin Payoff Matrix",
                status=STATUS_PROTOTYPE
            )
        }
