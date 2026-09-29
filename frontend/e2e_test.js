const axios = require('axios');

async function runE2ETest() {
  console.log('--- STARTING E2E TEST ---');
  try {
    // 1. Register Farmer
    console.log('1. Registering Farmer...');
    let res = await axios.post('http://localhost:5000/api/auth/register', {
      email: `testfarmer_${Date.now()}@demo.com`,
      password: 'demo@1234',
      confirmPassword: 'demo@1234',
      name: 'Test Farmer E2E',
      phone: `99${Math.floor(Math.random() * 100000000)}`,
      role: 'FARMER',
      district: 'Pune',
      village: 'Test Village',
      taluka: 'Test Taluka',
      state: 'Maharashtra',
      primaryCrop: 'Wheat',
      landHolding: 2
    });
    console.log('Register Response:', res.data.success);
    const token = res.data.data.token;
    const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

    // 2. Price Discovery - View Markets
    console.log('\n2. Price Discovery (Markets)...');
    res = await axios.get('http://localhost:5000/api/markets/nearby?district=Pune&cropId=1&radius=50', authHeaders);
    console.log('Markets Found:', res.data.data.length);

    // 3. Market Details (Price History)
    console.log('\n3. Market Details...');
    const marketId = res.data.data[0].id;
    res = await axios.get(`http://localhost:5000/api/markets/${marketId}/prices?cropId=1`, authHeaders);
    console.log('Price History length:', res.data.data.priceHistory.length);

    // 4. Net Realisation
    console.log('\n4. Net Realisation Calculation...');
    res = await axios.post('http://localhost:5000/api/net-realisation/calculate', {
      cropName: 'Wheat',
      quantityKg: 5000,
      grade: 'Grade A',
      district: 'Pune',
    }, authHeaders);
    console.log('Realisation Models Count:', res.data.data.length);

    // 5. Sell Wait Analysis
    console.log('\n5. Sell Wait Analysis...');
    res = await axios.post('http://localhost:5000/api/sell-wait/analyze', {
      cropName: 'Wheat',
      quantityQuintals: 50,
      currentMarketPrice: 2200,
      hasStorage: true,
      farmerDistrict: 'Pune'
    }, authHeaders);
    console.log('Sell/Wait Recommendation:', res.data.data.recommendation);

    // 6. Buyer Matching
    console.log('\n6. Buyer Matching...');
    res = await axios.get('http://localhost:5000/api/buyers/matches?crop=Wheat&quantity=50&district=Pune', authHeaders);
    console.log('Matches Found:', res.data.data.length);

    // 7. Send Offer
    console.log('\n7. Send Offer...');
    if (res.data.data.length > 0) {
      const buyerId = res.data.data[0].buyer.id;
      res = await axios.post('http://localhost:5000/api/bids', {
        buyerId,
        cropName: 'Wheat',
        quantityQuintals: 50,
        askingPricePerQuintal: 2300,
        grade: 'Grade A',
        message: 'E2E Test Offer'
      }, authHeaders);
      console.log('Offer Created ID:', res.data.data.id);
      
      const offerId = res.data.data.id;
      
      // Accept Offer
      console.log('\n8. Accept Offer...');
      res = await axios.post(`http://localhost:5000/api/bids/${offerId}/accept`, {}, authHeaders);
      console.log('Offer Accepted status:', res.data.data.status);
    }

    // 9. Crop Rescue
    console.log('\n9. Crop Rescue Case...');
    res = await axios.post('http://localhost:5000/api/rescue/create', {
      cropName: 'Wheat',
      quantityQuintals: 50,
      triggerType: 'buyer_cancelled',
      description: 'E2E Test Rescue'
    }, authHeaders);
    console.log('Rescue Case Created:', res.data.data.id);

    console.log('\n--- E2E TEST COMPLETED SUCCESSFULLY ---');

  } catch (err) {
    console.error('E2E TEST FAILED:', err.response?.data || err.message);
  }
}

runE2ETest();
