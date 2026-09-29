# ml-service/app/schemas/buyer_match_schema.py

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class BuyerProfileInput(BaseModel):
    buyer_id: int = Field(..., example=1)
    buyer_name: str = Field(..., example="Fresh Agro Pvt. Ltd.")
    buyer_type: Optional[str] = "Retail Chain & Cold-Chain Exporter"
    location: Optional[str] = "Pune"
    distance_km: Optional[float] = 25.0
    crop_required: Optional[str] = "Tomato"
    quantity_min: Optional[float] = 10.0
    quantity_max: Optional[float] = 50.0
    target_price: Optional[float] = 2900.0
    preferred_grade: Optional[str] = "Grade A"
    historical_rating: Optional[float] = 4.8
    deals_fulfilled: Optional[int] = 142
    payment_terms: Optional[str] = "DBT: 24hr Escrow"

class BuyerMatchRequest(BaseModel):
    crop: str = Field(..., example="Tomato")
    quantity: float = Field(..., example=30.0, description="Quantity in quintals")
    quality: str = Field(default="Grade A", example="Grade A")
    location: str = Field(default="Baramati, Pune", example="Baramati, Pune")
    asking_price: Optional[float] = Field(default=2950.0, description="Farmer asking price per quintal")
    buyers: Optional[List[BuyerProfileInput]] = None

class MatchedBuyerResult(BaseModel):
    buyer_id: int
    buyer_name: str
    buyer_type: str
    match_score: int
    is_recommended: bool
    offered_price_per_quintal: float
    offered_price_per_kg: float
    total_lot_value: float
    distance_km: float
    rating: float
    deals_fulfilled: int
    compatibility_breakdown: Dict[str, Any]
    match_factors: List[str]

class BuyerMatchResponse(BaseModel):
    crop: str
    quantity: float
    quality: str
    location: str
    total_matches_found: int
    ranked_buyers: List[MatchedBuyerResult]
    status: str = "Prototype estimation"
    model_metadata: Dict[str, Any]
