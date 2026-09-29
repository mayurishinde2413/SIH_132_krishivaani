import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

import { CropCard } from '../components/priceDiscovery/CropCard';
import { RadiusSelector } from '../components/priceDiscovery/RadiusSelector';
import { MarketCard, NearbyMarketData } from '../components/priceDiscovery/MarketCard';
import { MarketDetails } from '../components/priceDiscovery/MarketDetails';
import { MarketSearch } from '../components/priceDiscovery/MarketSearch';
import { GeographicPerimeterMap } from '../components/priceDiscovery/GeographicPerimeterMap';

import {
  Sparkles,
  MapPin,
  RefreshCw,
  Plus,
  AlertCircle,
} from 'lucide-react';
import { useProduce } from '../context/ProduceContext';

interface Crop {
  id: number;
  name: string;
  localName: string | null;
  category: string | null;
  unit: string;
}

export const FarmerPriceDiscoveryPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { produce, setCrop, setSelectedMarket } = useProduce();

  const [crops, setCrops] = useState<Crop[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [selectedRadius, setSelectedRadius] = useState<number>(50); // 50 km default as in screenshot
  const [nearbyMarkets, setNearbyMarkets] = useState<NearbyMarketData[]>([]);
  const [selectedMarketForDetails, setSelectedMarketForDetails] = useState<NearbyMarketData | null>(null);

  const [isLoadingCrops, setIsLoadingCrops] = useState(true);
  const [isLoadingMarkets, setIsLoadingMarkets] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const detailsRef = useRef<HTMLDivElement>(null);

  // Farmer's origin location from profile
  const farmerDistrict = user?.farmer?.district || 'Pune';
  const farmerVillage = user?.farmer?.village || 'Baramati';
  const originDisplay = `${farmerVillage}, ${farmerDistrict} (MH)`;

  // Step 1: Load all crops on mount
  useEffect(() => {
    const fetchCrops = async () => {
      setIsLoadingCrops(true);
      try {
        const res = await api.get('/crops');
        if (res.data?.data && res.data.data.length > 0) {
          const cropsList: Crop[] = res.data.data;
          setCrops(cropsList);

          // Selection prioritized from ProduceContext or default Tomato
          const defaultCrop =
            cropsList.find((c) => c.name.toLowerCase() === produce.crop.toLowerCase()) ||
            cropsList.find((c) => c.name.toLowerCase() === 'tomato') ||
            cropsList[0];
          setSelectedCrop(defaultCrop);
          if (defaultCrop) {
            setCrop(defaultCrop.name, defaultCrop.id);
          }
        }
      } catch (err) {
        console.error('Error fetching crops:', err);
        setErrorMessage(t('failedLoadCrops', 'Failed to load crop catalog from server.'));
      } finally {
        setIsLoadingCrops(false);
      }
    };

    fetchCrops();
  }, []);

  // Step 2 & 3: Fetch nearby markets when crop or radius changes
  useEffect(() => {
    if (!selectedCrop) return;

    const fetchNearby = async () => {
      setIsLoadingMarkets(true);
      setErrorMessage(null);
      try {
        const res = await api.get(
          `/markets/nearby?district=${encodeURIComponent(farmerDistrict)}&cropId=${selectedCrop.id}&radius=${selectedRadius}`
        );
        if (res.data?.data) {
          const markets: NearbyMarketData[] = res.data.data;
          setNearbyMarkets(markets);

          // Auto-select first market for details if none selected or if previously selected is not in new list
          if (markets.length > 0) {
            setSelectedMarketForDetails(markets[0]);
          } else {
            setSelectedMarketForDetails(null);
          }
        }
      } catch (err: any) {
        console.error('Error fetching nearby markets:', err);
        setErrorMessage(t('failedFetchMandis', 'Failed to fetch nearby mandi prices.'));
      } finally {
        setIsLoadingMarkets(false);
      }
    };

    fetchNearby();
  }, [selectedCrop, selectedRadius, farmerDistrict]);

  const handleSelectCrop = (crop: Crop) => {
    setSelectedCrop(crop);
    setCrop(crop.name, crop.id);
  };

  const handleSelectRadius = (radius: number) => {
    setSelectedRadius(radius);
  };

  const handleViewMarketDetails = (market: NearbyMarketData) => {
    setSelectedMarketForDetails(market);
    setSelectedMarket({
      id: market.id,
      name: market.name,
      district: market.district,
      distanceKm: market.distanceKm,
      modalPrice: market.latestPrice?.modalPrice || 2800,
    });
    // Smooth scroll down to details
    setTimeout(() => {
      detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleSelectFromSearch = async (searchedMarket: { id: number; name: string; district: string }) => {
    if (!selectedCrop) return;
    try {
      setIsLoadingMarkets(true);
      const res = await api.get(`/markets/${searchedMarket.id}/prices?cropId=${selectedCrop.id}`);
      if (res.data?.data) {
        const d = res.data.data;
        const mappedMarket: NearbyMarketData = {
          id: d.market.id,
          name: d.market.name,
          district: d.market.district,
          state: d.market.state,
          type: d.market.type,
          distanceKm: 85,
          latestPrice: d.latestPrice,
          totalArrivalsQty: d.totalArrivalsQty,
          arrivalDate: d.arrivalDate,
        };
        setSelectedMarketForDetails(mappedMarket);
        setTimeout(() => {
          detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingMarkets(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ── Top Status Pill & Origin Bar ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
            <span>{t('moduleActiveSync', 'MODULE 01 ACTIVE • SYNCED WITH AGMARKNET & e-NAM')}</span>
            <span className="text-emerald-700 font-normal">{t('updatedMinsAgo', '| Updated 15 mins ago (Live Feed)')}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
            {t('priceDiscoveryTitle', 'Price Discovery')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {t('priceDiscoverySubtitle', 'Check current crop spot prices across local APMC mandis before taking produce off-farm.')}
          </p>
        </div>

        {/* Origin Location Pill */}
        <div className="bg-white rounded-2xl p-3 sm:px-4 sm:py-3 border border-slate-200 shadow-sm flex items-center gap-3 shrink-0 self-start sm:self-center">
          <div className="w-9 h-9 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center font-bold">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {t('originLocationCaps', 'ORIGIN LOCATION')}
            </span>
            <div className="flex items-center gap-1.5 font-extrabold text-slate-900 text-xs sm:text-sm">
              <span>{originDisplay}</span>
              <span className="text-[11px] text-forest-700 font-semibold cursor-pointer hover:underline">
                {t('changeLocationBtn', 'Change 📍')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Step 1: Select Your Crop ────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-forest-800 text-white flex items-center justify-center text-xs font-black">
              1
            </span>
            <h2 className="font-extrabold text-slate-900 text-base sm:text-lg">
              {t('selectYourCropTitle', 'Select Your Crop')}
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {t('clickCommodityHint', 'Click any commodity to update APMC yard prices')}
          </span>
        </div>

        {isLoadingCrops ? (
          <div className="flex items-center justify-center p-8 bg-white rounded-2xl border border-slate-200">
            <RefreshCw className="w-5 h-5 text-forest-700 animate-spin mr-2" />
            <span className="text-sm font-medium text-slate-500">{t('loadingCropsMsg', 'Loading crop commodities...')}</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
            {crops.map((crop) => (
              <CropCard
                key={crop.id}
                crop={crop}
                isSelected={selectedCrop?.id === crop.id}
                onClick={handleSelectCrop}
              />
            ))}

            {/* "+41 More Crops" tile matching screenshot */}
            <div className="flex flex-col items-center justify-center py-4 px-3 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 text-slate-500 hover:border-slate-300 hover:bg-slate-100/50 cursor-pointer transition-all text-center">
              <Plus className="w-6 h-6 text-slate-400 mb-1" />
              <p className="text-xs font-bold text-slate-700">{t('moreCropsBtn', '+41 More')}</p>
              <p className="text-[9px] text-slate-400">{t('allIndiaIndexTxt', 'All India Index')}</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Step 2 & 3: Radius Selector & Active Benchmark Summary ──────────────── */}
      {selectedCrop && (
        <RadiusSelector
          selectedRadius={selectedRadius}
          onSelectRadius={handleSelectRadius}
          cropName={selectedCrop.name}
          marketCount={nearbyMarkets.length}
          originLocation={originDisplay}
        />
      )}

      {/* ── Step 4 & Visual Catchment Section ───────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Nearby APMC Mandi Spot Prices Cards */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-forest-800 text-white flex items-center justify-center text-xs font-black">
                2
              </span>
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                {t('nearbySpotPricesTitle', 'Nearby APMC Mandi Spot Prices')}
              </h3>
            </div>
            <span className="px-2.5 py-1 text-[11px] font-bold bg-blue-50 text-blue-800 rounded-full border border-blue-200">
              {t('mandiGradeTxt', 'Mandi Grade: FAQ Hybrid')}
            </span>
          </div>

          {isLoadingMarkets ? (
            <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
              <RefreshCw className="w-8 h-8 text-forest-700 animate-spin mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-600">
                {t('fetchingVerifiedPricesWithin', 'Fetching verified spot prices within')} {selectedRadius}{t('kmSuffix', 'km...')}
              </p>
            </div>
          ) : nearbyMarkets.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
              <h4 className="font-bold text-slate-800 text-base">
                {t('noMandisFoundWithin', 'No APMC mandis found within')} {selectedRadius} {t('km', 'km')}
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {t('expandSearchRadiusHint', 'Try expanding your search radius to 50 km or 100 km, or search for a specific market yard below.')}
              </p>
              <button
                type="button"
                onClick={() => setSelectedRadius(100)}
                className="px-4 py-2 bg-forest-800 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                {t('expandRadius100kmBtn', 'Expand Radius to 100 km')}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {nearbyMarkets.map((market) => (
                <MarketCard
                  key={market.id}
                  market={market}
                  isSelected={selectedMarketForDetails?.id === market.id}
                  onViewDetails={handleViewMarketDetails}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column (5 cols): Geographic Perimeter Radar Map & Market Search */}
        <div className="lg:col-span-5 space-y-6">
          <GeographicPerimeterMap
            radiusKm={selectedRadius}
            originName={farmerVillage}
            markets={nearbyMarkets.map((m) => ({
              name: m.name,
              distanceKm: m.distanceKm,
              price: m.latestPrice?.modalPrice,
            }))}
          />

          <MarketSearch onSelectMarket={handleSelectFromSearch} />
        </div>
      </div>

      {/* ── Step 5: Detailed Market Intelligence Section ──────────────────────── */}
      <div ref={detailsRef}>
        {selectedMarketForDetails && selectedCrop && (
          <MarketDetails
            marketId={selectedMarketForDetails.id}
            marketName={selectedMarketForDetails.name}
            district={selectedMarketForDetails.district}
            distanceKm={selectedMarketForDetails.distanceKm}
            cropId={selectedCrop.id}
            cropName={selectedCrop.name}
            onBack={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </div>
    </div>
  );
};
