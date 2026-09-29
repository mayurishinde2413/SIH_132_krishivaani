# ml-service/app/services/realisation_service.py

from app.models.net_realisation_engine import NetRealisationEngine
from app.schemas.realisation_schema import NetRealisationRequest, NetRealisationResponse
from app.utils.constants import STATUS_PROTOTYPE
from app.utils.metrics import build_model_metadata

engine = NetRealisationEngine()

def run_net_realisation_estimation(payload: NetRealisationRequest) -> NetRealisationResponse:
    # Resolve quantity in kg
    qty_kg = payload.quantityKg if payload.quantityKg is not None else (
        payload.quantity * 100.0 if payload.quantity is not None and payload.quantity < 500 else (payload.quantity or 3000.0)
    )
    grade = payload.grade or payload.quality or "Grade A"

    # Multi-market evaluation if marketPrices list is provided
    if payload.marketPrices and len(payload.marketPrices) > 0:
        candidates = engine.evaluate_markets(
            crop=payload.crop,
            quantity_kg=qty_kg,
            grade=grade,
            market_prices=payload.marketPrices
        )
        recommended = candidates[0] if candidates else None
        top_breakdown = recommended["breakdown"] if recommended else {}
        
        return NetRealisationResponse(
            crop=payload.crop,
            quantityKg=qty_kg,
            quality=grade,
            expected_net_realisation=top_breakdown.get("netRealisation", 0.0),
            net_realisation_per_unit=top_breakdown.get("netRealisationPerKg", 0.0),
            gross_revenue=top_breakdown.get("grossRevenue", 0.0),
            total_deductions=top_breakdown.get("totalDeductions", 0.0),
            retention_percentage=top_breakdown.get("retentionPercent", 0.0),
            breakdown=top_breakdown,
            status=STATUS_PROTOTYPE,
            model_metadata=build_model_metadata(
                model_name=engine.model_name,
                algorithm="Multi-Market Deduction Waterfall (Transport + Mandi Cess + Spoilage + Quality)",
                status=STATUS_PROTOTYPE
            ),
            candidateMarkets=candidates,
            recommendedMarket=recommended
        )

    # Single market calculation
    price_per_kg = payload.price if payload.price is not None and payload.price < 200 else (
        (payload.price or 2800.0) / 100.0
    )
    breakdown = engine.compute_single(
        crop=payload.crop,
        quantity_kg=qty_kg,
        grade=grade,
        quoted_price_per_kg=price_per_kg,
        distance_km=payload.distance or 25.0,
        transport_override=payload.transport_cost,
        fees_override=payload.fees,
        wastage_override=payload.expected_wastage
    )

    return NetRealisationResponse(
        crop=payload.crop,
        quantityKg=qty_kg,
        quality=grade,
        expected_net_realisation=breakdown["netRealisation"],
        net_realisation_per_unit=breakdown["netRealisationPerKg"],
        gross_revenue=breakdown["grossRevenue"],
        total_deductions=breakdown["totalDeductions"],
        retention_percentage=breakdown["retentionPercent"],
        breakdown=breakdown,
        status=STATUS_PROTOTYPE,
        model_metadata=build_model_metadata(
            model_name=engine.model_name,
            algorithm="Parametric Logistic Waterfall & APMC Cost Accounting",
            status=STATUS_PROTOTYPE
        )
    )
