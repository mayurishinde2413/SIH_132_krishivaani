# ml-service/app/models/net_realisation_engine.py

from typing import Dict, Any, List, Optional
from app.utils.constants import (
    PERISHABILITY_MAP,
    GRADE_DISCOUNT_RATES,
    MANDI_CESS_RATE,
    FREIGHT_BASE_FEE,
    FREIGHT_PER_KM_PER_TON,
    STATUS_PROTOTYPE,
)
from app.utils.metrics import build_model_metadata

class NetRealisationEngine:
    """
    Transparent Net Realisation Calculation Engine.
    Computes true farmer take-home realization across markets.
    Formula:
      Net Realisation = Gross Revenue
                        - Transport Cost
                        - Statutory Mandi Cess
                        - In-Transit Perishable Wastage
                        - Quality/Grade Deductions
                        - Loading & Unloading Porterage
    """

    def __init__(self):
        self.model_name = "NetRealisationEngine-v1.0"

    def compute_single(
        self,
        crop: str,
        quantity_kg: float,
        grade: str,
        quoted_price_per_kg: float,
        distance_km: float,
        transport_override: Optional[float] = None,
        fees_override: Optional[float] = None,
        wastage_override: Optional[float] = None
    ) -> Dict[str, Any]:
        crop_lower = crop.lower()
        is_perishable = crop_lower in ["tomato", "onion", "potato"]
        
        # 1. Gross Revenue
        gross = round(quantity_kg * quoted_price_per_kg, 2)

        # 2. Transport Cost
        if transport_override is not None:
            transport = float(transport_override)
        else:
            tons = max(0.1, quantity_kg / 1000.0)
            transport = round(FREIGHT_BASE_FEE + (distance_km * FREIGHT_PER_KM_PER_TON * tons), 2)

        # 3. Mandi Statutory Cess
        if fees_override is not None:
            mandi_fees = float(fees_override)
        else:
            mandi_fees = round(gross * MANDI_CESS_RATE, 2)

        # 4. In-Transit Wastage & Spoilage
        if wastage_override is not None:
            wastage_cost = float(wastage_override)
        else:
            wastage_rate_per_100km = 0.008 if is_perishable else 0.002
            pct = (distance_km / 100.0) * wastage_rate_per_100km
            wastage_cost = round(gross * pct, 2)

        # 5. Quality / Grade Discount
        grade_clean = grade.lower().strip()
        discount_rate = 0.0
        for k, v in GRADE_DISCOUNT_RATES.items():
            if k in grade_clean:
                discount_rate = v
                break
        quality_cost = round(gross * max(0.0, discount_rate), 2)

        # 6. Unloading & Hamali Porterage
        porterage = round(quantity_kg * 0.01, 2)

        # Total Deductions & Net
        total_deductions = round(transport + mandi_fees + wastage_cost + quality_cost + porterage, 2)
        net = round(gross - total_deductions, 2)
        net_per_kg = round(net / quantity_kg, 2) if quantity_kg > 0 else 0.0
        retention = round((net / gross) * 100.0, 1) if gross > 0 else 0.0

        return {
            "grossRevenue": gross,
            "transportCost": transport,
            "mandiFees": mandi_fees,
            "expectedWastage": wastage_cost,
            "qualityDeductions": quality_cost,
            "unloadingPorterage": porterage,
            "totalDeductions": total_deductions,
            "netRealisation": net,
            "netRealisationPerKg": net_per_kg,
            "retentionPercent": retention
        }

    def evaluate_markets(
        self,
        crop: str,
        quantity_kg: float,
        grade: str,
        market_prices: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        results = []
        for m in market_prices:
            quoted_rate = float(m.get("quotedPricePerKg", 28.0))
            dist = float(m.get("distanceKm", 20.0))

            breakdown = self.compute_single(
                crop=crop,
                quantity_kg=quantity_kg,
                grade=grade,
                quoted_price_per_kg=quoted_rate,
                distance_km=dist,
                transport_override=m.get("transportCostOverride"),
                fees_override=m.get("feesOverride"),
                wastage_override=m.get("wastageOverride")
            )

            mins = int(dist * 1.5 + 15)
            transit_str = f"~{mins} mins" if mins < 60 else f"~{mins // 60}hr {mins % 60}m"

            results.append({
                "marketId": m.get("marketId", 1),
                "marketName": m.get("name", "APMC Mandi"),
                "district": m.get("district", "Maharashtra"),
                "distanceKm": dist,
                "quotedPricePerKg": quoted_rate,
                "transitTimeEst": transit_str,
                "breakdown": breakdown
            })

        # Sort descending by Net Realisation
        results.sort(key=lambda x: x["breakdown"]["netRealisation"], reverse=True)

        for idx, r in enumerate(results):
            r["rank"] = idx + 1
            r["isRecommended"] = (idx == 0)
            if idx == 0:
                r["keyReason"] = f"Minimal distance ({r['distanceKm']} km) saves diesel & perishable transit loss, yielding highest net take-home."
            else:
                diff = results[0]["breakdown"]["netRealisation"] - r["breakdown"]["netRealisation"]
                r["keyReason"] = f"Yields ₹{int(diff):,} less than #{results[0]['marketName']} due to higher transport & transit deduction."

        return results
