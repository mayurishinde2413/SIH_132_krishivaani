import React from 'react';
import { ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { BuyerRequirementItem } from '../../types/fpoAggregation';
import { getCropIcon } from '../../utils/cropIcon';

interface BuyerRequirementsListProps {
  requirements: BuyerRequirementItem[];
  selectedRequirementId?: number;
  onSelectRequirement: (req: BuyerRequirementItem) => void;
}

export const BuyerRequirementsList: React.FC<BuyerRequirementsListProps> = ({
  requirements,
  selectedRequirementId,
  onSelectRequirement,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-forest-800 bg-forest-50 px-2 py-0.5 rounded-full border border-forest-200">
              PROCUREMENT PIPELINE
            </span>
            <span className="text-xs font-bold text-slate-500">
              {requirements.length} Active Verified Contracts
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Active Verified Buyer Requirements
          </h2>
          <p className="text-xs text-slate-500">
            Verified institutional buyers seeking aggregated farmer produce with guaranteed purchase orders.
          </p>
        </div>

        <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 self-start sm:self-center">
          ● Matching Algorithm: 99.4% precision
        </span>
      </div>

      {/* 3-Column Requirements Grid matching screenshot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {requirements.map((req, idx) => {
          const isSelected = selectedRequirementId === req.id;
          const isPrimary = idx === 0;

          return (
            <div
              key={req.id}
              className={`bg-white rounded-3xl p-5 border-2 transition-all duration-200 flex flex-col justify-between space-y-4 ${
                isSelected
                  ? 'border-forest-800 ring-2 ring-forest-800/20 shadow-md shadow-forest-950/5'
                  : 'border-slate-200/90 hover:border-forest-300 shadow-sm'
              }`}
            >
              <div>
                {/* Badges row */}
                <div className="flex items-center justify-between gap-1 flex-wrap mb-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {req.buyerType}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Verified e-NAM Buyer
                    </span>
                  </div>

                  {isPrimary && (
                    <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-forest-800 text-emerald-200 uppercase">
                      ★ PRIMARY FOCUS
                    </span>
                  )}
                </div>

                <h3 className="font-extrabold text-slate-900 text-lg leading-snug">
                  {req.buyerName}
                </h3>
                <p className="text-xs font-bold text-forest-800 mt-0.5">
                  {getCropIcon(req.cropName)} {req.cropName} {req.cropLocalName ? `(${req.cropLocalName})` : ''}
                </p>

                {/* Requirements detail box */}
                <div className="mt-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[11px]">Required Volume:</span>
                    <strong className="text-slate-900 font-bold">
                      {req.requiredVolumeQuintals} Quintals ({req.requiredVolumeKg.toLocaleString('en-IN')} kg)
                    </strong>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[11px]">Quality Specification:</span>
                    <span className="text-slate-800 font-semibold text-[11px] text-right truncate max-w-[160px]">
                      {req.qualitySpecification}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[11px]">Destination Hub:</span>
                    <span className="text-slate-700 text-[11px] font-medium text-right truncate max-w-[150px]">
                      {req.destinationHub}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[11px]">Delivery Window:</span>
                    <span className="text-emerald-700 font-bold text-[11px]">
                      {req.deliveryWindow}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price & Select Button */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-baseline justify-between mb-3">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Benchmark Purchase Price
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-forest-900">
                      ₹{req.benchmarkPricePerQuintal.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-slate-500 font-bold"> / Quintal</span>
                    <span className="text-[11px] text-slate-400 block font-medium">
                      (₹{req.benchmarkPricePerKg.toFixed(2)}/kg)
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectRequirement(req)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-sm ${
                    isSelected
                      ? 'bg-forest-800 text-white shadow-forest-950/20'
                      : 'bg-slate-100 hover:bg-forest-800 hover:text-white text-slate-700'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>Selected for Fulfillment</span>
                    </>
                  ) : (
                    <>
                      <span>Select Requirement</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
