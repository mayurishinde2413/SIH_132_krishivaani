import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useProduce } from '../../context/ProduceContext';
import api from '../../services/api';

import { SellWaitInputForm } from '../../components/sellWait/SellWaitInputForm';
import { CurrentSituationBanner } from '../../components/sellWait/CurrentSituationBanner';
import { CompareChoices } from '../../components/sellWait/CompareChoices';
import { FactorComparisonTable } from '../../components/sellWait/FactorComparisonTable';
import { DecisionSupportPanel } from '../../components/sellWait/DecisionSupportPanel';
import { SellWaitAnalysisResponse } from '../../types/sellWait';

import { Sparkles, CloudSun, RefreshCw } from 'lucide-react';

export const SellWaitPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { produce, updateProduce } = useProduce();

  // Form State initialized from shared produce context
  const [crops, setCrops] = useState<Array<{ id: number; name: string; localName: string | null }>>([]);
  const [crop, setCrop] = useState<string>(produce.crop || 'Tomato');
  const [quantityQuintals, setQuantityQuintals] = useState<number>(produce.quantityQuintals || 50);
  const [currentMarketPrice, setCurrentMarketPrice] = useState<number>(produce.currentPricePerQuintal || 2800);
  const [hasStorage, setHasStorage] = useState<boolean>(true);

  // Analysis Result State
  const [analysisData, setAnalysisData] = useState<SellWaitAnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const farmerDistrict = user?.farmer?.district || 'Pune';
  const farmerVillage = user?.farmer?.village || 'Baramati';
  const originDisplay = `${farmerVillage}, ${farmerDistrict} | MH`;

  // Fetch crops catalog on mount
  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const res = await api.get('/crops');
        if (res.data?.data) {
          setCrops(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching crops:', err);
      }
    };
    fetchCrops();
  }, []);

  // Analyze Sell vs Wait options
  const handleAnalyze = async () => {
    setIsLoading(true);

    // Sync to shared produce state
    updateProduce({
      crop,
      quantityQuintals,
      currentPricePerQuintal: currentMarketPrice,
    });

    try {
      const res = await api.post('/sell-wait/analyze', {
        cropName: crop,
        quantityQuintals,
        currentMarketPrice,
        hasColdStorage: hasStorage,
        district: farmerDistrict,
      });

      if (res.data?.data) {
        setAnalysisData(res.data.data);
      }
    } catch (err) {
      console.error('Error analyzing sell vs wait:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Run on mount
  useEffect(() => {
    handleAnalyze();
  }, [crop, hasStorage, farmerDistrict]);

  return (
    <div className="space-y-6 pb-12">
      {/* ── Top Header Banner with Advisory Badges ───────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-1">
            <span className="text-forest-800 bg-forest-50 px-2.5 py-0.5 rounded-full border border-forest-200">
              {t('sellWaitFarmerAdvisory', 'FARMER ADVISORY')}
            </span>
            <span>•</span>
            <span>{t('sellWaitTimingGuide', 'TIMING GUIDE')}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            {t('sellWaitPageTitle', 'Sell Now or Wait?')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {t('sellWaitPageDescription', 'Use current price, market trends, weather, crop condition and storage information to compare your options.')}
          </p>
        </div>

        {/* IMD Weather Synced Badge */}
        <div className="bg-white rounded-2xl p-3 sm:px-4 sm:py-3 border border-slate-200 shadow-sm flex items-center gap-3 shrink-0 self-start sm:self-center">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center font-bold">
            <CloudSun className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {t('sellWaitWeatherMandiSync', 'WEATHER & MANDI SYNC')}
            </span>
            <span className="text-xs font-extrabold text-slate-900 block">
              {t('sellWaitImdAdvisory', 'IMD Pune Agro-Met Advisory Live')}
            </span>
          </div>
        </div>
      </div>

      {/* ── Subtitle Features Bar ────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
        <span>{t('sellWaitFeaturesSub1', '● Simple Selling-Time Decision Assistant • Real-Time Mandi Data Active')}</span>
        <span className="text-forest-800 font-bold">{t('sellWaitFeaturesSub2', 'Weather synced with IMD Pune Agro-Met Advisory')}</span>
      </div>

      {/* ── 1. Input Form: What are you planning to sell? ────────────────────────── */}
      <SellWaitInputForm
        crops={crops}
        crop={crop}
        setCrop={setCrop}
        quantityQuintals={quantityQuintals}
        setQuantityQuintals={setQuantityQuintals}
        currentMarketPrice={currentMarketPrice}
        setCurrentMarketPrice={setCurrentMarketPrice}
        hasStorage={hasStorage}
        setHasStorage={setHasStorage}
        farmerLocation={originDisplay}
        onCheckOptions={handleAnalyze}
        isLoading={isLoading}
      />

      {/* ── 2. Current Situation At a Glance ─────────────────────────────────────── */}
      {analysisData && <CurrentSituationBanner situation={analysisData.currentSituation} />}

      {/* ── 3. Compare Your Choices: Sell Now vs Wait ────────────────────────────── */}
      {analysisData && (
        <CompareChoices
          quantityQuintals={quantityQuintals}
          sellNow={analysisData.sellNow}
          waitOption={analysisData.waitOption}
          onSelectSellNow={() => navigate('/farmer/buyer-matching')}
          onSelectWait={() => navigate('/farmer/crop-rescue')}
        />
      )}

      {/* ── 4. Why? Factor-by-Factor Comparison Table ───────────────────────────── */}
      {analysisData && <FactorComparisonTable factors={analysisData.comparisonFactors} />}

      {/* ── 5 & 6. What Can Affect Your Decision & Selling-Time Analysis ──────────── */}
      {analysisData && (
        <DecisionSupportPanel
          decision={analysisData.decisionSupport}
          onGoToBestMarket={() => navigate('/farmer/buyer-matching')}
        />
      )}
    </div>
  );
}
