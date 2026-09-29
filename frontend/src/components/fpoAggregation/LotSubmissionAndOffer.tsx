import React from 'react';
import { QrCode, Send, Edit, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { BuyerRequirementItem, FPOMemberItem } from '../../types/fpoAggregation';
import { getCropIcon } from '../../utils/cropIcon';

interface LotSubmissionAndOfferProps {
  lotCode?: string;
  requirement: BuyerRequirementItem;
  allocatedMembers: FPOMemberItem[];
  allocations: Record<number, number>;
  totalQuantityQuintals: number;
  offeredPrice: number;
  onSubmitLot: () => void;
  onAcceptOffer: () => void;
  onRequestCounterBid: () => void;
  isSubmitting: boolean;
  lotSubmittedSuccess: boolean;
}

export const LotSubmissionAndOffer: React.FC<LotSubmissionAndOfferProps> = ({
  lotCode = '#FPO-LOT-001',
  requirement,
  allocatedMembers,
  allocations,
  totalQuantityQuintals,
  offeredPrice,
  onSubmitLot,
  onAcceptOffer,
  onRequestCounterBid,
  isSubmitting,
  lotSubmittedSuccess,
}) => {
  const grossValue = Math.round(totalQuantityQuintals * offeredPrice);
  const fpoMargin = Math.round(grossValue * 0.02); // 2% FPO Reserve & Welfare
  const netFarmerPool = grossValue - fpoMargin;

  // Contributing members summary string
  const memberSummaryString = allocatedMembers
    .map((m) => `${m.name.split(' ')[0]}: ${allocations[m.farmerId] || 0}Q`)
    .join(', ');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left 6 Cols: FPO Consolidated Lot Blueprint Card */}
      <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
        <div>
          {/* Card Title & Lot Tag */}
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  READY FOR BUYER SUBMISSION
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  Verified e-NAM Lot
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                FPO Consolidated Lot: {lotCode}
              </h3>
              <p className="text-xs font-bold text-forest-800 mt-0.5">
                {getCropIcon(requirement.cropName)} {requirement.cropName} ({requirement.qualitySpecification})
              </p>
            </div>

            <div className="p-2 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700">
              <QrCode className="w-8 h-8" />
            </div>
          </div>

          {/* Details breakdown */}
          <div className="space-y-3 pt-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">TOTAL LOT VOLUME</span>
                <span className="text-base font-black text-slate-900 block mt-0.5">
                  {totalQuantityQuintals} Quintals
                </span>
                <span className="text-[10px] text-slate-500">
                  ({(totalQuantityQuintals * 100).toLocaleString('en-IN')} kg in 200 plastic crates)
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">QUALITY CERTIFICATION</span>
                <span className="text-xs font-black text-emerald-800 block mt-0.5">
                  Grade A Certified
                </span>
                <span className="text-[10px] text-slate-500">Inspected by FPO Quality Incharge</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">
                CONTRIBUTING MEMBER POOL
              </span>
              <span className="font-bold text-slate-900 block text-xs">
                {allocatedMembers.length} Farmers ({memberSummaryString})
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div className="p-2.5 rounded-xl bg-slate-50">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">DISPATCH YARD</span>
                <span className="text-slate-700 font-semibold block mt-0.5">
                  Baramati FPO Common Service Center (CSC Yard 2)
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">DELIVERY DESTINATION</span>
                <span className="text-slate-700 font-semibold block mt-0.5">
                  {requirement.destinationHub}
                </span>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 flex items-center justify-between">
              <span>Consignment Dispatch Time: 25 Sep 2026, 06:30 AM IST</span>
            </div>
          </div>
        </div>

        {/* Action button bar */}
        <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onSubmitLot}
            disabled={isSubmitting || totalQuantityQuintals === 0}
            className="flex-1 py-3 px-4 rounded-xl bg-forest-800 hover:bg-forest-900 disabled:opacity-50 text-white font-black text-xs transition-all shadow-md shadow-forest-950/20 flex items-center justify-center gap-2"
          >
            {lotSubmittedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Lot Submitted to Buyer ({requirement.buyerName})</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting...' : `Submit Lot to Buyer (${requirement.buyerName})`}</span>
              </>
            )}
          </button>

          <button
            type="button"
            className="p-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 shrink-0"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Allocation</span>
          </button>
        </div>
      </div>

      {/* Right 6 Cols: Guaranteed Institutional Commercial Contract Offer */}
      <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
        <div>
          {/* Card Title & Gross Value */}
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-black px-2 py-0.5 rounded bg-blue-100 text-blue-800 uppercase">
                GUARANTEED INSTITUTIONAL CONTRACT
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-1">
                Buyer Contract & Commercial Offer
              </h3>
              <p className="text-xs text-slate-500">
                Procuring Entity: {requirement.buyerName} (Procurement Division)
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                GROSS VALUE
              </span>
              <span className="text-2xl sm:text-3xl font-black text-forest-900">
                ₹{grossValue.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Financial Breakdown Table */}
          <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5 text-xs">
            <div className="flex items-center justify-between font-bold text-slate-800">
              <span>{totalQuantityQuintals} Quintals @ Benchmark ₹{offeredPrice.toLocaleString('en-IN')}/Q (₹{(offeredPrice/100).toFixed(2)}/kg)</span>
              <span>₹{grossValue.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex items-center justify-between text-slate-600 text-[11px]">
              <span className="flex items-center gap-1">
                <span>🏛️</span>
                <span>FPO Aggregation Margin (+2.0%)</span>
              </span>
              <span className="font-bold text-forest-800">+₹{fpoMargin.toLocaleString('en-IN')}</span>
            </div>

            <p className="text-[10px] text-slate-400 pl-4">
              Credited directly to Baramati FPO Reserve & Welfare Fund
            </p>

            <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="font-black text-slate-900 text-sm block">Net Farmer Payout Pool:</span>
                <span className="text-[10px] text-slate-400">
                  Distributed transparently to {allocatedMembers.length} farmer verified Aadhaar/DBT bank accounts
                </span>
              </div>
              <span className="text-lg font-black text-emerald-800">
                ₹{netFarmerPool.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Logistics & Escrow Terms */}
          <div className="mt-4 space-y-2 text-[11px] text-slate-600">
            <div className="flex items-start gap-2">
              <span className="text-emerald-700 font-bold mt-0.5">🚚</span>
              <span>
                <strong>Logistics & Packaging:</strong> Direct Buyer Truck Pickup at FPO Warehouse (Zero farmer freight deduction)
              </span>
            </div>

            <div className="flex items-start gap-2">
              <span className="text-emerald-700 font-bold mt-0.5">🔒</span>
              <span>
                <strong>Payment Terms:</strong> Escrow Locked • Direct DBT within 48 Hours of Gate Weighment
              </span>
            </div>
          </div>
        </div>

        {/* Contract Execution Actions */}
        <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onAcceptOffer}
            className="flex-1 py-3 px-4 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-black text-xs transition-all shadow-md shadow-forest-950/20 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>Accept Buyer Purchase Offer</span>
          </button>

          <button
            type="button"
            onClick={onRequestCounterBid}
            className="py-3 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1 shrink-0"
          >
            <span>Request Counter-Bid (+₹1.00/kg)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
