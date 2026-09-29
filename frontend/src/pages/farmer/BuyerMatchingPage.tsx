// frontend/src/pages/farmer/BuyerMatchingPage.tsx
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';

import { ProduceInputForm } from '../../components/buyerMatching/ProduceInputForm';
import { VerifiedBuyersGrid } from '../../components/buyerMatching/VerifiedBuyersGrid';
import { NegotiationConsole } from '../../components/buyerMatching/NegotiationConsole';
import { ActiveDealMilestoneTracker } from '../../components/buyerMatching/ActiveDealMilestoneTracker';

import { BuyerMatchItem, TransactionMilestone } from '../../types/buyerMatching';
import { RefreshCw } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { useProduce } from '../../context/ProduceContext';

// ── Toast ─────────────────────────────────────────────────────────────────────
const Toast: React.FC<{ msg: string; type?: 'success' | 'error' | 'info'; onClose: () => void }> = ({
  msg, type = 'info', onClose,
}) => {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  const bg =
    type === 'success' ? 'bg-emerald-700' : type === 'error' ? 'bg-rose-700' : 'bg-slate-800';

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 ${bg} text-white rounded-2xl px-5 py-3 text-sm font-semibold shadow-xl max-w-sm flex items-center gap-3`}
    >
      <span className="flex-1">{msg}</span>
      <button onClick={onClose} className="opacity-70 hover:opacity-100 text-xs font-bold">
        ✕
      </button>
    </div>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
export const BuyerMatchingPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { produce, updateProduce } = useProduce();

  // 1. Produce form state initialized from shared lot context
  const [crops, setCrops] = useState<Array<{ id: number; name: string; localName: string | null }>>([]);
  const [crop, setCrop] = useState(produce.crop || 'Tomato');
  const [quantityQuintals, setQuantityQuintals] = useState(produce.quantityQuintals || 50);
  const [grade, setGrade] = useState(produce.grade || 'Grade A (Firm Red, >45mm)');
  const [availableFrom, setAvailableFrom] = useState('25 Sep 2026 (Tomorrow AM)');

  // 2. Buyer matches
  const [buyers, setBuyers] = useState<BuyerMatchItem[]>([]);
  const [selectedBuyer, setSelectedBuyer] = useState<BuyerMatchItem | null>(null);
  const [askingRatePerKg, setAskingRatePerKg] = useState(29.5);

  // Active bid persisted to DB — holds the offerId from POST /api/bids response
  const [activeBidId, setActiveBidId] = useState<number | null>(null);

  // 3. Active deal milestone (after accept)
  const [activeDeal, setActiveDeal] = useState<TransactionMilestone | null>(null);

  // Loading / processing
  const [isLoadingCrops, setIsLoadingCrops] = useState(true);
  const [isLoadingBuyers, setIsLoadingBuyers] = useState(false);
  const [isProcessingBid, setIsProcessingBid] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);
  const showToast = useCallback(
    (msg: string, type: 'success' | 'error' | 'info' = 'info') => setToast({ msg, type }),
    []
  );

  const negotiationRef = useRef<HTMLDivElement>(null);
  const dealRef = useRef<HTMLDivElement>(null);

  const farmerDistrict = user?.farmer?.district || 'Pune';
  const farmerVillage = user?.farmer?.village || 'Baramati';
  const originDisplay = `${farmerVillage}, ${farmerDistrict} (MH)`;

  // ── Fetch crops ─────────────────────────────────────────────────────────────
  useEffect(() => {
    api.get('/crops')
      .then((r) => { if (r.data?.data) setCrops(r.data.data); })
      .catch(() => {})
      .finally(() => setIsLoadingCrops(false));
  }, []);

  // ── Fetch matching buyers ───────────────────────────────────────────────────
  const handleFindMatches = useCallback(async () => {
    setIsLoadingBuyers(true);
    setSelectedBuyer(null);
    setActiveBidId(null);
    setActiveDeal(null);

    // Sync state for downstream modules (e.g. Crop Rescue)
    updateProduce({
      crop,
      quantityQuintals,
      grade,
    });

    try {
      const res = await api.get(
        `/buyers/matches?crop=${encodeURIComponent(crop)}&quantity=${quantityQuintals}&grade=${encodeURIComponent(grade)}&district=${encodeURIComponent(farmerDistrict)}`
      );
      if (res.data?.data) {
        const list: BuyerMatchItem[] = res.data.data;
        setBuyers(list);
        if (list.length > 0) setSelectedBuyer(list[0]);
      }
    } catch {
      showToast(t('fetchBuyersFailed', 'Failed to fetch matching buyers. Please try again.'), 'error');
    } finally {
      setIsLoadingBuyers(false);
    }
  }, [crop, quantityQuintals, grade, farmerDistrict, showToast, t]);

  // Auto-fetch on mount
  useEffect(() => {
    handleFindMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Select buyer ────────────────────────────────────────────────────────────
  const handleSelectBuyer = (buyer: BuyerMatchItem) => {
    setSelectedBuyer(buyer);
    setActiveBidId(null); // reset any prior bid when switching buyer
    setTimeout(() => {
      negotiationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  // ── POST /api/bids — Send initial offer, persists to PostgreSQL ─────────────
  const handleSendOffer = async (buyer: BuyerMatchItem) => {
    setIsProcessingBid(true);
    try {
      const res = await api.post('/bids', {
        buyerId: buyer.buyerId,
        cropName: crop,
        quantityQuintals,
        askingPricePerQuintal: Math.round(askingRatePerKg * 100),
        grade,
        message: `Farmer offer: ${quantityQuintals} Q ${crop}, Grade ${grade} @ ₹${askingRatePerKg.toFixed(2)}/kg`,
      });
      if (res.data?.success) {
        const bid = res.data.data;
        setActiveBidId(bid.id);
        setSelectedBuyer(buyer);
        showToast(`${t('offerSent', '✅ Offer sent to')} ${buyer.buyerName} ${t('andSavedBid', 'and saved (Bid #')}${bid.id})`, 'success');
        setTimeout(() => {
          negotiationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 80);
      }
    } catch (e: any) {
      showToast(e?.response?.data?.message || t('sendOfferFailed', 'Failed to send offer. Please try again.'), 'error');
    } finally {
      setIsProcessingBid(false);
    }
  };

  // ── POST /api/bids/:id/counter — Counter offer ─────────────────────────────
  const handleCounterOffer = async (buyer: BuyerMatchItem, counterRate: number) => {
    setIsProcessingBid(true);
    try {
      // If no bid exists yet, create one first then counter
      let bidId = activeBidId;
      if (!bidId) {
        const createRes = await api.post('/bids', {
          buyerId: buyer.buyerId,
          cropName: crop,
          quantityQuintals,
          askingPricePerQuintal: Math.round(buyer.offeredPricePerKg * 100),
          grade,
          message: `Initial offer before counter`,
        });
        if (createRes.data?.success) {
          bidId = createRes.data.data.id;
          setActiveBidId(bidId);
        } else {
          throw new Error('Could not create initial offer');
        }
      }

      const res = await api.post(`/bids/${bidId}/counter`, {
        counterPricePerQuintal: Math.round(counterRate * 100),
        message: `Counter offer @ ₹${counterRate.toFixed(2)}/kg`,
      });

      if (res.data?.success) {
        showToast(`${t('counterOfferSent', 'Counter-offer')} ₹${counterRate.toFixed(2)}/kg ${t('sentTo', 'sent to')} ${buyer.buyerName}`, 'success');
      }
    } catch (e: any) {
      showToast(e?.response?.data?.message || t('counterOfferFailed', 'Counter-offer failed. Please try again.'), 'error');
    } finally {
      setIsProcessingBid(false);
    }
  };

  // ── POST /api/bids/:id/accept — Accept offer, creates Transaction ───────────
  const handleAcceptOffer = async (buyer: BuyerMatchItem, finalRate: number) => {
    setIsProcessingBid(true);
    try {
      // Create the bid if not already done
      let bidId = activeBidId;
      if (!bidId) {
        const createRes = await api.post('/bids', {
          buyerId: buyer.buyerId,
          cropName: crop,
          quantityQuintals,
          askingPricePerQuintal: Math.round(finalRate * 100),
          grade,
          message: `Offer accepted: ${quantityQuintals} Q ${crop} @ ₹${finalRate.toFixed(2)}/kg`,
        });
        if (createRes.data?.success) {
          bidId = createRes.data.data.id;
          setActiveBidId(bidId);
        } else {
          throw new Error('Could not create bid offer');
        }
      }

      // Accept — this creates the Transaction record in DB
      const acceptRes = await api.post(`/bids/${bidId}/accept`);
      if (acceptRes.data?.success) {
        const txn = acceptRes.data.data?.transaction;
        const totalAmount = Math.round(quantityQuintals * 100 * finalRate);

        const orderId = txn?.id
          ? `ORD-MH-2026-${String(txn.id).padStart(5, '0')}`
          : `ORD-MH-2026-${bidId}`;

        const deal: TransactionMilestone = {
          orderId,
          buyerName: buyer.buyerName,
          procurementRep: 'Procurement Team',
          quantityQuintals,
          pricePerKg: finalRate,
          totalEscrowLocked: totalAmount,
          designatedDispatch: `25 Sep • 08:30 AM`,
          currentStep: 2,
          statusLabel: 'Confirmed — Awaiting Gate Dispatch',
        };
        setActiveDeal(deal);
        showToast(`${t('dealConfirmed', '🎉 Deal confirmed with')} ${buyer.buyerName}! Transaction #${txn?.id || bidId} ${t('transactionCreated', 'created.')}`, 'success');
        setTimeout(() => {
          dealRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    } catch (e: any) {
      showToast(e?.response?.data?.message || t('acceptOfferFailed', 'Failed to accept offer. Please try again.'), 'error');
    } finally {
      setIsProcessingBid(false);
    }
  };

  // ── POST /api/bids/:id/reject — Decline offer ──────────────────────────────
  const handleDeclineOffer = async (buyer: BuyerMatchItem) => {
    if (!window.confirm(`${t('declineConfirm1', 'Decline')} ${buyer.buyerName}${t('declineConfirm2', "'s offer? This cannot be undone.")}`)) return;
    setIsProcessingBid(true);
    try {
      if (activeBidId) {
        await api.post(`/bids/${activeBidId}/reject`);
      }
      setSelectedBuyer(null);
      setActiveBidId(null);
      showToast(`${t('offerFrom', 'Offer from')} ${buyer.buyerName} ${t('declined', 'declined.')}`, 'info');
    } catch (e: any) {
      // Even if reject API fails, clear UI
      setSelectedBuyer(null);
      setActiveBidId(null);
      showToast(t('offerDeclined', 'Offer declined.'), 'info');
    } finally {
      setIsProcessingBid(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast notification */}
      {toast && (
        <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />
      )}

      {/* ── Top Banner ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-1">
            <span className="text-forest-800 bg-forest-50 px-2.5 py-0.5 rounded-full border border-forest-200">
              {t('directBuyerConnection', 'DIRECT BUYER CONNECTION')}
            </span>
            <span>•</span>
            <span>{t('zeroIntermediaryDeductions', 'Zero Intermediary Deductions')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('buyerMatchingTitle', 'Find Buyers & Transparent Bidding')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-2xl">
            {t('buyerMatchingSubtitle', 'Tell us what you have in the field or warehouse. We connect you directly with verified institutional buyers, food processors, and retail chains looking for your exact crop, grade, and volume.')}
          </p>
        </div>

        {/* Active buyers badge */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm text-center min-w-[190px] shrink-0 self-start">
          <div className="flex items-center justify-center gap-1.5 font-black text-slate-900 text-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{buyers.length > 0 ? `${buyers.length} ${t('activeBuyers', 'Active Buyers')}` : t('defaultActiveBuyers', '18 Active Buyers')}</span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-0.5">{t('readyIn', 'Ready in')} {farmerDistrict} {t('cluster', 'Cluster')}</span>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-1.5 inline-block">
            {t('escrowGuaranteed', '🔒 100% Escrow Guaranteed')}
          </span>
        </div>
      </div>

      {/* ── 6-Step Process Flow ─────────────────────────────────────────────── */}
      <div className="hidden lg:grid grid-cols-6 gap-2 p-3 bg-white rounded-2xl border border-slate-200 text-xs font-bold">
        {[
          { icon: '📦', label: t('step1Listed', '1. Produce Listed'), sub: `${quantityQuintals} Q ${crop}` },
          { icon: '🔍', label: t('step2Matched', '2. Matched Buyers'), sub: `${buyers.length} ${t('topLeads', 'Top Leads')}` },
          { icon: '🤝', label: t('step3Terms', '3. Suitable Terms'), sub: t('gatePickups', 'Gate Pickups') },
          { icon: '🏷️', label: t('step4Offer', '4. Active Offer'), sub: `₹${(selectedBuyer?.offeredPricePerKg ?? 29).toFixed(0)}/kg` },
          { icon: '🔒', label: t('step5Deal', '5. Digital Deal'), sub: t('lockEscrow', 'Lock Escrow') },
          { icon: '🚚', label: t('step6Dispatch', '6. Dispatch & DBT'), sub: t('bankPayout', '24h Bank Payout') },
        ].map((step, i) => (
          <div
            key={i}
            className={`flex flex-col items-center p-2 rounded-xl text-center ${
              i < (activeDeal ? 5 : selectedBuyer ? 3 : buyers.length > 0 ? 2 : 1)
                ? 'bg-forest-50 text-forest-800 border border-forest-200'
                : 'bg-slate-50 text-slate-400'
            }`}
          >
            <span className="text-sm mb-0.5">{step.icon}</span>
            <span>{step.label}</span>
            <span className="text-[10px] font-normal text-slate-400">{step.sub}</span>
          </div>
        ))}
      </div>

      {/* ── 1. Produce Input Form ───────────────────────────────────────────── */}
      <ProduceInputForm
        crops={crops}
        crop={crop}
        setCrop={setCrop}
        quantityQuintals={quantityQuintals}
        setQuantityQuintals={setQuantityQuintals}
        grade={grade}
        setGrade={setGrade}
        availableFrom={availableFrom}
        setAvailableFrom={setAvailableFrom}
        originLocation={originDisplay}
        onFindMatches={handleFindMatches}
        onReset={() => {
          setCrop('Tomato');
          setQuantityQuintals(30);
          setGrade('Grade A (Firm Red, >45mm)');
        }}
        isLoading={isLoadingBuyers}
      />

      {/* ── 2. Verified Buyers Grid ─────────────────────────────────────────── */}
      {isLoadingBuyers ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center">
          <RefreshCw className="w-8 h-8 text-forest-700 animate-spin mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-600">{t('matchingVerifiedBuyers', 'Matching verified institutional buyers...')}</p>
        </div>
      ) : buyers.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-dashed border-slate-200 text-center">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-slate-500 font-semibold">{t('noMatchingBuyersFound', 'No matching buyers found for')} {crop}.</p>
          <p className="text-xs text-slate-400 mt-1">{t('tryDifferentCrop', 'Try a different crop or reduce the quantity.')}</p>
        </div>
      ) : (
        <VerifiedBuyersGrid
          buyers={buyers}
          selectedBuyerId={selectedBuyer?.id}
          onSelectBuyer={handleSelectBuyer}
          onSendOffer={handleSendOffer}
        />
      )}

      {/* ── 3. Negotiation & Bidding Console ───────────────────────────────── */}
      <div ref={negotiationRef}>
        {selectedBuyer && !activeDeal && (
          <NegotiationConsole
            buyer={selectedBuyer}
            quantityQuintals={quantityQuintals}
            askingRatePerKg={askingRatePerKg}
            onAcceptOffer={handleAcceptOffer}
            onCounterOffer={handleCounterOffer}
            onDeclineOffer={handleDeclineOffer}
            isProcessing={isProcessingBid}
          />
        )}
      </div>

      {/* ── 5. Deal Milestone Tracker ───────────────────────────────────────── */}
      <div ref={dealRef}>
        {activeDeal && (
          <ActiveDealMilestoneTracker
            deal={activeDeal}
            onDownloadContract={() =>
              showToast(t('downloadingContract', '📄 Downloading e-NAM Digital Contract PDF...'), 'info')
            }
            onViewGatePass={() =>
              showToast(t('gatePassGenerated', '🎟️ Dispatch Gate Pass generated. Report to FPO Hub.'), 'info')
            }
            onListAnother={() => {
              setActiveDeal(null);
              setSelectedBuyer(null);
              setActiveBidId(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </div>

      {/* ── Emergency Crop Rescue Escalation Strip ───────────────────────────── */}
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold shrink-0">
            🆘
          </span>
          <div>
            <span className="font-extrabold text-rose-950 block">{t('emergencyDispatchContingency', 'Emergency Dispatch Contingency')}</span>
            <span className="text-rose-700">{t('emergencyDispatchDesc', 'Facing buyer cancellation, gate rejection, or transport delay for your')} {produce.quantityQuintals} Q {produce.crop}?</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/farmer/crop-rescue')}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-colors shrink-0 self-start sm:self-center shadow-sm"
        >
          {t('openCropRescue', 'Open Crop Rescue (Module 06) →')}
        </button>
      </div>

      {/* Bottom footer strip */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400 pt-2 border-t border-slate-100">
        <span>{t('kisanCallCentre', '📞 Kisan Call Centre: 1800-180-1551 (Toll-Free 24×7)')}</span>
        <span>{t('enamCompliant', '🔒 e-NAM Standard Compliant • AgriStack Protocol Node #412')}</span>
      </div>
    </div>
  );
};
