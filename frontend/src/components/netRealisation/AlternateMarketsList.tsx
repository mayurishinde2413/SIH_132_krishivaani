import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { MarketNetResult } from '../../types/netRealisation';

interface AlternateMarketsListProps {
  alternates: MarketNetResult[];
  onViewAudit: (m: MarketNetResult) => void;
  selectedMarketId?: number;
}

export const AlternateMarketsList: React.FC<AlternateMarketsListProps> = ({
  alternates,
  onViewAudit,
  selectedMarketId,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">
          Alternative Mandi Options ({alternates.length} Analyzed)
        </h3>
        <span className="text-[11px] text-slate-400 font-semibold">
          Ranked by Expected Net Take-Home
        </span>
      </div>

      <div className="space-y-3">
        {alternates.map((m) => {
          const isSelected = selectedMarketId === m.marketId;
          return (
            <div
              key={m.marketId}
              className={`bg-white rounded-2xl p-4 border transition-all duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isSelected
                  ? 'border-forest-700 ring-2 ring-forest-700/20 shadow-sm'
                  : 'border-slate-200/90 hover:border-slate-300'
              }`}
            >
              {/* Left: Rank & Mandi Name */}
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {m.rank}
                </span>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-extrabold text-slate-900 text-sm">{m.marketName}</h4>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-600">
                      {m.district} APMC
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1 flex-wrap">
                    <span>
                      Distance: <strong className="text-slate-700">{m.distanceKm} km</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Headline: <strong className="text-slate-700">₹{m.quotedPricePerKg.toFixed(2)}/kg</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Freight: <strong className="text-rose-600">-₹{m.breakdown.transportCost}</strong>
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{m.keyReason}</p>
                </div>
              </div>

              {/* Right: Net Realisation Payout + View Audit button */}
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <div className="text-left sm:text-right">
                  <span className="text-lg font-black text-slate-900 block leading-tight">
                    ₹{m.breakdown.netRealisation.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-emerald-700 font-bold">
                    Net ₹{m.breakdown.netRealisationPerKg}/kg
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onViewAudit(m)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    isSelected
                      ? 'bg-forest-800 text-white border-forest-800'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  View Audit
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
