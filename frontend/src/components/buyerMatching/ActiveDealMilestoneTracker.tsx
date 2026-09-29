import React from 'react';
import {
  CheckCircle2,
  Clock,
  Truck,
  FileCheck,
  Scale,
  CreditCard,
  Download,
  Eye,
  PlusCircle,
} from 'lucide-react';
import { TransactionMilestone } from '../../types/buyerMatching';

interface DealMilestoneProps {
  deal: TransactionMilestone;
  onDownloadContract: () => void;
  onViewGatePass: () => void;
  onListAnother: () => void;
}

export const ActiveDealMilestoneTracker: React.FC<DealMilestoneProps> = ({
  deal,
  onDownloadContract,
  onViewGatePass,
  onListAnother,
}) => {
  const steps = [
    {
      num: 1,
      title: '1. Offer Accepted',
      sub: '24 Sep, 10:15 AM',
      note: 'Contract digitally signed',
      status: 'DONE',
    },
    {
      num: 2,
      title: '2. Transit Booked',
      sub: 'Truck #MH-12-RN-4819',
      note: 'Pickup scheduled tomorrow 06:30 AM',
      status: 'IN_TRANSIT',
    },
    {
      num: 3,
      title: '3. Quality Verification',
      sub: 'Baramati FPO Hub',
      note: 'Assaying firm red firmness',
      status: 'NEXT',
    },
    {
      num: 4,
      title: '4. Weighment Clearance',
      sub: 'Digital Bridge Scale',
      note: 'Exact tare & gross slip print',
      status: 'UPCOMING',
    },
    {
      num: 5,
      title: '5. Bank DBT Settlement',
      sub: 'Aadhaar Enabled Pay',
      note: 'Within 24 hours of dispatch',
      status: 'FINAL',
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-forest-800 text-white flex items-center justify-center text-xs font-black">
              5
            </span>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              Active Confirmed Deal & Milestone Progression
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-mono">
              ORDER #{deal.orderId}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Legally binding transaction logged under e-NAM electronic contract framework.
          </p>
        </div>

        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5 self-start sm:self-center">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Status: {deal.statusLabel}</span>
        </span>
      </div>

      {/* 4 Deal Parameter Boxes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">CONTRACTED BUYER</span>
          <span className="text-sm font-black text-slate-900 block mt-0.5">{deal.buyerName}</span>
          <span className="text-[10px] text-slate-500">Procurement Rep: {deal.procurementRep}</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">AGREED QUANTITY & PRICE</span>
          <span className="text-sm font-black text-slate-900 block mt-0.5">
            {deal.quantityQuintals} Quintals @ ₹{deal.pricePerKg.toFixed(0)}/kg
          </span>
          <span className="text-[10px] text-emerald-700 font-semibold">Grade A (Firm Red Tomatoes)</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200">
          <span className="text-[10px] text-emerald-800 uppercase font-bold block">ESCROW PROTECTION</span>
          <span className="text-base font-black text-emerald-950 block mt-0.5">
            ₹{deal.totalEscrowLocked.toLocaleString('en-IN')} Locked
          </span>
          <span className="text-[10px] text-emerald-800">🔒 Guaranteed DBT via Canara e-NAM</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">DESIGNATED DISPATCH</span>
          <span className="text-sm font-black text-slate-900 block mt-0.5">{deal.designatedDispatch}</span>
          <span className="text-[10px] text-slate-500">Baramati FPO Shed, Gate 02</span>
        </div>
      </div>

      {/* 5-Step Visual Deal Milestone Tracker */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <span>Deal Milestone Tracker (Automated Real-Time Sync)</span>
          <span className="text-forest-800">Stage 2 of 5 Completed</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {steps.map((s, idx) => {
            const isDone = s.status === 'DONE';
            const isCurrent = s.status === 'IN_TRANSIT';

            return (
              <div
                key={idx}
                className={`p-3 rounded-2xl border transition-all text-xs ${
                  isDone
                    ? 'bg-emerald-50/60 border-emerald-200'
                    : isCurrent
                    ? 'bg-forest-900 text-white border-forest-900 shadow-md'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-emerald-400 text-forest-950'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isDone ? '✓' : s.num}
                  </span>

                  <span
                    className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                      isDone
                        ? 'bg-emerald-100 text-emerald-800'
                        : isCurrent
                        ? 'bg-emerald-800 text-emerald-200'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {s.status}
                  </span>
                </div>

                <strong
                  className={`block text-xs font-bold ${
                    isCurrent ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {s.title}
                </strong>
                <span
                  className={`text-[10px] block mt-0.5 ${
                    isCurrent ? 'text-emerald-200' : 'text-slate-500'
                  }`}
                >
                  {s.sub}
                </span>
                <p
                  className={`text-[9px] mt-1 line-clamp-1 ${
                    isCurrent ? 'text-slate-300' : 'text-slate-400'
                  }`}
                >
                  {s.note}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
        <span className="text-xs text-slate-500 font-medium">
          🔒 Digital proof ready for insurance and bank credit limit enhancement.
        </span>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={onDownloadContract}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Digital Sale Contract (PDF)</span>
          </button>

          <button
            type="button"
            onClick={onViewGatePass}
            className="px-3.5 py-2 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Dispatch Gate Pass</span>
          </button>

          <button
            type="button"
            onClick={onListAnother}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>List Another Produce Batch</span>
          </button>
        </div>
      </div>
    </div>
  );
};
