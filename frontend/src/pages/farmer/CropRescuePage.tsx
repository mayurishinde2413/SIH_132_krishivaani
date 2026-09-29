import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProduce } from '../../context/ProduceContext';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';

import {
  EmergencyTriggerSelector,
  EmergencyTrigger,
} from '../../components/cropRescue/EmergencyTriggerSelector';
import {
  RescueOptionsGrid,
  RescueOption,
} from '../../components/cropRescue/RescueOptionsGrid';
import {
  AlternativeBuyersList,
  RescueBuyer,
} from '../../components/cropRescue/AlternativeBuyersList';
import {
  YardRerouteAndStorageCard,
  RescueMarket,
  RescueStorage,
} from '../../components/cropRescue/YardRerouteAndStorageCard';
import { GroundSupportBanner } from '../../components/cropRescue/GroundSupportBanner';
import {
  RescueActionModal,
  ModalType,
} from '../../components/cropRescue/RescueActionModal';
import { ActiveCasesList } from '../../components/cropRescue/ActiveCasesList';
import { RescueCaseData } from '../../components/cropRescue/CaseCard';

import {
  AlertOctagon,
  Sparkles,
  History,
  PhoneCall,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

const INITIAL_TRIGGERS: EmergencyTrigger[] = [
  {
    id: 'buyer_cancelled',
    title: 'Buyer Cancelled',
    badge: 'AVAILABLE',
    iconType: 'cancel',
    description: 'Buyer cancelled at gate or abruptly stopped responding to pickup call.',
    actionHint: 'Priority rerouting triggered',
  },
  {
    id: 'transport_problem',
    title: 'Transport Problem',
    badge: 'AVAILABLE',
    iconType: 'transport',
    description: 'Vehicle breakdown, driver delay, or local freight haulier unavailable.',
    actionHint: 'Find nearby fleet support',
  },
  {
    id: 'quality_dispute',
    title: 'Quality Dispute',
    badge: 'AVAILABLE',
    iconType: 'quality',
    description: 'Lot rejected at yard gate or dispute regarding moisture/grade rating.',
    actionHint: 'Request FPO grading check',
  },
  {
    id: 'other_emergency',
    title: 'Other Emergency',
    badge: 'AVAILABLE',
    iconType: 'other',
    description: 'Market strike, sudden hailstorm risk, or perishable unsold surplus.',
    actionHint: 'Instant cold storage hold',
  },
];

export const CropRescuePage: React.FC = () => {
  const { user } = useAuth();
  const { produce } = useProduce();
  const { t } = useLanguage();

  // Selected trigger state
  const [selectedTriggerId, setSelectedTriggerId] = useState<string>('buyer_cancelled');
  const [activeOptionId, setActiveOptionId] = useState<string>('alternative_buyer');

  // Backend loaded data
  const [options, setOptions] = useState<RescueOption[]>([]);
  const [buyers, setBuyers] = useState<RescueBuyer[]>([]);
  const [markets, setMarkets] = useState<RescueMarket[]>([]);
  const [storageList, setStorageList] = useState<RescueStorage[]>([]);

  // Registered cases in PostgreSQL
  const [registeredCases, setRegisteredCases] = useState<RescueCaseData[]>([]);
  const [showCasesHistory, setShowCasesHistory] = useState<boolean>(false);
  const [isLoadingCases, setIsLoadingCases] = useState<boolean>(false);
  const [updatingCaseId, setUpdatingCaseId] = useState<number | null>(null);

  // Modals state
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedBuyer, setSelectedBuyer] = useState<RescueBuyer | null>(null);
  const [selectedMarket, setSelectedMarket] = useState<RescueMarket | null>(null);
  const [selectedStorage, setSelectedStorage] = useState<RescueStorage | null>(null);
  const [isSubmittingAction, setIsSubmittingAction] = useState<boolean>(false);

  // Lot Details dynamically derived from shared produce context
  const cropName = produce.crop || 'Tomato';
  const quantityQ = produce.quantityQuintals || 30;
  const farmerVillage = user?.farmer?.village || 'Baramati';
  const lotSummary = `${quantityQ} Q ${cropName} (${farmerVillage} APMC Yard)`;

  // Selected trigger object
  const currentTrigger =
    INITIAL_TRIGGERS.find((t) => t.id === selectedTriggerId) || INITIAL_TRIGGERS[0];

  // ── Fetch Rescue Options ───────────────────────────────────────────────────
  const fetchOptions = useCallback(async (triggerTitle: string) => {
    try {
      const res = await api.get(`/rescue/options?problemType=${encodeURIComponent(triggerTitle)}`);
      if (res.data?.data) {
        setOptions(res.data.data);
      }
    } catch (e) {
      console.error('Error fetching rescue options:', e);
    }
  }, []);

  // ── Fetch Rescue Buyers ────────────────────────────────────────────────────
  const fetchBuyers = useCallback(async () => {
    try {
      const res = await api.get(`/rescue/buyers?crop=${encodeURIComponent(cropName)}`);
      if (res.data?.data) {
        setBuyers(res.data.data);
      }
    } catch (e) {
      console.error('Error fetching rescue buyers:', e);
    }
  }, [cropName]);

  // ── Fetch Rescue Markets ───────────────────────────────────────────────────
  const fetchMarkets = useCallback(async () => {
    try {
      const res = await api.get(`/rescue/markets?crop=${encodeURIComponent(cropName)}`);
      if (res.data?.data) {
        setMarkets(res.data.data);
      }
    } catch (e) {
      console.error('Error fetching rescue markets:', e);
    }
  }, [cropName]);

  // ── Fetch Rescue Storage ───────────────────────────────────────────────────
  const fetchStorage = useCallback(async () => {
    try {
      const res = await api.get('/rescue/storage');
      if (res.data?.data) {
        setStorageList(res.data.data);
      }
    } catch (e) {
      console.error('Error fetching rescue storage:', e);
    }
  }, []);

  // ── Fetch Registered Cases from PostgreSQL ─────────────────────────────────
  const fetchCases = useCallback(async () => {
    setIsLoadingCases(true);
    try {
      const res = await api.get('/rescue/cases');
      if (res.data?.data) {
        setRegisteredCases(res.data.data);
      }
    } catch (e) {
      console.error('Error fetching rescue cases:', e);
    } finally {
      setIsLoadingCases(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchOptions(currentTrigger.title);
    fetchBuyers();
    fetchMarkets();
    fetchStorage();
    fetchCases();
  }, [fetchOptions, fetchBuyers, fetchMarkets, fetchStorage, fetchCases, currentTrigger.title]);

  // Switch incident trigger
  const handleSelectTrigger = (id: string) => {
    setSelectedTriggerId(id);
    const trigger = INITIAL_TRIGGERS.find((t) => t.id === id);
    if (trigger) {
      fetchOptions(trigger.title);
    }
  };

  // Select rescue strategy option
  const handleSelectOption = (option: RescueOption) => {
    setActiveOptionId(option.id);

    if (option.id === 'fpo_pool') {
      setActiveModal('fpo');
    } else if (option.id === 'nearby_market') {
      if (markets.length > 0) {
        setSelectedMarket(markets[0]);
        setActiveModal('market');
      }
    } else if (option.id === 'cold_storage') {
      if (storageList.length > 0) {
        setSelectedStorage(storageList[0]);
        setActiveModal('storage');
      }
    } else {
      // Smooth scroll to alternative buyers
      const el = document.getElementById('step3-direct-action');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Open Contact Buyer modal
  const handleContactBuyer = (buyer: RescueBuyer) => {
    setSelectedBuyer(buyer);
    setActiveModal('buyer');
  };

  // Open Mandi stream
  const handleViewMandiStream = (market: RescueMarket) => {
    setSelectedMarket(market);
    setActiveModal('market');
  };

  // Open Prebook storage modal
  const handlePrebookStorage = (storage: RescueStorage) => {
    setSelectedStorage(storage);
    setActiveModal('storage');
  };

  // Confirm Action & save into PostgreSQL database
  const handleConfirmAction = async (actionDetails: {
    actionType: string;
    targetName: string;
    details: string;
  }) => {
    setIsSubmittingAction(true);
    try {
      await api.post('/rescue/create', {
        cropName,
        problemType: currentTrigger.title,
        quantity: quantityQ,
        description: actionDetails.details,
        actionTaken: actionDetails.actionType,
      });
      // Refresh case list from PostgreSQL
      fetchCases();
    } catch (e) {
      console.error('Failed to log rescue case:', e);
    } finally {
      setIsSubmittingAction(false);
    }
  };

  // Update existing case status in PostgreSQL
  const handleCaseStatusChange = async (id: number, newStatus: string) => {
    setUpdatingCaseId(id);
    try {
      const res = await api.patch(`/rescue/cases/${id}/status`, {
        status: newStatus,
      });
      if (res.data?.success) {
        setRegisteredCases((prev: RescueCaseData[]) =>
          prev.map((c: RescueCaseData) => (c.id === id ? { ...c, ...res.data.data } : c))
        );
      }
    } catch (e) {
      console.error('Failed to update case status:', e);
    } finally {
      setUpdatingCaseId(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ── Top Header Banner with Emergency Indicators ────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {t('cropRescue', 'Crop Rescue')}
            </h1>

            {/* Emergency Mode Active Pill */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-50 text-rose-700 border border-rose-200">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>{t('emergencyModeActive', 'Emergency Mode Active')}</span>
            </span>

            {/* Cluster Badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-800 border border-sky-200">
              <span className="w-2 h-2 rounded-full bg-sky-500" />
              <span>{t('clusterLabel', 'Cluster:')} {farmerVillage} {t('apmcYardLabel', 'APMC Yard')}</span>
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed">
            {t('cropRescueDesc', 'Something went wrong with your scheduled crop dispatch? Don\'t panic. KrishiVaani instantly mobilizes fallback buyers, cold bay holds, and nearby open mandi yards.')}
          </p>
        </div>

        {/* Avg. Fallback Resolution Badge & Cases Toggle */}
        <div className="flex flex-wrap md:flex-col items-center md:items-end gap-2 shrink-0">
          <div className="inline-flex items-center gap-1.5 text-xs font-black text-slate-700 bg-white px-3.5 py-2 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-amber-500">⚡</span>
            <span>{t('avgFallbackResolution', 'Avg. Fallback Resolution:')} <strong className="text-forest-900">{t('fourteenMins', '14 Mins')}</strong></span>
          </div>

          <button
            type="button"
            onClick={() => setShowCasesHistory(!showCasesHistory)}
            className="text-xs font-bold text-forest-800 hover:text-forest-900 bg-forest-50 hover:bg-forest-100 px-3 py-1.5 rounded-xl border border-forest-200 transition-colors flex items-center gap-1.5"
          >
            <History className="w-3.5 h-3.5" />
            <span>
              {showCasesHistory ? t('hideIncidentHistory', 'Hide Incident History') : `${t('myIncidents', 'My Incidents')} (${registeredCases.length})`}
            </span>
          </button>
        </div>
      </div>

      {/* ── 4-Step Process Progress Bar ──────────────────────────────────────── */}
      <div className="hidden lg:grid grid-cols-4 gap-3 p-3 bg-white rounded-2xl border border-slate-200 text-xs font-bold shadow-sm">
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-forest-50 text-forest-900 border border-forest-200">
          <span className="w-6 h-6 rounded-full bg-forest-900 text-white flex items-center justify-center text-xs font-black shrink-0">
            1
          </span>
          <div className="min-w-0">
            <div className="truncate font-black">{t('step1Identified', '1. Problem Identified')}</div>
            <div className="text-[10px] text-slate-500 truncate">{t(`${currentTrigger.id}_title`, currentTrigger.title)}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-forest-50 text-forest-900 border border-forest-200">
          <span className="w-6 h-6 rounded-full bg-forest-900 text-white flex items-center justify-center text-xs font-black shrink-0">
            2
          </span>
          <div className="min-w-0">
            <div className="truncate font-black">{t('step2RescueStrategy', '2. Rescue Strategy')}</div>
            <div className="text-[10px] text-slate-500 truncate">{t('selectAltPath', 'Select Alternative Path')}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-sky-50 text-sky-900 border border-sky-200">
          <span className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-black shrink-0">
            3
          </span>
          <div className="min-w-0">
            <div className="truncate font-black">{t('step3InstantMatches', '3. Instant Matches')}</div>
            <div className="text-[10px] text-sky-700 truncate">{buyers.length} {t('verifiedBuyers', 'Verified Buyers')}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 text-slate-500">
          <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-black shrink-0">
            4
          </span>
          <div className="min-w-0">
            <div className="truncate font-black">{t('step4TakeAction', '4. Take Action')}</div>
            <div className="text-[10px] text-slate-400 truncate">{t('dispatchOrSecure', 'Dispatch or Secure Hold')}</div>
          </div>
        </div>
      </div>

      {/* ── Registered Cases Drawer / Panel (if toggled) ───────────────────── */}
      {showCasesHistory && (
        <div className="bg-white rounded-3xl p-6 border-2 border-forest-200 shadow-md space-y-4 animate-fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-forest-800" />
              <h3 className="text-lg font-black text-slate-900">
                {t('registeredCasesTitle', 'Registered Rescue Cases in PostgreSQL')}
              </h3>
            </div>
            <span className="text-xs font-bold text-slate-500">
              {registeredCases.length} {t('totalLoggedIncidents', 'total logged incidents')}
            </span>
          </div>

          <ActiveCasesList
            cases={registeredCases}
            isLoading={isLoadingCases}
            updatingId={updatingCaseId}
            onStatusChange={handleCaseStatusChange}
          />
        </div>
      )}

      {/* ── STEP 1: What happened with your lot? ─────────────────────────────── */}
      <EmergencyTriggerSelector
        triggers={INITIAL_TRIGGERS}
        selectedTriggerId={selectedTriggerId}
        onSelectTrigger={handleSelectTrigger}
      />

      {/* ── STEP 2: Available Rescue Options ─────────────────────────────────── */}
      <RescueOptionsGrid
        options={options}
        selectedProblemTitle={currentTrigger.title}
        lotSummary={lotSummary}
        activeOptionId={activeOptionId}
        onSelectOption={handleSelectOption}
      />

      {/* ── STEP 3: DIRECT ACTION (Left 2/3 Buyers, Right 1/3 Yard & Storage) ─── */}
      <div id="step3-direct-action" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Cols: Alternative Verified Buyers */}
        <div className="lg:col-span-8">
          <AlternativeBuyersList
            buyers={buyers}
            onContactBuyer={handleContactBuyer}
          />
        </div>

        {/* Right 4 Cols: Yard Reroute Option & Temporary Holding Facility */}
        <div className="lg:col-span-4">
          {markets.length > 0 && storageList.length > 0 && (
            <YardRerouteAndStorageCard
              market={markets[0]}
              storage={storageList[0]}
              onViewMandiStream={handleViewMandiStream}
              onPrebookStorage={handlePrebookStorage}
            />
          )}
        </div>
      </div>

      {/* ── STEP 4: KRISHIVAANI GROUND SUPPORT (Bottom Banner) ───────────────── */}
      <GroundSupportBanner
        onCallFPO={() => {
          setActiveModal('fpo');
        }}
        onCallHelpline={() => {
          window.location.href = 'tel:18001801551';
        }}
        onOpenWhatsApp={() => {
          window.open('https://api.whatsapp.com/send?text=Emergency%20Crop%20Rescue%20Support%20Needed%20at%20Baramati%20APMC', '_blank');
        }}
      />

      {/* ── Interactive Rescue Action Modal ─────────────────────────────────── */}
      <RescueActionModal
        modalType={activeModal}
        selectedBuyer={selectedBuyer}
        selectedMarket={selectedMarket}
        selectedStorage={selectedStorage}
        lotSummary={lotSummary}
        onClose={() => {
          setActiveModal(null);
          setSelectedBuyer(null);
          setSelectedMarket(null);
          setSelectedStorage(null);
        }}
        onConfirmAction={handleConfirmAction}
        isSubmitting={isSubmittingAction}
      />
    </div>
  );
};
