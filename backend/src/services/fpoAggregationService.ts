import prisma from '../database/prismaClient';

export interface CreateLotAllocationInput {
  farmerId: number;
  allocatedQty: number; // in quintals
}

export interface CreateFPOLotInput {
  fpoId?: number;
  buyerId?: number;
  requirementId?: number;
  cropName: string;
  grade: string;
  offeredPrice: number; // in Rs per quintal
  allocations: CreateLotAllocationInput[];
  dispatchYard?: string;
  destinationHub?: string;
  dispatchDate?: string;
}

// 1. Get active buyer requirements with rich specifications
export const getActiveFPORequirements = async () => {
  const reqs = await prisma.buyerRequirement.findMany({
    where: { isActive: true },
    include: {
      crop: true,
      buyer: {
        include: {
          user: { select: { name: true, phone: true, email: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Enrich with verified badges, destination hubs, and delivery windows
  return reqs.map((r) => {
    const destinationHub = r.district
      ? `${r.district} Regional Yard (${r.district} APMC)`
      : 'Pune Regional Yard (Gultekdi)';

    const qualitySpec =
      r.crop.name.toLowerCase() === 'tomato'
        ? 'Grade A (Firm Red, >65mm)'
        : r.crop.name.toLowerCase() === 'onion'
        ? 'Grade A (Cured, >50mm)'
        : 'Grade A+ (Processing Standard)';

    return {
      id: r.id,
      buyerId: r.buyerId,
      buyerName: r.buyer.companyName || r.buyer.user.name,
      buyerType: r.buyer.businessType || 'Institutional Buyer',
      isVerified: true,
      cropId: r.cropId,
      cropName: r.crop.name,
      cropLocalName: r.crop.localName,
      requiredVolumeQuintals: r.quantityMax || 50,
      requiredVolumeKg: (r.quantityMax || 50) * 100,
      qualitySpecification: qualitySpec,
      destinationHub,
      deliveryWindow: r.deliveryDate
        ? new Date(r.deliveryDate).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        : '25 Sep 2026 (Dispatch in 24 hrs)',
      benchmarkPricePerQuintal: r.targetPrice || 2900,
      benchmarkPricePerKg: Number(((r.targetPrice || 2900) / 100).toFixed(2)),
    };
  });
};

// 2. Get eligible FPO members for a cluster / requirement
export const getFPOMembersForRequirement = async (cropName: string, requiredGrade = 'Grade A') => {
  // Resolve crop
  const crop = await prisma.crop.findFirst({
    where: { name: { equals: cropName, mode: 'insensitive' } },
  });

  const cropId = crop ? crop.id : 3; // Tomato default

  // Fetch farmers who have inventory or FPO membership
  const farmers = await prisma.farmer.findMany({
    include: {
      user: { select: { name: true, phone: true } },
      fpoMembers: { include: { fpo: true } },
      inventory: {
        where: { cropId },
      },
    },
    take: 10,
  });

  const clusterDistances = [5, 8, 12, 14, 18, 22];

  return farmers.map((f, idx) => {
    const inv = f.inventory[0];
    const availQty = inv ? inv.quantity : 15 + ((idx * 5) % 15);
    const farmerGrade = idx === 3 ? 'Grade B' : 'Grade A';
    const isEligible = farmerGrade.toLowerCase().includes('grade a');

    const fpoRef = f.fpoMembers[0]?.fpo?.name || 'Baramati Kisan Producer Co.';
    const fpoCode = `EC:SFPO-M-${100 + f.id}`;

    return {
      farmerId: f.id,
      name: f.user.name,
      fpoCode,
      membershipTier: idx < 2 ? 'Member Tier 1' : 'Member Tier 2',
      fpoName: fpoRef,
      cropName: crop ? crop.name : cropName,
      qualityGrade: farmerGrade,
      isExactMatch: isEligible,
      isEligible,
      location: `${f.village || 'Baramati'}, ${f.district || 'Pune'}`,
      proximityKm: clusterDistances[idx % clusterDistances.length],
      proximityLabel: `Baramati Cluster (${clusterDistances[idx % clusterDistances.length]} km)`,
      availableQtyQuintals: availQty,
      availableQtyKg: availQty * 100,
      status: isEligible ? 'ELIGIBLE' : 'INELIGIBLE_GRADE',
      ineligibilityReason: isEligible ? null : 'Grade B produce cannot be mixed with Grade A buyer contract lots.',
    };
  });
};

// 3. Aggregate common FPO Lot in PostgreSQL
export const aggregateFPOLot = async (input: CreateFPOLotInput) => {
  const crop = await prisma.crop.findFirst({
    where: { name: { equals: input.cropName, mode: 'insensitive' } },
  });
  const cropId = crop ? crop.id : 3;

  // Resolve default FPO (e.g. Baramati FPO or first FPO)
  let fpoId = input.fpoId;
  if (!fpoId) {
    const fpo = await prisma.fPO.findFirst();
    fpoId = fpo ? fpo.id : 1;
  }

  const totalQuantity = input.allocations.reduce((sum, a) => sum + a.allocatedQty, 0);
  const estimatedGrossValue = Math.round(totalQuantity * input.offeredPrice);

  // Generate unique Lot Code
  const count = await prisma.fPOLot.count();
  const lotCode = `#FPO-LOT-${String(count + 1).padStart(3, '0')}`;

  const createdLot = await prisma.fPOLot.create({
    data: {
      lotCode,
      fpoId,
      cropId,
      buyerId: input.buyerId || null,
      requirementId: input.requirementId || null,
      totalQuantity,
      grade: input.grade || 'Grade A (FAQ Standard)',
      offeredPrice: input.offeredPrice,
      estimatedGrossValue,
      status: 'SUBMITTED',
      dispatchYard: input.dispatchYard || 'Baramati FPO Common Service Center (CSC Yard 2)',
      destinationHub: input.destinationHub || 'Pune Distribution Hub (Fresh Agro Pvt. Ltd.)',
      dispatchDate: input.dispatchDate ? new Date(input.dispatchDate) : new Date(Date.now() + 24 * 3600 * 1000),
      members: {
        create: input.allocations.map((a) => ({
          farmerId: a.farmerId,
          allocatedQty: a.allocatedQty,
          payoutAmount: Math.round(a.allocatedQty * input.offeredPrice * 0.98), // 2% FPO reserve retained
          status: 'ALLOCATED',
        })),
      },
    },
    include: {
      fpo: true,
      crop: true,
      buyer: { include: { user: true } },
      members: {
        include: {
          farmer: { include: { user: true } },
        },
      },
    },
  });

  return createdLot;
};

// 4. Get FPO Lot by ID
export const getFPOLotById = async (id: number) => {
  const lot = await prisma.fPOLot.findUnique({
    where: { id },
    include: {
      fpo: true,
      crop: true,
      buyer: { include: { user: true } },
      members: {
        include: {
          farmer: { include: { user: true } },
        },
      },
    },
  });

  return lot;
};
