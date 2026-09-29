import React from 'react';
import { Target, CheckCircle2, ShieldCheck, Truck, Calendar, Lock } from 'lucide-react';
import { BuyerRequirementItem } from '../../types/fpoAggregation';

interface FulfillmentConsoleProps {
  selectedRequirement: BuyerRequirementItem;
  currentAggregatedQuintals: number;
}

export const FulfillmentConsole: React.FC<FulfillmentConsoleProps> = ({
  selectedRequirement,
  currentAggregatedQuintals,
}) => {
  const targetQuintals = selectedRequirement.requiredVolumeQuintals;
  const progressPercent = Math.min(100, Math.round((currentAggregatedQuintals / targetQuintals) * 100));
  const isFulfilled = currentAggregatedQuintals >= targetQuintals;

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
      {/* Title bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-forest-800 text-white flex items-center justify-center font-bold shadow-md shadow-forest-950/10 shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                FULFILLMENT CONSOLE TARGET
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              Fulfill Requirement: {selectedRequirement.buyerName}
            </h3>
            <p className="text-xs text-slate-500">
              {selectedRequirement.cropName} • {selectedRequirement.requiredVolumeQuintals} Quintals • Grade A • {selectedRequirement.destinationHub}
            </p>
          </div>
        </div>

        <div className="px-3.5 py-1.5 rounded-2xl bg-slate-50 border border-slate-200 text-right self-start sm:self-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            LOT AUTHORIZATION
          </span>
          <span className="text-xs font-black text-slate-800 font-mono">
            Baramati FPO AMR-882
          </span>
        </div>
      </div>

      {/* Smart Aggregation Insight Callout */}
      <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-blue-950 text-xs flex items-start gap-2.5">
        <span className="text-blue-700 font-bold text-base mt-0.5">💡</span>
        <p className="text-[11px] leading-relaxed">
          <strong>Smart Aggregation Insight:</strong> Single-Farmer Bypass Available for smaller sub-lots, but for this {targetQuintals} Q order, combining 3 nearby Grade-A certified members optimizes transport and guarantees complete fulfillment without quality degradation.
        </p>
      </div>

      {/* Progress Bar & Status Metric */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between text-xs font-extrabold">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 uppercase tracking-wider text-[10px]">
              TARGET FULFILLMENT PROGRESS
            </span>
            <span className="text-forest-800 text-lg font-black">
              {currentAggregatedQuintals} / {targetQuintals} Quintals
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                isFulfilled
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}
            >
              {progressPercent}% {isFulfilled ? 'FULFILLED' : 'PARTIAL'}
            </span>
          </div>

          <span className="text-slate-500 font-medium text-[11px]">
            Allocated member pool: 3 Approved Farmers
          </span>
        </div>

        {/* Progress bar line */}
        <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            style={{ width: `${progressPercent}%` }}
            className="h-full rounded-full bg-gradient-to-r from-forest-800 via-emerald-600 to-emerald-400 transition-all duration-500 shadow-sm"
          />
        </div>
      </div>

      {/* 4 Protocol Checkpoints Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <span className="font-bold text-slate-800 block text-[11px]">Quantity Requirement</span>
            <span className="text-[10px] text-slate-500">
              {currentAggregatedQuintals} Q / {targetQuintals} Q Fulfilled
            </span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <span className="font-bold text-slate-800 block text-[11px]">Quality Compliance</span>
            <span className="text-[10px] text-emerald-700 font-semibold">100% Grade A FAQ</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2">
          <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <span className="font-bold text-slate-800 block text-[11px]">Logistics Radius</span>
            <span className="text-[10px] text-slate-500">&lt; 15 km Baramati Cluster</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <span className="font-bold text-slate-800 block text-[11px]">Dispatch Schedule</span>
            <span className="text-[10px] text-slate-500">25 Sep Morning Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};
