# ml-service/app/routes/buyer_match.py

from fastapi import APIRouter
from app.schemas.buyer_match_schema import BuyerMatchRequest, BuyerMatchResponse
from app.services.match_service import run_buyer_matching

router = APIRouter(prefix="/ml", tags=["Buyer Matching"])

@router.post("/buyer-match", response_model=BuyerMatchResponse)
async def match_buyers(payload: BuyerMatchRequest):
    """
    4. Buyer Matching Endpoint.
    Match based on:
      - Crop
      - Quantity
      - Quality
      - Location
      - Buyer requirement
    Output:
      - Ranked buyer matches with compatibility score and factors
    """
    return run_buyer_matching(payload)
