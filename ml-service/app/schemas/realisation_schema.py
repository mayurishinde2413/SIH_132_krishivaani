# ml-service/app/schemas/realisation_schema.py

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class MarketCostInput(BaseModel):
    marketId: Optional[int] = 1
    name: Optional[str] = "Pune APMC"
    district: Optional[str] = "Pune"
    distanceKm: Optional[float] = 25.0
    quotedPricePerKg: Optional[float] = 28.0
    transportCostOverride: Optional[float] = None
    feesOverride: Optional[float] = None
    wastageOverride: Optional[float] = None

class NetRealisationRequest(BaseModel):
    crop: str = Field(..., example="Tomato")
    quantity: Optional[float] = Field(default=3000.0, description="Quantity in kg or quintals")
    quantityKg: Optional[float] = None
    quality: Optional[str] = Field(default="Grade A (FAQ Standard)", description="Quality / Grade", example="Grade A")
    grade: Optional[str] = None
    market: Optional[str] = Field(default="Pune APMC")
    distance: Optional[float] = Field(default=25.0, description="Distance in km")
    price: Optional[float] = Field(default=28.0, description="Quoted price per unit")
    transport_cost: Optional[float] = None
    fees: Optional[float] = None
    expected_wastage: Optional[float] = None
    originDistrict: Optional[str] = "Pune"
    harvestDate: Optional[str] = None
    marketPrices: Optional[List[Dict[str, Any]]] = None

class DeductionBreakdown(BaseModel):
    grossRevenue: float
    transportCost: float
    mandiFees: float
    expectedWastage: float
    qualityDeductions: float
    unloadingPorterage: float
    netRealisation: float
    netRealisationPerKg: float
    retentionPercent: float

class NetRealisationResponse(BaseModel):
    crop: str
    quantityKg: float
    quality: str
    expected_net_realisation: float
    net_realisation_per_unit: float
    gross_revenue: float
    total_deductions: float
    retention_percentage: float
    breakdown: DeductionBreakdown
    status: str = "Prototype estimation"
    model_metadata: Dict[str, Any]
    candidateMarkets: Optional[List[Dict[str, Any]]] = None
    recommendedMarket: Optional[Dict[str, Any]] = None
