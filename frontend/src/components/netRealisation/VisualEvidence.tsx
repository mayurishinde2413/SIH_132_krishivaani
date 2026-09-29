import React from 'react';
import { MarketNetResult } from '../../types/netRealisation';

interface VisualEvidenceProps {
  markets: MarketNetResult[];
}

export const VisualEvidence: React.FC<VisualEvidenceProps> = ({ markets }) => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            VISUAL DECISION EVIDENCE
          </span>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
            Headline Price vs. True Net Realisation
          </h3>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-slate-200" />
            <span>Quoted Gross Headline Value</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-forest-800" />
            <span>Actual Net Realisation (Take-Home)</span>
          </div>
        </div>
      </div>

      {/* Bar Comparison Stacks for each market */}
      <div className="space-y-4 pt-2">
        {markets.map((m) => {
          const b = m.breakdown;
          const isRank1 = m.rank === 1;

          return (
            <div key={m.marketId} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-900">
                  {m.marketName} (Rank #{m.rank}) {isRank1 && '🏆'}
                </span>
                <span className="text-slate-500 font-medium text-[11px]">
                  Gross: ₹{b.grossRevenue.toLocaleString('en-IN')} |{' '}
                  <strong className="text-slate-900 font-bold">
                    Net: ₹{b.netRealisation.toLocaleString('en-IN')}
                  </strong>
                </span>
              </div>

              {/* Progress Bar with Retention % Overlay */}
              <div className="relative w-full h-7 bg-slate-100 rounded-xl overflow-hidden flex">
                <div
                  style={{ width: `${b.retentionPercent}%` }}
                  className={`h-full rounded-xl flex items-center justify-end pr-3 transition-all duration-500 ${
                    isRank1
                      ? 'bg-forest-800 text-emerald-200'
                      : 'bg-emerald-700/80 text-emerald-100'
                  }`}
                >
                  <span className="text-[11px] font-black">{b.retentionPercent}% Realised</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Key Mandi Takeaway Box from screenshot */}
      <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5">
        <span className="text-base mt-0.5">🔑</span>
        <p className="text-[11px] leading-relaxed">
          <strong className="font-bold text-slate-900">Key Mandi Takeaway:</strong> Chasing an extra ₹1.50 headline rate in a mandi 50+ km further away frequently erodes net earnings due to high round-trip LCV freight and ware spoilage. <strong>{markets[0]?.marketName || 'Nearby Mandi'}</strong> remains your highest profit destination today.
        </p>
      </div>
    </div>
  );
};
