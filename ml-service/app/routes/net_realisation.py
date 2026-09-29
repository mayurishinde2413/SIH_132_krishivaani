# ml-service/app/routes/net_realisation.py

from fastapi import APIRouter
from app.schemas.realisation_schema import NetRealisationRequest, NetRealisationResponse
from app.services.realisation_service import run_net_realisation_estimation

router = APIRouter(prefix="/ml", tags=["Net Realisation"])

@router.post("/net-realisation", response_model=NetRealisationResponse)
async def estimate_net_realisation(payload: NetRealisationRequest):
    """
    2. Net Realisation Estimation Endpoint.
    Input:
      - Crop
      - Quantity
      - Quality
      - Market
      - Distance
      - Price
      - Transport cost
      - Fees
      - Expected wastage
    Output:
      - Expected net realisation with full deduction waterfall
    """
    return run_net_realisation_estimation(payload)
