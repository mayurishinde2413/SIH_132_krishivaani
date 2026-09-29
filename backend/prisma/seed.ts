// backend/prisma/seed.ts
import { PrismaClient, Role, OfferStatus, RescueStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ── Crops ──────────────────────────────────────────────────────────────
  const cropData = [
    { name: 'Wheat',   localName: 'Gehun',   category: 'Grain',     unit: 'quintal' },
    { name: 'Bajra',   localName: 'Bajri',   category: 'Grain',     unit: 'quintal' },
    { name: 'Tomato',  localName: 'Tamatar', category: 'Vegetable', unit: 'quintal' },
    { name: 'Onion',   localName: 'Kanda',   category: 'Vegetable', unit: 'quintal' },
    { name: 'Maize',   localName: 'Makka',   category: 'Grain',     unit: 'quintal' },
    { name: 'Potato',  localName: 'Batata',  category: 'Vegetable', unit: 'quintal' },
    { name: 'Soybean', localName: 'Soya',    category: 'Oilseed',   unit: 'quintal' },
  ];

  const crops: Record<string, number> = {};
  for (const c of cropData) {
    const created = await prisma.crop.upsert({
      where: { name: c.name },
      update: {},
      create: c,
    });
    crops[c.name] = created.id;
  }
  console.log('  ✅ Crops seeded');

  // ── Markets ────────────────────────────────────────────────────────────
  const marketData = [
    { name: 'Pune APMC',        district: 'Pune',        type: 'APMC', latitude: 18.5204, longitude: 73.8567 },
    { name: 'Nashik APMC',      district: 'Nashik',      type: 'APMC', latitude: 19.9975, longitude: 73.7898 },
    { name: 'Solapur APMC',     district: 'Solapur',     type: 'APMC', latitude: 17.6869, longitude: 75.9064 },
    { name: 'Ahmednagar APMC',  district: 'Ahmednagar',  type: 'APMC', latitude: 19.0952, longitude: 74.7496 },
    { name: 'Satara Market',    district: 'Satara',      type: 'Mandi', latitude: 17.6805, longitude: 74.0183 },
    { name: 'Baramati APMC',    district: 'Pune',        type: 'APMC', latitude: 18.1524, longitude: 74.5815 },
  ];

  const markets: Record<string, number> = {};
  for (const m of marketData) {
    const created = await prisma.market.upsert({
      where: { name: m.name },
      update: {},
      create: m,
    });
    markets[m.name] = created.id;
  }
  console.log('  ✅ Markets seeded');

  // ── Market Prices (last 7 days) ────────────────────────────────────────
  const priceMatrix: Array<{
    market: string; crop: string;
    minPrice: number; maxPrice: number; modalPrice: number;
  }> = [
    // Pune
    { market: 'Pune APMC',       crop: 'Wheat',   minPrice: 2100, maxPrice: 2350, modalPrice: 2200 },
    { market: 'Pune APMC',       crop: 'Onion',   minPrice: 1200, maxPrice: 2000, modalPrice: 1600 },
    { market: 'Pune APMC',       crop: 'Tomato',  minPrice: 800,  maxPrice: 1800, modalPrice: 1200 },
    { market: 'Pune APMC',       crop: 'Potato',  minPrice: 900,  maxPrice: 1400, modalPrice: 1100 },
    { market: 'Pune APMC',       crop: 'Soybean', minPrice: 3800, maxPrice: 4200, modalPrice: 4000 },
    // Nashik
    { market: 'Nashik APMC',     crop: 'Onion',   minPrice: 1000, maxPrice: 1900, modalPrice: 1450 },
    { market: 'Nashik APMC',     crop: 'Tomato',  minPrice: 700,  maxPrice: 1600, modalPrice: 1100 },
    { market: 'Nashik APMC',     crop: 'Wheat',   minPrice: 2050, maxPrice: 2300, modalPrice: 2150 },
    { market: 'Nashik APMC',     crop: 'Soybean', minPrice: 3900, maxPrice: 4300, modalPrice: 4100 },
    // Solapur
    { market: 'Solapur APMC',    crop: 'Bajra',   minPrice: 1900, maxPrice: 2200, modalPrice: 2050 },
    { market: 'Solapur APMC',    crop: 'Wheat',   minPrice: 2080, maxPrice: 2280, modalPrice: 2180 },
    { market: 'Solapur APMC',    crop: 'Maize',   minPrice: 1700, maxPrice: 2000, modalPrice: 1850 },
    { market: 'Solapur APMC',    crop: 'Soybean', minPrice: 3750, maxPrice: 4150, modalPrice: 3950 },
    // Ahmednagar
    { market: 'Ahmednagar APMC', crop: 'Onion',   minPrice: 1100, maxPrice: 1950, modalPrice: 1500 },
    { market: 'Ahmednagar APMC', crop: 'Maize',   minPrice: 1650, maxPrice: 1950, modalPrice: 1800 },
    { market: 'Ahmednagar APMC', crop: 'Soybean', minPrice: 3820, maxPrice: 4220, modalPrice: 4020 },
    // Satara
    { market: 'Satara Market',   crop: 'Tomato',  minPrice: 600,  maxPrice: 1500, modalPrice: 1050 },
    { market: 'Satara Market',   crop: 'Potato',  minPrice: 850,  maxPrice: 1350, modalPrice: 1050 },
    { market: 'Satara Market',   crop: 'Wheat',   minPrice: 2060, maxPrice: 2260, modalPrice: 2160 },
    // Baramati
    { market: 'Baramati APMC',   crop: 'Wheat',   minPrice: 2090, maxPrice: 2310, modalPrice: 2200 },
    { market: 'Baramati APMC',   crop: 'Bajra',   minPrice: 1850, maxPrice: 2150, modalPrice: 2000 },
    { market: 'Baramati APMC',   crop: 'Soybean', minPrice: 3900, maxPrice: 4200, modalPrice: 4050 },
  ];

  const today = new Date();
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const priceDate = new Date(today);
    priceDate.setDate(today.getDate() - dayOffset);
    priceDate.setHours(0, 0, 0, 0);

    for (const row of priceMatrix) {
      const variance = (Math.random() - 0.5) * 100; // ±50 Rs variation per day
      await prisma.marketPrice.create({
        data: {
          marketId:   markets[row.market],
          cropId:     crops[row.crop],
          minPrice:   Math.round(row.minPrice + variance),
          maxPrice:   Math.round(row.maxPrice + variance),
          modalPrice: Math.round(row.modalPrice + variance),
          priceDate,
        },
      });
    }
  }
  console.log('  ✅ Market prices seeded (7 days)');

  // ── Market Arrivals ───────────────────────────────────────────────────
  const arrivalMatrix: Array<{ market: string; crop: string; qty: number }> = [
    { market: 'Pune APMC',       crop: 'Wheat',   qty: 1200 },
    { market: 'Pune APMC',       crop: 'Onion',   qty: 3400 },
    { market: 'Pune APMC',       crop: 'Tomato',  qty: 2100 },
    { market: 'Nashik APMC',     crop: 'Onion',   qty: 8500 },
    { market: 'Nashik APMC',     crop: 'Tomato',  qty: 1800 },
    { market: 'Solapur APMC',    crop: 'Bajra',   qty: 900 },
    { market: 'Solapur APMC',    crop: 'Wheat',   qty: 1100 },
    { market: 'Ahmednagar APMC', crop: 'Onion',   qty: 4200 },
    { market: 'Satara Market',   crop: 'Tomato',  qty: 600 },
    { market: 'Baramati APMC',   crop: 'Soybean', qty: 700 },
  ];

  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const arrivalDate = new Date(today);
    arrivalDate.setDate(today.getDate() - dayOffset);
    arrivalDate.setHours(0, 0, 0, 0);

    for (const row of arrivalMatrix) {
      const qtyVariance = (Math.random() - 0.5) * 200;
      await prisma.marketArrival.create({
        data: {
          marketId:    markets[row.market],
          cropId:      crops[row.crop],
          arrivalQty:  Math.round(Math.max(100, row.qty + qtyVariance)),
          arrivalDate,
        },
      });
    }
  }
  console.log('  ✅ Market arrivals seeded');

  // ── FPOs ──────────────────────────────────────────────────────────────
  const fpoData = [
    { name: 'Nashik Grape Growers FPO', district: 'Nashik',     contactPerson: 'Ramesh Patil',   contactPhone: '9876543210', registrationNo: 'MH-FPO-001' },
    { name: 'Pune Vegetable Producers', district: 'Pune',       contactPerson: 'Sanjay More',    contactPhone: '9876543211', registrationNo: 'MH-FPO-002' },
    { name: 'Marathwada Soybean FPO',   district: 'Latur',      contactPerson: 'Vijay Kulkarni', contactPhone: '9876543212', registrationNo: 'MH-FPO-003' },
    { name: 'Baramati Sugarcane FPO',   district: 'Pune',       contactPerson: 'Anita Shinde',   contactPhone: '9876543213', registrationNo: 'MH-FPO-004' },
    { name: 'Solapur Onion Collective', district: 'Solapur',    contactPerson: 'Prakash Jadhav', contactPhone: '9876543214', registrationNo: 'MH-FPO-005' },
  ];

  const fpos: Record<string, number> = {};
  for (const f of fpoData) {
    const created = await prisma.fPO.upsert({
      where: { name: f.name },
      update: {},
      create: f,
    });
    fpos[f.name] = created.id;
  }
  console.log('  ✅ FPOs seeded');

  // ── Users + Farmers ───────────────────────────────────────────────────
  const farmerUsers = [
    { name: 'Ramesh Kumar',    email: 'ramesh@demo.com',  phone: '9001001001', village: 'Junnar',    district: 'Pune',      landHolding: 5.0 },
    { name: 'Priya Patil',     email: 'priya@demo.com',   phone: '9001001002', village: 'Sinnar',    district: 'Nashik',    landHolding: 3.5 },
    { name: 'Suresh Jadhav',   email: 'suresh@demo.com',  phone: '9001001003', village: 'Mohol',     district: 'Solapur',   landHolding: 7.0 },
    { name: 'Anita Shinde',    email: 'anita@demo.com',   phone: '9001001004', village: 'Shrigonda', district: 'Ahmednagar', landHolding: 4.0 },
    { name: 'Manoj More',      email: 'manoj@demo.com',   phone: '9001001005', village: 'Koregaon',  district: 'Satara',    landHolding: 6.0 },
  ];

  const farmerIds: number[] = [];
  for (const fu of farmerUsers) {
    const hash = await bcrypt.hash('demo@1234', 10);
    const user = await prisma.user.upsert({
      where: { email: fu.email },
      update: {},
      create: {
        email: fu.email,
        passwordHash: hash,
        name: fu.name,
        phone: fu.phone,
        role: Role.FARMER,
        farmer: {
          create: {
            village:     fu.village,
            district:    fu.district,
            landHolding: fu.landHolding,
          },
        },
      },
      include: { farmer: true },
    });
    if (user.farmer) farmerIds.push(user.farmer.id);
  }
  console.log('  ✅ Farmer users seeded');

  // ── Users + Buyers ────────────────────────────────────────────────────
  const buyerUsers = [
    { name: 'Fresh Mart Pvt Ltd', email: 'freshmart@demo.com',   phone: '9002001001', companyName: 'Fresh Mart Pvt Ltd',    businessType: 'Retailer',   district: 'Pune' },
    { name: 'AgroExport Co',      email: 'agroexport@demo.com',  phone: '9002001002', companyName: 'AgroExport Co',          businessType: 'Exporter',   district: 'Nashik' },
    { name: 'Spice Route Foods',  email: 'spiceroute@demo.com',  phone: '9002001003', companyName: 'Spice Route Foods',      businessType: 'Processor',  district: 'Pune' },
  ];

  const buyerIds: number[] = [];
  for (const bu of buyerUsers) {
    const hash = await bcrypt.hash('demo@1234', 10);
    const user = await prisma.user.upsert({
      where: { email: bu.email },
      update: {},
      create: {
        email:        bu.email,
        passwordHash: hash,
        name:         bu.name,
        phone:        bu.phone,
        role:         Role.BUYER,
        buyer: {
          create: {
            companyName:  bu.companyName,
            businessType: bu.businessType,
            district:     bu.district,
          },
        },
      },
      include: { buyer: true },
    });
    if (user.buyer) buyerIds.push(user.buyer.id);
  }
  console.log('  ✅ Buyer users seeded');

  // ── FPO Members ───────────────────────────────────────────────────────
  if (farmerIds.length >= 2) {
    await prisma.fPOMember.upsert({
      where: { fpoId_farmerId: { fpoId: fpos['Pune Vegetable Producers'], farmerId: farmerIds[0] } },
      update: {},
      create: { fpoId: fpos['Pune Vegetable Producers'], farmerId: farmerIds[0] },
    });
    await prisma.fPOMember.upsert({
      where: { fpoId_farmerId: { fpoId: fpos['Nashik Grape Growers FPO'], farmerId: farmerIds[1] } },
      update: {},
      create: { fpoId: fpos['Nashik Grape Growers FPO'], farmerId: farmerIds[1] },
    });
    await prisma.fPOMember.upsert({
      where: { fpoId_farmerId: { fpoId: fpos['Solapur Onion Collective'], farmerId: farmerIds[2] } },
      update: {},
      create: { fpoId: fpos['Solapur Onion Collective'], farmerId: farmerIds[2] },
    });
  }
  console.log('  ✅ FPO members seeded');

  // ── Farmer Inventory ─────────────────────────────────────────────────
  const inventoryData = [
    { farmerId: farmerIds[0], crop: 'Wheat',  qty: 50, grade: 'A', askingPrice: 2250 },
    { farmerId: farmerIds[0], crop: 'Onion',  qty: 30, grade: 'B', askingPrice: 1600 },
    { farmerId: farmerIds[1], crop: 'Tomato', qty: 20, grade: 'A', askingPrice: 1300 },
    { farmerId: farmerIds[2], crop: 'Bajra',  qty: 40, grade: 'A', askingPrice: 2100 },
    { farmerId: farmerIds[3], crop: 'Soybean',qty: 35, grade: 'A', askingPrice: 4050 },
    { farmerId: farmerIds[4], crop: 'Potato', qty: 60, grade: 'B', askingPrice: 1100 },
  ];

  if (farmerIds.length >= 5) {
    for (const inv of inventoryData) {
      await prisma.farmerInventory.create({
        data: {
          farmerId:    inv.farmerId,
          cropId:      crops[inv.crop],
          quantity:    inv.qty,
          grade:       inv.grade,
          askingPrice: inv.askingPrice,
          harvestDate: new Date(),
          isAvailable: true,
        },
      });
    }
    console.log('  ✅ Farmer inventory seeded');
  }

  // ── Buyer Requirements ────────────────────────────────────────────────
  const requirementData = [
    { buyerIdx: 0, crop: 'Wheat',   qMin: 100, qMax: 500, price: 2300, district: 'Pune' },
    { buyerIdx: 0, crop: 'Onion',   qMin: 200, qMax: 800, price: 1700, district: 'Nashik' },
    { buyerIdx: 1, crop: 'Tomato',  qMin: 50,  qMax: 300, price: 1400, district: 'Pune' },
    { buyerIdx: 1, crop: 'Soybean', qMin: 100, qMax: 400, price: 4100, district: 'Latur' },
    { buyerIdx: 2, crop: 'Potato',  qMin: 200, qMax: 600, price: 1200, district: 'Satara' },
  ];

  if (buyerIds.length >= 3) {
    for (const req of requirementData) {
      await prisma.buyerRequirement.create({
        data: {
          buyerId:      buyerIds[req.buyerIdx],
          cropId:       crops[req.crop],
          quantityMin:  req.qMin,
          quantityMax:  req.qMax,
          targetPrice:  req.price,
          district:     req.district,
          isActive:     true,
          deliveryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
      });
    }
    console.log('  ✅ Buyer requirements seeded');
  }

  console.log('\n🎉 Seed complete!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
