export interface BuyerRequirementItem {
  id: number;
  buyerId: number;
  buyerName: string;
  buyerType: string;
  isVerified: boolean;
  cropId: number;
  cropName: string;
  cropLocalName: string | null;
  requiredVolumeQuintals: number;
  requiredVolumeKg: number;
  qualitySpecification: string;
  destinationHub: string;
  deliveryWindow: string;
  benchmarkPricePerQuintal: number;
  benchmarkPricePerKg: number;
}

export interface FPOMemberItem {
  farmerId: number;
  name: string;
  fpoCode: string;
  membershipTier: string;
  fpoName: string;
  cropName: string;
  qualityGrade: string;
  isExactMatch: boolean;
  isEligible: boolean;
  location: string;
  proximityKm: number;
  proximityLabel: string;
  availableQtyQuintals: number;
  availableQtyKg: number;
  status: 'ELIGIBLE' | 'INELIGIBLE_GRADE';
  ineligibilityReason: string | null;
}

export interface LotMemberAllocation {
  farmerId: number;
  allocatedQty: number; // in quintals
}

export interface CreatedFPOLotResponse {
  id: number;
  lotCode: string;
  fpoId: number;
  cropId: number;
  totalQuantity: number;
  grade: string;
  offeredPrice: number;
  estimatedGrossValue: number;
  status: string;
  dispatchYard: string;
  destinationHub: string;
  dispatchDate: string;
  crop: { name: string; localName: string | null };
  buyer: { companyName: string } | null;
  members: Array<{
    id: number;
    farmerId: number;
    allocatedQty: number;
    payoutAmount: number;
    farmer: { user: { name: string } };
  }>;
}
