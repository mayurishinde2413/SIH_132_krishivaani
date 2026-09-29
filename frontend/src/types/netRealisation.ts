export interface DeductionDetails {
  grossRevenue: number;
  transportCost: number;
  mandiFees: number;
  expectedWastage: number;
  qualityDeductions: number;
  unloadingPorterage: number;
  netRealisation: number;
  netRealisationPerKg: number;
  retentionPercent: number;
}

export interface MarketNetResult {
  marketId: number;
  marketName: string;
  district: string;
  distanceKm: number;
  quotedPricePerKg: number;
  transitTimeEst: string;
  breakdown: DeductionDetails;
  rank: number;
  isRecommended: boolean;
  keyReason: string;
}

export interface NetRealisationCalculationResponse {
  crop: string;
  quantityKg: number;
  grade: string;
  originDistrict: string;
  recommendedMarket: MarketNetResult | null;
  candidateMarkets: MarketNetResult[];
}
