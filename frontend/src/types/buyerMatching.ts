export interface BuyerMatchItem {
  id: number;
  buyerId: number;
  buyerName: string;
  buyerType: string;
  buyerCategory: string;
  rating: number;
  dealsFulfilled: number;
  matchScore: number;
  isRecommended: boolean;
  cropId: number;
  cropName: string;
  offeredPricePerQuintal: number;
  offeredPricePerKg: number;
  totalLotValue: number;
  neededQuantityQuintals: number;
  distanceKm: number;
  hubLocation: string;
  deliveryDate: string;
  paymentTerms: string;
  points: string[];
}

export interface TransactionMilestone {
  orderId: string;
  buyerName: string;
  procurementRep: string;
  quantityQuintals: number;
  pricePerKg: number;
  totalEscrowLocked: number;
  designatedDispatch: string;
  currentStep: number; // 1 to 5
  statusLabel: string;
}
