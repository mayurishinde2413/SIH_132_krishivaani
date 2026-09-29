import prisma from '../database/prismaClient';
import { RescueStatus } from '@prisma/client';

export interface CreateRescueCaseInput {
  farmerId: number;
  cropId?: number;
  cropName?: string;
  problemType: string;
  quantity: number;
  description?: string;
  actionTaken?: string;
}

export const createRescueCase = async (input: CreateRescueCaseInput) => {
  const { farmerId, cropId, cropName, problemType, quantity, description, actionTaken } = input;

  let resolvedCropId = cropId;
  if (!resolvedCropId && cropName) {
    const crop = await prisma.crop.findFirst({
      where: { name: { equals: cropName, mode: 'insensitive' } },
    });
    resolvedCropId = crop ? crop.id : 3; // fallback to Tomato (id 3)
  } else if (!resolvedCropId) {
    resolvedCropId = 3; // Tomato default
  }

  const descText = description || `Emergency triggered: ${problemType}. Action initiated: ${actionTaken || 'Alternative rerouting'}.`;
  const fullDescription = `[${problemType}] ${descText}`;

  return prisma.rescueCase.create({
    data: {
      farmerId,
      cropId: resolvedCropId,
      description: fullDescription,
      quantity,
      status: RescueStatus.OPEN,
    },
    include: {
      crop: { select: { id: true, name: true, localName: true } },
      farmer: {
        include: { user: { select: { id: true, name: true, phone: true } } },
      },
    },
  });
};

export const getRescueCasesByFarmer = async (farmerId: number) => {
  return prisma.rescueCase.findMany({
    where: { farmerId },
    include: {
      crop: { select: { id: true, name: true, localName: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getAllRescueCases = async () => {
  return prisma.rescueCase.findMany({
    include: {
      crop: { select: { id: true, name: true, localName: true } },
      farmer: {
        include: { user: { select: { id: true, name: true, phone: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const updateRescueCaseStatus = async (
  id: number,
  status: RescueStatus,
  farmerId?: number
) => {
  const where = farmerId ? { id, farmerId } : { id };

  return prisma.rescueCase.update({
    where,
    data: {
      status,
      resolvedAt: status === RescueStatus.RESOLVED ? new Date() : null,
    },
    include: {
      crop: { select: { id: true, name: true, localName: true } },
    },
  });
};

// ─── Module 06 Rescue Strategy & Intelligence ────────────────────────────────

export const getRescueOptions = (problemType: string) => {
  const normalized = problemType.toLowerCase();

  const baseOptions = [
    {
      id: 'alternative_buyer',
      title: 'Find Alternative Buyer',
      badge: 'Recommended',
      badgeType: 'recommended',
      description: '3 verified commercial buyers standing by with direct farmgate trucks.',
      actionText: 'Active View Below ↓',
      actionKey: 'view_buyers',
      isPrimary: true,
    },
    {
      id: 'fpo_pool',
      title: 'Contact FPO Aggregator',
      badge: 'FPO Pool',
      badgeType: 'fpo',
      description: 'Route lot into Baramati Agro FPO institutional basket for collective fulfilment.',
      actionText: 'Transfer to FPO (₹2,650 Guaranteed)',
      actionKey: 'contact_fpo',
      priceGuaranteed: 2650,
    },
    {
      id: 'nearby_market',
      title: 'Check Nearby Market',
      badge: 'Mandi Yard',
      badgeType: 'market',
      description: 'Divert truck 14 km to Phaltan APMC yard with active morning auction bidding.',
      actionText: 'View Real-Time Yard Status',
      actionKey: 'view_market',
      marketName: 'Phaltan APMC Yard',
      distanceKm: 14,
    },
    {
      id: 'cold_storage',
      title: 'Store Crop Temporarily',
      badge: 'Safe Hold',
      badgeType: 'storage',
      description: 'Kisan Cold Bay 6 km away offers 72h preservation bay at subsidized rate.',
      actionText: 'Reserve 30 Q Chamber Bay',
      actionKey: 'book_storage',
      facilityName: 'Kisan Cold Bay',
      ratePerDay: '₹40/Q/Day',
    },
  ];

  if (normalized.includes('transport')) {
    baseOptions[0].isPrimary = false;
    baseOptions[1].badge = 'Priority Fleet';
    baseOptions[1].description = 'FPO emergency fleet pickup dispatched within 45 mins from Baramati.';
    baseOptions[3].badge = 'Safe Hold';
  } else if (normalized.includes('quality')) {
    baseOptions[0].description = '2 food processing hubs accept B/B+ grade puree lots with zero deductions.';
    baseOptions[1].description = 'Request immediate independent FPO quality re-assay and mediator stamp.';
  } else if (normalized.includes('other') || normalized.includes('emergency')) {
    baseOptions[3].badge = 'Priority Hold';
    baseOptions[3].isPrimary = true;
  }

  return baseOptions;
};

export const getRescueBuyers = async (cropName = 'Tomato') => {
  return [
    {
      id: 101,
      buyerName: 'ABC Foods Pvt. Ltd.',
      tag: 'Best Match • Farmgate Pickup',
      tagColor: 'green',
      location: 'Pune / Hadapsar',
      crop: `${cropName} (Grade A)`,
      neededQuantity: '20 Q (Partial Lot)',
      pricePerQuintal: 2800,
      pricePerKg: 28,
      payoutNote: 'Instant UPI/RTGS',
      perks: [
        'e-NAM Verified Escrow',
        'Pickup in 90 mins',
        'Weighment at Gate',
      ],
      phone: '+91 98230 44120',
      actionLabel: 'Contact Buyer (Direct Line)',
    },
    {
      id: 102,
      buyerName: 'Sahyadri Agro Processing Hub',
      tag: 'Fast Discharge • 8 km Away',
      tagColor: 'blue',
      location: 'MIDC Baramati',
      crop: `${cropName} (Processing / Puree)`,
      neededQuantity: '15 Quintals',
      pricePerQuintal: 2550,
      pricePerKg: 25.5,
      payoutNote: 'Same-Day Cash / UPI on Gate',
      perks: [
        'Accepts Mixed Grade Lots',
        'Drop-off at Plant 2',
      ],
      phone: '+91 94220 81930',
      actionLabel: 'Contact Buyer (Plant Dispatch)',
    },
    {
      id: 103,
      buyerName: 'MahaKisan Agro Direct',
      tag: 'Spot Yard Clearance',
      tagColor: 'amber',
      location: 'Baramati Bypass',
      crop: `${cropName} (All Grades)`,
      neededQuantity: '30 Quintals',
      pricePerQuintal: 2600,
      pricePerKg: 26,
      payoutNote: 'RTGS Within 2 Hours',
      perks: [
        'Instant Gate Entry Pass',
        'Zero Mandi Cess on Distress Lots',
      ],
      phone: '+91 91580 12345',
      actionLabel: 'Contact Desk',
    },
  ];
};

export const getRescueMarkets = async (cropName = 'Tomato') => {
  return [
    {
      id: 201,
      name: 'Phaltan APMC Yard',
      distanceKm: 14,
      transitTime: '~25 mins',
      modalPrice: 2720,
      unit: 'Q',
      arrivalCapacity: '180 Q Open Bay',
      activeTraders: 12,
      corridorStatus: 'Direct Corridor Route Clear',
      status: 'Open Now',
      isRecommended: true,
      streamUrl: '#',
    },
    {
      id: 202,
      name: 'Baramati APMC Yard',
      distanceKm: 4,
      transitTime: '~10 mins',
      modalPrice: 2650,
      unit: 'Q',
      arrivalCapacity: '240 Q Open Bay',
      activeTraders: 18,
      corridorStatus: 'Minor Gate Queue (15 min)',
      status: 'Open Now',
      isRecommended: false,
      streamUrl: '#',
    },
    {
      id: 203,
      name: 'Indapur Sub-Mandi',
      distanceKm: 28,
      transitTime: '~45 mins',
      modalPrice: 2690,
      unit: 'Q',
      arrivalCapacity: '110 Q Open Bay',
      activeTraders: 8,
      corridorStatus: 'Clear Highway Access',
      status: 'Auction Closes 1 PM',
      isRecommended: false,
      streamUrl: '#',
    },
  ];
};

export const getRescueStorage = async () => {
  return [
    {
      id: 301,
      facilityName: 'Tomato Holding Facility (Kisan Cold Bay #3)',
      location: 'Baramati MIDC Phase 2 (6 km away)',
      availableCapacity: '120 Quintals (Chamber Bay 3A)',
      rate: '₹40 / Q / Day',
      maxDuration: '72 hours preservation guarantee',
      humidityControl: '90-95% RH Controlled',
      contactPhone: '1800-180-1551',
      actionLabel: 'Pre-book 3-Day Space',
    },
    {
      id: 302,
      facilityName: 'AgroVentures Solar Dehydration Hold',
      location: 'Malegaon Baramati (9 km away)',
      availableCapacity: '60 Quintals',
      rate: '₹30 / Q / Day',
      maxDuration: '5 Days buffer holding',
      humidityControl: 'Solar Powered Cool Shading',
      contactPhone: '1800-180-1551',
      actionLabel: 'Reserve Hold Space',
    },
  ];
};
