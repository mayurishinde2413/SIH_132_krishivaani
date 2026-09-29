# ml-service/app/models/buyer_matcher.py

from typing import List, Dict, Any, Optional
from app.utils.constants import STATUS_PROTOTYPE
from app.utils.metrics import build_model_metadata

class BuyerMatcher:
    """
    Multi-Criteria Decision Analysis (MCDA) Buyer Matching Engine.
    Evaluates compatibility across:
      - Crop identity & variety alignment (35%)
      - Quantity fit & lot tolerance (25%)
      - Grade / Quality requirement match (20%)
      - Geographic distance & logistics convenience (15%)
      - Historical counterparty settlement reliability (5%)
    """

    def __init__(self):
        self.model_name = "BuyerMatcher-MCDA-v1.0"

    def match(
        self,
        crop: str,
        quantity: float,
        quality: str,
        location: str,
        asking_price: float = 2950.0,
        candidate_buyers: Optional[List[Dict[str, Any]]] = None
    ) -> List[Dict[str, Any]]:
        # Use provided candidate list or built-in default institutional buyer pool
        buyers = candidate_buyers or self._default_buyer_pool(crop)

        results = []
        for b in buyers:
            score = 0.0
            breakdown = {}

            # 1. Crop Match (Max 35 pts)
            b_crop = b.get("crop_required", b.get("crop", "")).lower()
            if crop.lower() in b_crop or b_crop in crop.lower():
                crop_score = 35.0
            else:
                crop_score = 10.0
            score += crop_score
            breakdown["crop_alignment_score"] = crop_score

            # 2. Quantity Fit (Max 25 pts)
            q_min = float(b.get("quantity_min", 5.0))
            q_max = float(b.get("quantity_max", 100.0))
            if q_min <= quantity <= q_max:
                qty_score = 25.0
                qty_desc = "Exact lot size fit within buyer demand"
            elif quantity < q_min:
                qty_score = max(5.0, 25.0 - (q_min - quantity) * 1.5)
                qty_desc = "Partial lot below buyer preferred batch size"
            else:
                qty_score = max(8.0, 25.0 - (quantity - q_max) * 0.8)
                qty_desc = "Lot exceeds single truck batch (requires multi-dispatch)"
            score += qty_score
            breakdown["quantity_fit_score"] = round(qty_score, 1)

            # 3. Grade / Quality Match (Max 20 pts)
            b_grade = b.get("preferred_grade", "Grade A").lower()
            farmer_grade = quality.lower()
            if b_grade in farmer_grade or farmer_grade in b_grade or "grade a" in farmer_grade:
                grade_score = 20.0
            elif "grade b" in farmer_grade and ("processing" in b_grade or "mixed" in b_grade):
                grade_score = 18.0
            else:
                grade_score = 10.0
            score += grade_score
            breakdown["grade_compatibility_score"] = grade_score

            # 4. Location & Distance Proximity (Max 15 pts)
            dist = float(b.get("distance_km", 25.0))
            if dist <= 10.0:
                dist_score = 15.0
            elif dist <= 30.0:
                dist_score = 12.0
            elif dist <= 60.0:
                dist_score = 8.0
            else:
                dist_score = 4.0
            score += dist_score
            breakdown["proximity_score"] = dist_score

            # 5. Counterparty Reliability & Rating (Max 5 pts)
            rating = float(b.get("historical_rating", 4.5))
            rel_score = round(min(5.0, (rating / 5.0) * 5.0), 1)
            score += rel_score
            breakdown["reliability_score"] = rel_score

            # Normalize to 0-100% integer
            final_match_pct = int(min(98, max(60, round(score))))

            # Rate mapping
            target_rate = float(b.get("target_price", 2800.0))
            rate_per_kg = round(target_rate / 100.0, 2)
            lot_total = round(quantity * target_rate)

            # Match Factors tags
            factors = [
                f"Demand Match: {quantity} Q lot fits buyer range ({q_min}-{q_max} Q)",
                f"Proximity: {dist} km from farm gate",
                f"Settlement: {b.get('payment_terms', 'DBT: 24hr Escrow')}"
            ]

            results.append({
                "buyer_id": b.get("buyer_id", 1),
                "buyer_name": b.get("buyer_name", "Agro Buyer"),
                "buyer_type": b.get("buyer_type", "Verified Institutional Buyer"),
                "match_score": final_match_pct,
                "is_recommended": False,
                "offered_price_per_quintal": target_rate,
                "offered_price_per_kg": rate_per_kg,
                "total_lot_value": lot_total,
                "distance_km": dist,
                "rating": rating,
                "deals_fulfilled": b.get("deals_fulfilled", 80),
                "compatibility_breakdown": breakdown,
                "match_factors": factors
            })

        # Sort descending by match score
        results.sort(key=lambda x: x["match_score"], reverse=True)
        if results:
            results[0]["is_recommended"] = True

        return results

    def _default_buyer_pool(self, crop: str) -> List[Dict[str, Any]]:
        return [
            {
                "buyer_id": 1,
                "buyer_name": "Fresh Agro Pvt. Ltd.",
                "buyer_type": "Retail Chain & Cold-Chain Exporter",
                "location": "Pune (25 km)",
                "distance_km": 25.0,
                "crop_required": crop,
                "quantity_min": 15.0,
                "quantity_max": 50.0,
                "target_price": 2900.0,
                "preferred_grade": "Grade A (Firm Red)",
                "historical_rating": 4.9,
                "deals_fulfilled": 142,
                "payment_terms": "DBT: 24hr Escrow"
            },
            {
                "buyer_id": 2,
                "buyer_name": "Sahyadri Agro Retails",
                "buyer_type": "Hypermarket Network & Canneries",
                "location": "Baramati (8 km)",
                "distance_km": 8.0,
                "crop_required": crop,
                "quantity_min": 10.0,
                "quantity_max": 40.0,
                "target_price": 2850.0,
                "preferred_grade": "Grade A / B+ Combo",
                "historical_rating": 4.7,
                "deals_fulfilled": 89,
                "payment_terms": "DBT: Same-Day RTGS"
            },
            {
                "buyer_id": 3,
                "buyer_name": "KisanSetu Food Park",
                "buyer_type": "Sauce, Puree & Pulp Industrialist",
                "location": "Shirwal (35 km)",
                "distance_km": 35.0,
                "crop_required": crop,
                "quantity_min": 25.0,
                "quantity_max": 80.0,
                "target_price": 2780.0,
                "preferred_grade": "Bulk Processing Standard",
                "historical_rating": 4.6,
                "deals_fulfilled": 61,
                "payment_terms": "DBT: 48-hr e-NAM"
            }
        ]
