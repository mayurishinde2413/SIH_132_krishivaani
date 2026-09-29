# ml-service/app/services/match_service.py

from typing import List, Dict, Any
from app.models.buyer_matcher import BuyerMatcher
from app.schemas.buyer_match_schema import BuyerMatchRequest, BuyerMatchResponse, MatchedBuyerResult
from app.utils.constants import STATUS_PROTOTYPE
from app.utils.metrics import build_model_metadata

matcher = BuyerMatcher()

def run_buyer_matching(payload: BuyerMatchRequest) -> BuyerMatchResponse:
    candidates = [b.dict() for b in payload.buyers] if payload.buyers else None
    
    matches = matcher.match(
        crop=payload.crop,
        quantity=payload.quantity,
        quality=payload.quality,
        location=payload.location,
        asking_price=payload.asking_price or 2950.0,
        candidate_buyers=candidates
    )

    ranked_results = [MatchedBuyerResult(**m) for m in matches]

    return BuyerMatchResponse(
        crop=payload.crop,
        quantity=payload.quantity,
        quality=payload.quality,
        location=payload.location,
        total_matches_found=len(ranked_results),
        ranked_buyers=ranked_results,
        status=STATUS_PROTOTYPE,
        model_metadata=build_model_metadata(
            model_name=matcher.model_name,
            algorithm="Multi-Criteria Decision Analysis (MCDA) Scoring Vector",
            status=STATUS_PROTOTYPE
        )
    )
