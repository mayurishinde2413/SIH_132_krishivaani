import React from 'react';
import { Check, CheckCircle2, AlertTriangle, HelpCircle, ArrowRight } from 'lucide-react';
import { SellNowOptionData, WaitOptionData } from '../../types/sellWait';

interface CompareChoicesProps {
  quantityQuintals: number;
  sellNow: SellNowOptionData;
  waitOption: WaitOptionData;
  onSelectSellNow: () => void;
  onSelectWait: () => void;
}

export const CompareChoices: React.FC<CompareChoicesProps> = ({
  quantityQuintals,
  sellNow,
  waitOption,
  onSelectSellNow,
  onSelectWait,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-forest-800 text-white flex items-center justify-center text-xs font-black">
            3
          </span>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
            Compare Your Choices: Sell Now vs Wait
          </h3>
        </div>
        <span className="text-xs font-semibold text-slate-400">
          Calculated for {quantityQuintals} Quintals
        </span>
      </div>

      {/* 2-Column Side-by-Side Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* OPTION 1: SELL NOW */}
        <div
          className={`bg-white rounded-3xl p-6 sm:p-7 border-2 transition-all flex flex-col justify-between space-y-5 relative overflow-hidden ${
            sellNow.isRecommended
              ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md shadow-emerald-950/5'
              : 'border-slate-200 shadow-sm'
          }`}
        >
          {sellNow.isRecommended && (
            <div className="absolute top-4 right-4 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider">
              <Check className="w-3 h-3" />
              <span>RECOMMENDED OPTION</span>
            </div>
          )}

          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              OPTION 1
            </span>
            <h4 className="text-2xl font-black text-slate-900 mt-0.5">
              {sellNow.title}
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">{sellNow.subtitle}</p>

            {/* Expected Payout Banner */}
            <div className="mt-4 p-5 rounded-2xl bg-forest-900 text-white shadow-inner">
              <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">
                Current Expected Return
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                  ₹{sellNow.expectedReturn.toLocaleString('en-IN')}
                </span>
              </div>
              <span className="text-xs text-emerald-200/80 block mt-1">
                {quantityQuintals} Q × ₹{sellNow.pricePerQ.toLocaleString('en-IN')}/Q (Zero deductions)
              </span>
            </div>

            {/* 4 Selling points */}
            <div className="mt-4 space-y-2.5 text-xs font-semibold">
              {sellNow.points.map((pt, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={onSelectSellNow}
            className="w-full py-3 px-4 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-black text-xs transition-all shadow-md shadow-forest-950/20 flex items-center justify-center gap-1.5"
          >
            <span>View Sell Now Options</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* OPTION 2: WAIT 5 DAYS */}
        <div
          className={`bg-white rounded-3xl p-6 sm:p-7 border-2 transition-all flex flex-col justify-between space-y-5 ${
            waitOption.potentialNetReturn > sellNow.expectedReturn && !sellNow.isRecommended
              ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
              : 'border-slate-200 shadow-sm'
          }`}
        >
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              OPTION 2
            </span>
            <h4 className="text-2xl font-black text-slate-900 mt-0.5">
              {waitOption.title}
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">{waitOption.subtitle}</p>

            {/* Potential Gross Banner */}
            <div className="mt-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                📈 Potential Gross Return
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                  ₹{waitOption.potentialGrossReturn.toLocaleString('en-IN')}*
                </span>
                <span className="text-xs font-bold text-forest-800">
                  (@ ₹{waitOption.potentialPrice.toLocaleString('en-IN')}/Q)
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">
                *Estimated / Potential (subject to storage & quality factors)
              </span>
            </div>

            {/* 4 Waiting points / risks */}
            <div className="mt-4 space-y-2.5 text-xs font-semibold">
              <div className="flex items-center gap-2 text-slate-800">
                <span className="text-emerald-600 font-bold">➡️</span>
                <span>{waitOption.points[0]}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-800">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{waitOption.points[1]}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-800">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{waitOption.points[2]}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-800">
                <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{waitOption.points[3]}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onSelectWait}
            className="w-full py-3 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-black text-xs transition-all flex items-center justify-center gap-1.5"
          >
            <span>View Wait Details</span>
            <span>ℹ️</span>
          </button>
        </div>
      </div>
    </div>
  );
};
