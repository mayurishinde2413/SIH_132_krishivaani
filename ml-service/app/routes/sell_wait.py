# ml-service/app/routes/sell_wait.py

from fastapi import APIRouter
from app.schemas.sell_wait_schema import SellWaitAnalysisRequest, SellWaitAnalysisResponse
from app.services.sell_wait_service import run_sell_wait_analysis

router = APIRouter(prefix="/ml", tags=["Sell Now vs Wait"])

@router.post("/sell-wait", response_model=SellWaitAnalysisResponse)
async def analyze_sell_wait_decision(payload: SellWaitAnalysisRequest):
    """
    3. Sell Now / Wait Decision Engine.
    Uses:
      - Current price
      - Historical price trend
      - Weather
      - Perishability
      - Storage cost
      - Expected future price
    Output:
      - Estimated comparison between selling now and waiting
    """
    return run_sell_wait_analysis(payload)
