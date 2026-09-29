import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useProduce } from '../../context/ProduceContext';
import api from '../../services/api';

import { BuyerRequirementsList } from '../../components/fpoAggregation/BuyerRequirementsList';
import { FulfillmentConsole } from '../../components/fpoAggregation/FulfillmentConsole';
import { MemberSupplyTable } from '../../components/fpoAggregation/MemberSupplyTable';
import { LotSubmissionAndOffer } from '../../components/fpoAggregation/LotSubmissionAndOffer';

import {
  BuyerRequirementItem,
  FPOMemberItem,
  CreatedFPOLotResponse,
} from '../../types/fpoAggregation';

import {
  Users,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

export const FPOAggregationPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { produce } = useProduce();

  // State
  const [requirements, setRequirements] = useState<BuyerRequirementItem[]>([]);
  const [selectedRequirement, setSelectedRequirement] = useState<BuyerRequirementItem | null>(null);

  const [members, setMembers] = useState<FPOMemberItem[]>([]);
  const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([]);
  const [allocations, setAllocations] = useState<Record<number, number>>({});

  const [lotCode, setLotCode] = useState<string>('#FPO-LOT-001');
  const [isSubmittingLot, setIsSubmittingLot] = useState<boolean>(false);
  const [lotSubmittedSuccess, setLotSubmittedSuccess] = useState<boolean>(false);
  const [offerAccepted, setOfferAccepted] = useState<boolean>(false);

  const [isLoadingReqs, setIsLoadingReqs] = useState<boolean>(true);
  const [isLoadingMembers, setIsLoadingMembers] = useState<boolean>(false);

  const fulfillmentRef = useRef<HTMLDivElement>(null);
  const lotRef = useRef<HTMLDivElement>(null);

  // 1. Fetch active buyer requirements
  useEffect(() => {
    const fetchRequirements = async () => {
      setIsLoadingReqs(true);
      try {
        const res = await api.get('/fpo/requirements');
        if (res.data?.data && res.data.data.length > 0) {
          const list: BuyerRequirementItem[] = res.data.data;
          setRequirements(list);

          // Auto-select requirement matching the crop already in context (from Module 01/02)
          const contextCrop = produce.crop?.toLowerCase() || '';
          const primary =
            (contextCrop ? list.find((r) => r.cropName.toLowerCase() === contextCrop) : null) ||
            list[0];
          setSelectedRequirement(primary);
        }
      } catch (err) {
        console.error('Error fetching FPO buyer requirements:', err);
      } finally {
        setIsLoadingReqs(false);
      }
    };

    fetchRequirements();
  }, [produce.crop]);

  // 2. Fetch eligible member supply when requirement changes
  useEffect(() => {
    if (!selectedRequirement) return;

    const fetchMembers = async () => {
      setIsLoadingMembers(true);
      try {
        const res = await api.get(`/fpo/members?crop=${selectedRequirement.cropName}`);
        if (res.data?.data) {
          const memberList: FPOMemberItem[] = res.data.data;
          setMembers(memberList);

          // Auto-allocate top 3 eligible members to match required volume (e.g. 15Q + 20Q + 15Q = 50Q)
          const eligible = memberList.filter((m) => m.isEligible);
          const initialSelectedIds = eligible.slice(0, 3).map((m) => m.farmerId);
          setSelectedMemberIds(initialSelectedIds);

          const initialAllocations: Record<number, number> = {};
          if (eligible[0]) initialAllocations[eligible[0].farmerId] = 15;
          if (eligible[1]) initialAllocations[eligible[1].farmerId] = 20;
          if (eligible[2]) initialAllocations[eligible[2].farmerId] = 15;
          setAllocations(initialAllocations);
        }
      } catch (err) {
        console.error('Error fetching FPO members:', err);
      } finally {
        setIsLoadingMembers(false);
      }
    };

    fetchMembers();
  }, [selectedRequirement]);

  // Handle requirement selection
  const handleSelectRequirement = (req: BuyerRequirementItem) => {
    setSelectedRequirement(req);
    setLotSubmittedSuccess(false);
    setOfferAccepted(false);
    setTimeout(() => {
      fulfillmentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  // Toggle member participation
  const handleToggleMember = (farmerId: number) => {
    setSelectedMemberIds((prev) => {
      if (prev.includes(farmerId)) {
        const next = prev.filter((id) => id !== farmerId);
        setAllocations((curr) => {
          const copy = { ...curr };
          delete copy[farmerId];
          return copy;
        });
        return next;
      } else {
        const member = members.find((m) => m.farmerId === farmerId);
        const defaultQty = member ? Math.min(15, member.availableQtyQuintals) : 10;
        setAllocations((curr) => ({ ...curr, [farmerId]: defaultQty }));
        return [...prev, farmerId];
      }
    });
  };

  // Update allocation amount
  const handleUpdateAllocation = (farmerId: number, qty: number) => {
    setAllocations((prev) => ({
      ...prev,
      [farmerId]: qty,
    }));
  };

  // Calculate total aggregated quintals
  const currentAggregatedQuintals = selectedMemberIds.reduce((sum, id) => {
    return sum + (allocations[id] || 0);
  }, 0);

  // Submit Lot to Buyer via PostgreSQL API
  const handleSubmitLot = async () => {
    if (!selectedRequirement) return;
    setIsSubmittingLot(true);
    try {
      const allocationArray = selectedMemberIds.map((id) => ({
        farmerId: id,
        allocatedQty: allocations[id] || 0,
      }));

      const res = await api.post('/fpo/aggregate', {
        cropName: selectedRequirement.cropName,
        grade: selectedRequirement.qualitySpecification,
        offeredPrice: selectedRequirement.benchmarkPricePerQuintal,
        allocations: allocationArray,
        buyerId: selectedRequirement.buyerId,
        requirementId: selectedRequirement.id,
      });

      if (res.data?.data) {
        setLotCode(res.data.data.lotCode || '#FPO-LOT-001');
        setLotSubmittedSuccess(true);
        setTimeout(() => {
          lotRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
      }
    } catch (err) {
      console.error('Error submitting FPO lot:', err);
    } finally {
      setIsSubmittingLot(false);
    }
  };

  const allocatedMembers = members.filter((m) => selectedMemberIds.includes(m.farmerId));

  return (
    <div className="space-y-6 pb-12">
      {/* ── Top Header Banner with Origin & Process Steps ───────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
            <span>{t('module3Active', 'MODULE 03 ACTIVE • FPO PRODUCE AGGREGATION & CONTRACT FULFILLMENT')}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2 flex items-center gap-2">
            {t('fpoAggregationTitle', 'FPO Aggregation')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {t('fpoAggregationDesc', 'Bundle smallholder harvests into verified bulk lots to fulfill institutional buyer contracts with guaranteed escrow payments.')}
          </p>
        </div>

        {/* FPO Gateway Badge */}
        <div className="bg-white rounded-2xl p-3 sm:px-4 sm:py-3 border border-slate-200 shadow-sm flex items-center gap-3 shrink-0 self-start sm:self-center">
          <div className="w-9 h-9 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center font-bold">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {t('enamFpoGateway', 'e-NAM FPO GATEWAY v4.2')}
            </span>
            <span className="text-xs sm:text-sm font-extrabold text-slate-900 block">
              {t('baramatiKisanProducer', 'Baramati Kisan Producer Co. (Reg: FPO-MH-2024-882)')}
            </span>
          </div>
        </div>
      </div>

      {/* ── 5-Step Process Pipeline Breadcrumbs matching screenshot ─────────────── */}
      <div className="hidden lg:grid grid-cols-5 gap-3 p-3 bg-white rounded-2xl border border-slate-200 text-xs font-bold">
        <div className="flex items-center gap-2 text-forest-800 bg-forest-50 p-2 rounded-xl border border-forest-200">
          <span className="w-5 h-5 rounded-full bg-forest-800 text-white flex items-center justify-center text-[10px]">
            ✓
          </span>
          <span>{t('step01BuyerRequirement', 'STEP 01: Buyer Requirement')}</span>
        </div>

        <div className="flex items-center gap-2 text-forest-800 bg-forest-50 p-2 rounded-xl border border-forest-200">
          <span className="w-5 h-5 rounded-full bg-forest-800 text-white flex items-center justify-center text-[10px]">
            ✓
          </span>
          <span>{t('step02FilterFarmers', 'STEP 02: Filter Farmers')}</span>
        </div>

        <div className="flex items-center gap-2 text-forest-800 bg-forest-50 p-2 rounded-xl border border-forest-200">
          <span className="w-5 h-5 rounded-full bg-forest-800 text-white flex items-center justify-center text-[10px]">
            ✓
          </span>
          <span>{t('step03AggregateQuantity', 'STEP 03: Aggregate Quantity')}</span>
        </div>

        <div className="flex items-center gap-2 text-slate-700 bg-slate-50 p-2 rounded-xl">
          <span className="w-5 h-5 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center text-[10px]">
            4
          </span>
          <span>{t('step04GenerateFpoLot', 'STEP 04: Generate FPO Lot')}</span>
        </div>

        <div className="flex items-center gap-2 text-slate-400 bg-slate-50 p-2 rounded-xl">
          <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-[10px]">
            5
          </span>
          <span>{t('step05ContractPayout', 'STEP 05: Contract Payout')}</span>
        </div>
      </div>

      {/* ── 1. Active Verified Buyer Requirements ───────────────────────────────── */}
      {isLoadingReqs ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center">
          <RefreshCw className="w-8 h-8 text-forest-700 animate-spin mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-600">{t('loadingVerifiedBuyerReqs', 'Loading verified buyer requirements...')}</p>
        </div>
      ) : (
        <BuyerRequirementsList
          requirements={requirements}
          selectedRequirementId={selectedRequirement?.id}
          onSelectRequirement={handleSelectRequirement}
        />
      )}

      {/* ── 2. Fulfillment Console Target ───────────────────────────────────────── */}
      <div ref={fulfillmentRef}>
        {selectedRequirement && (
          <FulfillmentConsole
            selectedRequirement={selectedRequirement}
            currentAggregatedQuintals={currentAggregatedQuintals}
          />
        )}
      </div>

      {/* ── 3. Available FPO Member Supply Table ─────────────────────────────────── */}
      {selectedRequirement && (
        <MemberSupplyTable
          members={members}
          selectedMemberIds={selectedMemberIds}
          allocations={allocations}
          onToggleMember={handleToggleMember}
          onUpdateAllocation={handleUpdateAllocation}
          pricePerQuintal={selectedRequirement.benchmarkPricePerQuintal}
        />
      )}

      {/* ── 4 & 5. FPO Consolidated Lot & Guaranteed Commercial Offer ────────────── */}
      <div ref={lotRef}>
        {selectedRequirement && (
          <LotSubmissionAndOffer
            lotCode={lotCode}
            requirement={selectedRequirement}
            allocatedMembers={allocatedMembers}
            allocations={allocations}
            totalQuantityQuintals={currentAggregatedQuintals}
            offeredPrice={selectedRequirement.benchmarkPricePerQuintal}
            onSubmitLot={handleSubmitLot}
            onAcceptOffer={() => {
              setOfferAccepted(true);
              alert(t('buyerPurchaseOfferAccepted', '🎉 Buyer Purchase Offer Accepted! e-NAM Escrow Contract #AGR-MH-2026-904 Activated.'));
            }}
            onRequestCounterBid={() => {
              alert(t('counterBidTransmitted', 'Counter-bid (+₹1.00/kg) transmitted to institutional procurement desk.'));
            }}
            isSubmitting={isSubmittingLot}
            lotSubmittedSuccess={lotSubmittedSuccess}
          />
        )}
      </div>

      {/* ── Verified Protocol Footer Banner ─────────────────────────────────────── */}
      <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5 font-bold text-slate-800">
            <FileCheck className="w-4 h-4 text-emerald-700" />
            <span>{t('smartContractId', 'Smart Contract #SC-MH-2026-904')}</span>
          </span>
          <span>•</span>
          <span>{t('zeroCommissionCompliant', 'Zero Commission Mandate Compliant')}</span>
          <span>•</span>
          <span>{t('fastTrackSettlement', 'Fast-track Settlement Protocol')}</span>
        </div>

        <span className="text-[11px] text-slate-400">
          {t('lastSyncInfo', 'Last Sync: Today, 11:42 AM IST • Baramati Aggregation Center')}
        </span>
      </div>
    </div>
  );
};
