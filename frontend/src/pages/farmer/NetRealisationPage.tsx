import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';

import { ConsignmentForm } from '../../components/netRealisation/ConsignmentForm';
import { RecommendationHero } from '../../components/netRealisation/RecommendationHero';
import { AlternateMarketsList } from '../../components/netRealisation/AlternateMarketsList';
import { MandiCostMatrix } from '../../components/netRealisation/MandiCostMatrix';
import { DeductionWaterfall } from '../../components/netRealisation/DeductionWaterfall';
import { VisualEvidence } from '../../components/netRealisation/VisualEvidence';
import { MarketNetResult, NetRealisationCalculationResponse } from '../../types/netRealisation';

import { useNavigate } from 'react-router-dom';
import { useProduce } from '../../context/ProduceContext';

import { Sparkles, MapPin, RefreshCw, AlertCircle, Info, ArrowRight, Store, Users, Clock } from 'lucide-react';

export const NetRealisationPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { produce, updateProduce } = useProduce();

  // Consignment Form States initialized from shared produce context
  const [crops, setCrops] = useState<Array<{ id: number; name: string; localName: string | null }>>([]);
  const [commodity, setCommodity] = useState<string>(produce.crop || 'Tomato');
  const [quantity, setQuantity] = useState<number>(produce.quantityQuintals || 50);
  const [unit, setUnit] = useState<'kg' | 'quintal'>('quintal');
  const [grade, setGrade] = useState<string>(produce.grade || 'Grade A (FAQ Standard)');
  const [harvestDate, setHarvestDate] = useState<string>(produce.harvestDate || new Date().toISOString().split('T')[0]);

  // Results & Selection States
  const [calculationData, setCalculationData] = useState<NetRealisationCalculationResponse | null>(null);
  const [selectedMarketForAudit, setSelectedMarketForAudit] = useState<MarketNetResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const waterfallRef = useRef<HTMLDivElement>(null);

  // Farmer's origin location from profile
  const farmerDistrict = user?.farmer?.district || 'Pune';
  const farmerVillage = user?.farmer?.village || 'Baramati';
  const originDisplay = `${farmerVillage}, ${farmerDistrict} (MH)`;

  // Fetch crops catalog on mount
  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const res = await api.get('/crops');
        if (res.data?.data) {
          setCrops(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load crops', err);
      }
    };
    fetchCrops();
  }, []);

  // Compute Net Realisation function
  const handleCalculate = async () => {
    setIsLoading(true);
    const quantityKg = unit === 'quintal' ? quantity * 100 : quantity;
    const quantityQuintals = unit === 'quintal' ? quantity : Math.round(quantity / 100);

    // Sync to shared context for later modules
    updateProduce({
      crop: commodity,
      quantityQuintals,
      quantityKg,
      unit,
      grade,
      harvestDate,
    });

    try {
      const res = await api.post('/net-realisation/calculate', {
        cropName: commodity,
        quantityKg,
        grade,
        district: farmerDistrict,
        harvestDate,
      });

      if (res.data?.data) {
        const data: NetRealisationCalculationResponse = res.data.data;
        setCalculationData(data);
        setSelectedMarketForAudit(data.recommendedMarket);
      }
    } catch (err) {
      console.error('Calculation failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Run calculation on initial load
  useEffect(() => {
    handleCalculate();
  }, [commodity, farmerDistrict]);

  const handleResetDefaults = () => {
    setCommodity('Tomato');
    setQuantity(2000);
    setUnit('kg');
    setGrade('Grade A (FAQ Standard)');
    setHarvestDate(new Date().toISOString().split('T')[0]);
  };

  const handleSelectMandi = (m: MarketNetResult) => {
    setSelectedMarketForAudit(m);
    setTimeout(() => {
      waterfallRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const quantityKg = unit === 'quintal' ? quantity * 100 : quantity;
  const recommendedMarket = calculationData?.recommendedMarket;
  const alternateMarkets = (calculationData?.candidateMarkets || []).filter(
    (m) => m.marketId !== recommendedMarket?.marketId
  );
  const allCandidates = calculationData?.candidateMarkets || [];

  return (
    <div className="space-y-6 pb-12">
      {/* ── Top Header Banner with Origin Pill ──────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
            <span>{t('moduleActiveText', 'MODULE 02 ACTIVE • DEDUCTION-ADJUSTED REALISATION ENGINE')}</span>
            <span className="text-emerald-700 font-normal">{t('agmarknetFeed', '| AGMARKNET v4.0 Linked Feed')}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2 flex items-center gap-2">
            {t('netRealisationTitle', 'Net Realisation')}
            <span className="px-2 py-0.5 rounded text-xs font-black bg-blue-100 text-blue-800">
              {t('algoVersion', 'v2.4 Algorithmic')}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {t('netRealisationDesc', 'Find the market that gives you the highest expected net return after true logistics & grading frictions.')}
          </p>
        </div>

        {/* Origin Location Pill */}
        <div className="bg-white rounded-2xl p-3 sm:px-4 sm:py-3 border border-slate-200 shadow-sm flex items-center gap-3 shrink-0 self-start sm:self-center">
          <div className="w-9 h-9 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center font-bold">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {t('farmOriginLabel', 'FARM ORIGIN / DISPATCH')}
            </span>
            <div className="flex items-center gap-1.5 font-extrabold text-slate-900 text-xs sm:text-sm">
              <span>{originDisplay}</span>
              <span className="text-[11px] text-forest-700 font-semibold cursor-pointer hover:underline">
                {t('editLabel', 'Edit 📍')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Operational Reality Principle Callout Banner from Screenshot ──────── */}
      <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-blue-950 flex items-center justify-between text-xs">
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong>{t('operationalRealityTitle', 'Operational Reality Principle:')}</strong> {t('operationalRealityDesc', 'KrishiVaani market recommendation calculates true net take-home by deducting actual transport cost, APMC cesses, loading/unloading fees, and perishability transit loss — not just quoted headline mandi rates.')}
          </p>
        </div>
        <span className="hidden md:inline-block px-2.5 py-1 rounded-md bg-white border border-blue-200 text-[10px] font-bold text-blue-900 shrink-0 ml-3">
          {t('toleranceLabel', 'TOLERANCE: <1.2%')}
        </span>
      </div>

      {/* ── 1. Consignment Parameters Form ────────────────────────────────────── */}
      <ConsignmentForm
        crops={crops}
        commodity={commodity}
        setCommodity={setCommodity}
        quantity={quantity}
        setQuantity={setQuantity}
        unit={unit}
        setUnit={setUnit}
        grade={grade}
        setGrade={setGrade}
        harvestDate={harvestDate}
        setHarvestDate={setHarvestDate}
        farmerLocation={originDisplay}
        onCalculate={handleCalculate}
        onReset={handleResetDefaults}
        isLoading={isLoading}
      />

      {/* ── 2. Market Analysis Summary Bar from Screenshot ────────────────────── */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
        <span>
          {t('marketAnalysisSummary', '📊 Market Analysis Complete • Evaluated 14 Regional APMC Mandis • Freight Model:')} <strong>{t('freightModelVal', '₹16/km (2T LCV Shared Route)')}</strong>
        </span>
        <span className="text-forest-800 font-bold">
          {t('topMandiLabel', 'Displaying Top 5 Net Optimal Mandis ⚡')}
        </span>
      </div>

      {/* ── 3. Recommended Market Hero (Rank #1) & 4 Alternates Grid ──────────── */}
      {recommendedMarket ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (6 cols): Recommended Market Hero */}
          <div className="lg:col-span-6">
            <RecommendationHero
              recommended={recommendedMarket}
              onSelectMandi={handleSelectMandi}
              onViewWaterfall={() => {
                setSelectedMarketForAudit(recommendedMarket);
                setTimeout(() => {
                  waterfallRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 50);
              }}
            />
          </div>

          {/* Right Column (6 cols): 4 Alternate Mandi Options */}
          <div className="lg:col-span-6">
            <AlternateMarketsList
              alternates={alternateMarkets}
              selectedMarketId={selectedMarketForAudit?.marketId}
              onViewAudit={handleSelectMandi}
            />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <RefreshCw className="w-8 h-8 text-forest-700 animate-spin mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-600">{t('calculatingMsg', 'Calculating Net Realisation...')}</p>
        </div>
      )}

      {/* ── 4. Mandi Cost & Return Matrix (Side-by-Side Table with CSV Export) ──── */}
      {allCandidates.length > 0 && (
        <MandiCostMatrix
          markets={allCandidates}
          quantityKg={quantityKg}
          cropName={commodity}
          selectedMarketId={selectedMarketForAudit?.marketId}
          onSelectRow={handleSelectMandi}
        />
      )}

      {/* ── 5. Auditable Ledger & Deduction Waterfall ─────────────────────────── */}
      <div ref={waterfallRef}>
        {selectedMarketForAudit && (
          <DeductionWaterfall
            market={selectedMarketForAudit}
            cropName={commodity}
            quantityKg={quantityKg}
          />
        )}
      </div>

      {/* ── 6. Visual Decision Evidence (Headline Price vs. True Net Realisation) ── */}
      {allCandidates.length > 0 && <VisualEvidence markets={allCandidates} />}

      {/* ── 7. Next Logical Action Cards for This Lot ────────────────────────── */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            {t('integratedWorkflowLabel', 'INTEGRATED FARMER WORKFLOW')}
          </span>
          <h3 className="text-lg font-black text-slate-900 tracking-tight">
            {t('nextDecisionsTitle', 'Next Decisions for Your {quantity} Q {crop} Lot').replace('{quantity}', produce.quantityQuintals?.toString() || '').replace('{crop}', produce.crop || '')}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('lotSpecsDesc', 'Your lot specifications are saved and will transfer automatically without re-entering parameters.')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Action 1: FPO Aggregation */}
          <div
            onClick={() => navigate('/farmer/fpo')}
            className="cursor-pointer p-4 rounded-2xl border border-slate-200 hover:border-forest-600 hover:bg-forest-50/50 transition-all flex flex-col justify-between space-y-3 group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold mb-2">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-extrabold text-slate-900">{t('fpoAggregationTitle', '03 FPO Aggregation')}</h4>
              <p className="text-xs text-slate-500 mt-1">
                {t('fpoAggregationDesc', 'Combine your {quantity} Q with neighbor farmers to fulfill institutional orders.').replace('{quantity}', produce.quantityQuintals?.toString() || '')}
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-forest-800 group-hover:text-forest-900">
              <span>{t('viewFpoOrders', 'View Active FPO Orders')}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Action 2: Sell Now vs Wait */}
          <div
            onClick={() => navigate('/farmer/sell-wait')}
            className="cursor-pointer p-4 rounded-2xl border border-slate-200 hover:border-forest-600 hover:bg-forest-50/50 transition-all flex flex-col justify-between space-y-3 group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold mb-2">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-extrabold text-slate-900">{t('sellWaitTitle', '04 Sell Now / Wait')}</h4>
              <p className="text-xs text-slate-500 mt-1">
                {t('sellWaitDesc', 'Evaluate storage cost vs. projected price upside against incoming weather hazards.')}
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-forest-800 group-hover:text-forest-900">
              <span>{t('evaluateHolding', 'Evaluate Holding Timing')}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Action 3: Buyer Matching */}
          <div
            onClick={() => navigate('/farmer/buyer-matching')}
            className="cursor-pointer p-4 rounded-2xl border border-slate-200 hover:border-forest-600 hover:bg-forest-50/50 transition-all flex flex-col justify-between space-y-3 group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold mb-2">
                <Store className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-extrabold text-slate-900">{t('buyerMatchingTitle', '05 Direct Buyer Matching')}</h4>
              <p className="text-xs text-slate-500 mt-1">
                {t('buyerMatchingDesc', 'Receive direct farm-gate bids with zero mandi cess and guaranteed escrow settlement.')}
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-forest-800 group-hover:text-forest-900">
              <span>{t('findVerifiedBuyers', 'Find Verified Buyers')}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
