export interface CurrentSituationData {
  currentPrice: string;
  priceTrend: string;
  weather: string;
  perishability: string;
  storage: string;
  mandiInflow: string;
}

export interface SellNowOptionData {
  title: string;
  subtitle: string;
  expectedReturn: number;
  pricePerQ: number;
  storageCost: number;
  isRecommended: boolean;
  points: string[];
}

export interface WaitOptionData {
  title: string;
  subtitle: string;
  potentialGrossReturn: number;
  potentialNetReturn: number;
  potentialPrice: number;
  priceUpside: number;
  storageCost: number;
  spoilageCost: number;
  spoilageRisk: string;
  weatherRisk: string;
  points: string[];
}

export interface ComparisonFactorItem {
  factor: string;
  sellNow: string;
  wait: string;
  meaning: string;
}

export interface DecisionSupportData {
  suggestion: string;
  summary: string;
  keyPoints: string[];
  whenToWait: string;
}

export interface SellWaitAnalysisResponse {
  crop: string;
  quantityQuintals: number;
  quantityKg: number;
  currentMarketPrice: number;
  currentSituation: CurrentSituationData;
  sellNow: SellNowOptionData;
  waitOption: WaitOptionData;
  comparisonFactors: ComparisonFactorItem[];
  decisionSupport: DecisionSupportData;
}
