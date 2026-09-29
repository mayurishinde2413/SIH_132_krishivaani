import React from 'react';
import {
  CloudRain,
  TrendingUp,
  AlertTriangle,
  Warehouse,
  Truck,
  Flame,
  CheckCircle2,
  PhoneCall,
  Share2,
  ArrowRight,
} from 'lucide-react';
import { DecisionSupportData } from '../../types/sellWait';
import { useNavigate } from 'react-router-dom';
import { getCropIcon } from '../../utils/cropIcon';

interface DecisionSupportPanelProps {
  decision: DecisionSupportData;
  onGoToBestMarket: () => void;
}

export const DecisionSupportPanel: React.FC<DecisionSupportPanelProps> = ({
  decision,
  onGoToBestMarket,
}) => {
  return (
    <div className="space-y-6">
      {/* ── Section 5: What Can Affect Your Decision? ─────────────────────────── */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-forest-800 text-white flex items-center justify-center text-xs font-black">
              5
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
              What Can Affect Your Decision?
            </h3>
          </div>
          <span className="text-[11px] font-bold text-slate-400">Key Local Factors</span>
        </div>

        {/* 6 Factor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="font-extrabold text-slate-900 block flex items-center gap-1.5">
              <span>🌦️</span> Weather
            </span>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Rain or excessive heat can damage standing or harvested crop and disrupt road transport to mandis.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="font-extrabold text-slate-900 block flex items-center gap-1.5">
              <span>📈</span> Price Trend
            </span>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Recent price movement gives a signal of short-term market momentum across Baramati & Pune.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="font-extrabold text-slate-900 block flex items-center gap-1.5">
              <span>🌱</span> Crop Perishability
            </span>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Perishable crops like tomato have limited shelf-life (3–4 days) and high risk of crate rotting.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="font-extrabold text-slate-900 block flex items-center gap-1.5">
              <span>📦</span> Storage Facility
            </span>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Having cold storage gives you flexibility to wait, but adds daily rental and crate loading cost.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="font-extrabold text-slate-900 block flex items-center gap-1.5">
              <span>🚜</span> Market Arrivals
            </span>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Bumper arrivals from nearby Nashik & Junnar often push local spot prices downward unexpectedly.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="font-extrabold text-slate-900 block flex items-center gap-1.5">
              <span>🤝</span> Buyer Demand
            </span>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Higher wholesale demand during festivals or bulk factory processing orders can lift future prices.
            </p>
          </div>
        </div>

        {/* 4 Mini Widgets Bar (Price Movement, Weather Forecast, Cold Storage, Perishability Benchmark) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Price Movement (7D)</span>
            <div className="my-2">
              <span className="text-lg font-black text-slate-900">₹2,800/Q</span>
              <span className="text-[10px] font-bold text-emerald-700 ml-1.5">▲ +4.5%</span>
            </div>
            <span className="text-[10px] text-slate-400">5 Days Ago: ₹2,650 → Today: ₹2,800</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-blue-900 font-bold uppercase">Weather Forecast</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">Medium Risk</span>
            </div>
            <div className="my-2">
              <span className="text-sm font-black text-blue-950 block">Rain in 48 hrs</span>
              <span className="text-[10px] text-blue-700">Heavy downpours expected</span>
            </div>
            <span className="text-[10px] text-slate-500">Transit routes to Pune may face delays.</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-emerald-900 font-bold uppercase">Cold Storage Facility</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-900">Available</span>
            </div>
            <div className="my-2">
              <span className="text-sm font-black text-emerald-950 block">Baramati Agro Hub</span>
              <span className="text-xs font-bold text-forest-900">₹80 / Quintal</span>
            </div>
            <span className="text-[10px] text-slate-500">5 days for 50Q = ₹4,000 extra cost.</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Perishability Benchmark</span>
            <div className="space-y-1 my-1 text-[11px]">
              <div className="flex justify-between">
                <span>🍅 Tomato</span>
                <span className="font-bold text-rose-600">High (2–4 days)</span>
              </div>
              <div className="flex justify-between">
                <span>🧅 Onion</span>
                <span className="font-bold text-amber-600">Medium (2–3 mos)</span>
              </div>
              <div className="flex justify-between">
                <span>🌾 Wheat</span>
                <span className="font-bold text-emerald-600">Low (12+ mos)</span>
              </div>
            </div>
            <span className="text-[9px] text-slate-400">Tomatoes lose quality if held ambiently.</span>
          </div>
        </div>
      </div>

      {/* ── Section 6: Your Selling-Time Analysis & Decision Support Summary ──── */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎯</span>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
              Your Selling-Time Analysis
            </h3>
          </div>
          <span className="text-[11px] font-bold text-forest-800 bg-forest-50 px-3 py-1 rounded-full border border-forest-200">
            Decision-Support Summary
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 8 cols: Estimation Suggestion Callout */}
          <div className="lg:col-span-8 space-y-4">
            <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-300 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">
                ESTIMATED SUGGESTION
              </span>
              <h4 className="text-xl font-black text-emerald-950">
                {decision.suggestion}
              </h4>
              <p className="text-xs text-emerald-900 leading-relaxed font-medium">
                {decision.summary}
              </p>
            </div>

            {/* 4 Checkpoint bullet tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-semibold">
              {decision.keyPoints.map((pt, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>

            {/* When to consider waiting footnote */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
              <span className="text-forest-700 font-bold mt-0.5">💡</span>
              <p className="text-[11px] leading-relaxed">
                <strong className="text-slate-900 font-bold">When to consider waiting:</strong> {decision.whenToWait}
              </p>
            </div>
          </div>

          {/* Right 4 cols: Recommended Next Action Buttons */}
          <div className="lg:col-span-4 bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
                RECOMMENDED NEXT ACTION
              </span>

              <button
                type="button"
                onClick={onGoToBestMarket}
                className="w-full py-3.5 px-4 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-black text-xs transition-all shadow-md shadow-forest-950/20 flex items-center justify-center gap-2 mb-3"
              >
                <span>Go to Module 02: Best Market</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => alert('Dialing Baramati APMC Yard Master... (Toll-Free 1800-180-1551)')}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-forest-700" />
                  <span>Call Baramati APMC Yard Master</span>
                </span>
                <span className="text-[10px] text-slate-400 font-normal">Direct</span>
              </button>

              <button
                type="button"
                onClick={() => alert('Summary link copied for WhatsApp sharing with FPO members.')}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-forest-700" />
                  <span>Share Summary with FPO Members</span>
                </span>
                <span className="text-[10px] text-slate-400 font-normal">WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
