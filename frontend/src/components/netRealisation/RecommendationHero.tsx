import React from 'react';
import { Trophy, TrendingUp, CheckCircle, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { MarketNetResult } from '../../types/netRealisation';

interface RecommendationHeroProps {
  recommended: MarketNetResult;
  onSelectMandi: (m: MarketNetResult) => void;
  onViewWaterfall: () => void;
}

export const RecommendationHero: React.FC<RecommendationHeroProps> = ({
  recommended,
  onSelectMandi,
  onViewWaterfall,
}) => {
  const b = recommended.breakdown;

  return (
    <div className="bg-white rounded-3xl p-6 border-2 border-emerald-500 shadow-lg shadow-emerald-950/5 relative overflow-hidden flex flex-col justify-between space-y-5">
      {/* Top Banner & Rank */}
      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700 text-white text-[11px] font-black uppercase tracking-wider shadow-sm">
            <Trophy className="w-3.5 h-3.5" />
            <span>RECOMMENDED (RANK #1)</span>
          </div>

          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold border border-emerald-300">
            ★ Highest Net Realisation
          </span>
        </div>

        {/* Mandi Title & Distance */}
        <div className="mt-3">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
            <MapPin className="w-5 h-5 text-emerald-600" />
            {recommended.marketName}
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {recommended.district} APMC Yard • {recommended.distanceKm} km away ({recommended.transitTimeEst})
          </p>
        </div>

        {/* Expected Net Take-Home Highlight Card */}
        <div className="mt-4 p-5 rounded-2xl bg-forest-900 text-white relative overflow-hidden shadow-inner">
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-300 font-bold uppercase tracking-wider">
              EXPECTED NET REALISATION
            </span>
            <span className="text-[10px] font-extrabold bg-emerald-800/80 px-2 py-0.5 rounded-full text-emerald-100">
              Take-home payout
            </span>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              ₹{b.netRealisation.toLocaleString('en-IN')}
            </span>
            <span className="text-sm font-bold text-emerald-200">
              (Net ₹{b.netRealisationPerKg}/kg)
            </span>
          </div>

          <div className="mt-3 pt-3 border-t border-emerald-800/60 flex items-center justify-between text-[11px] text-emerald-200">
            <span>Retains {b.retentionPercent}% of gross headline value</span>
            <span className="font-bold text-white">
              -₹{(b.grossRevenue - b.netRealisation).toLocaleString('en-IN')} Total Deductions
            </span>
          </div>
        </div>

        {/* 4 Mini Breakdown Metrics Grid */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] text-slate-400 font-medium block">Market Quoted Price</span>
            <span className="font-extrabold text-slate-900 block mt-0.5">
              ₹{recommended.quotedPricePerKg.toFixed(2)}/kg
            </span>
            <span className="text-[9px] text-slate-400">Gross: ₹{b.grossRevenue.toLocaleString('en-IN')}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] text-slate-400 font-medium block">Est. Transport Cost</span>
            <span className="font-extrabold text-rose-600 block mt-0.5">
              -₹{b.transportCost.toLocaleString('en-IN')}
            </span>
            <span className="text-[9px] text-slate-400">{recommended.distanceKm} km haul</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] text-slate-400 font-medium block">Mandi Cess & Fees</span>
            <span className="font-extrabold text-rose-600 block mt-0.5">
              -₹{b.mandiFees.toLocaleString('en-IN')}
            </span>
            <span className="text-[9px] text-slate-400">0.5% statutory fees</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] text-slate-400 font-medium block">Perishable Transit Loss</span>
            <span className="font-extrabold text-rose-600 block mt-0.5">
              -₹{b.expectedWastage.toLocaleString('en-IN')}
            </span>
            <span className="text-[9px] text-slate-400">Low transit stress</span>
          </div>
        </div>

        {/* Why Rank #1 Wins Reason callout */}
        <div className="mt-4 p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
          <span className="text-emerald-700 mt-0.5 font-bold">💡</span>
          <p className="text-[11px] leading-relaxed">
            <strong className="font-bold">Why Rank #1?</strong> {recommended.keyReason}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onViewWaterfall}
          className="text-xs font-bold text-forest-800 hover:text-forest-900 hover:underline flex items-center gap-1"
        >
          <span>View Full Deduction Waterfall</span>
          <span>↓</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectMandi(recommended)}
          className="px-5 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-extrabold text-xs shadow-md shadow-forest-950/20 transition-all flex items-center gap-1.5"
        >
          <span>SELECT MANDI</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
