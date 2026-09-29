const fs = require('fs');
const path = require('path');

const contextPath = 'c:\\Users\\omshi\\OneDrive\\Desktop\\sih2.0\\frontend\\src\\context\\LanguageContext.tsx';
const scratchPath = 'c:\\Users\\omshi\\OneDrive\\Desktop\\sih2.0\\scratch';

// 1. Read the existing context file
let contextContent = fs.readFileSync(contextPath, 'utf-8');

// 2. Extract existing translations using regex or just keep what we know it has.
// Actually, it's easier to just build the translations object in memory.
const existingTranslations = {
  en: {
    kisanCallCentre: 'Kisan Call Centre:',
    farmerFirst: 'Farmer First',
    tagline: 'Strengthening Market Linkages & Price Discovery for Farmers',
    priceDiscovery: '01 Price Discovery',
    netRealisation: '02 Net Realisation',
    fpoAggregation: '03 FPO Aggregation',
    sellWait: '04 Sell Now / Wait',
    buyerMatching: '05 Buyer Matching & Bidding',
    cropRescue: '06 Crop Rescue',
    verifiedMandi: 'e-NAM Standard Compliant',
    sihPrototype: 'Smart India Hackathon 2024–26 Prototype',
    helplineHours: 'Kisan Helpline: 1800-180-1551 (Mon-Sat, 06:00 - 20:00 IST)',
  },
  mr: {
    kisanCallCentre: 'किसान कॉल सेंटर:',
    farmerFirst: 'शेतकरी प्रथम',
    tagline: 'शेतकऱ्यांसाठी बाजारपेठ जोडणी आणि पारदर्शक भाव शोध',
    priceDiscovery: '०१ भाव शोध (Price Discovery)',
    netRealisation: '०२ निव्वळ नफा (Net Realisation)',
    fpoAggregation: '०३ एफपीओ एकत्रीकरण (FPO Aggregation)',
    sellWait: '०४ विक्री करावी की थांबावे (Sell / Wait)',
    buyerMatching: '०५ थेट खरेदीदार व लिलाव (Bidding)',
    cropRescue: '०६ संकटग्रस्त पीक मदत (Crop Rescue)',
    verifiedMandi: 'e-NAM मानके प्रमाणित',
    sihPrototype: 'स्मार्ट इंडिया हॅकाथॉन २०२४–२६ प्रोटोटाईप',
    helplineHours: 'किसान हेल्पलाईन: १८००-१८०-१५५१ (सोम-शनि, ०६:०० - २०:०० IST)',
  },
  hi: {
    kisanCallCentre: 'किसान कॉल सेंटर:',
    farmerFirst: 'किसान प्रथम',
    tagline: 'किसानों के लिए बाजार संपर्क और सही मूल्य निर्धारण',
    priceDiscovery: '०१ मूल्य खोज (Price Discovery)',
    netRealisation: '०२ शुद्ध प्राप्ति (Net Realisation)',
    fpoAggregation: '०३ एफपीओ एकत्रीकरण (FPO Aggregation)',
    sellWait: '०४ अभी बेचें या प्रतीक्षा करें (Sell / Wait)',
    buyerMatching: '०५ खरीदार मिलान और बोली (Bidding)',
    cropRescue: '०६ फसल बचाव सहायता (Crop Rescue)',
    verifiedMandi: 'e-NAM मानक प्रमाणित',
    sihPrototype: 'स्मार्ट इंडिया हैकाथॉन २०२४–२६ प्रोटोटाइप',
    helplineHours: 'किसान हेल्पलाइन: १८००-१८०-१५५१ (सोम-शनि, ०६:०० - २०:०० IST)',
  },
};

// 3. Merge all new JSON files
const files = fs.readdirSync(scratchPath).filter(f => f.endsWith('.json'));

for (const file of files) {
  const filePath = path.join(scratchPath, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  if (data.en) {
    existingTranslations.en = { ...existingTranslations.en, ...data.en };
  }
  if (data.mr) {
    existingTranslations.mr = { ...existingTranslations.mr, ...data.mr };
  }
  if (data.hi) {
    existingTranslations.hi = { ...existingTranslations.hi, ...data.hi };
  }
}

// 4. Construct the new LanguageContext.tsx
const newTranslationsString = JSON.stringify(existingTranslations, null, 2);

// We know the translations object starts at `const translations: Record<Language, Record<string, string>> = {`
// and ends at `};` right before `const LanguageContext = createContext...`

const regex = /const translations: Record<Language, Record<string, string>> = [\s\S]*?\n\};\n/m;
const replacement = `const translations: Record<Language, Record<string, string>> = ${newTranslationsString};\n`;

const newContextContent = contextContent.replace(regex, replacement);

fs.writeFileSync(contextPath, newContextContent, 'utf-8');
console.log('Successfully updated LanguageContext.tsx with ' + Object.keys(existingTranslations.en).length + ' translation keys.');
