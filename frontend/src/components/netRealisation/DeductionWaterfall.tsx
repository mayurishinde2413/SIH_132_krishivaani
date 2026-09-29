import React from 'react';
import { ShieldCheck, Truck, Percent, AlertOctagon, Scale, ArrowDown } from 'lucide-react';
import { MarketNetResult } from '../../types/netRealisation';

interface DeductionWaterfallProps {
  market: MarketNetResult;
  cropName: string;
  quantityKg: number;
}

export const DeductionWaterfall: React.FC<DeductionWaterfallProps> = ({
  market,
  cropName,
  quantityKg,
}) => {
  const b = market.breakdown;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left 7 Cols: Auditable Ledger Waterfall */}
      <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              AUDITABLE LEDGER
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
              Transparent Deduction Waterfall: {market.marketName}
            </h3>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">
            Consignment: {quantityKg.toLocaleString('en-IN')} kg @ ₹{market.quotedPricePerKg.toFixed(2)}/kg
          </span>
        </div>

        {/* Waterfall Ledger Steps */}
        <div className="space-y-2.5 text-xs font-semibold">
          {/* Gross Benchmark */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-md bg-forest-800 text-white flex items-center justify-center font-bold text-[10px]">
                +
              </span>
              <div>
                <span className="font-extrabold text-slate-900 text-sm">Gross Mandi Benchmark Revenue</span>
                <span className="text-[11px] text-slate-400 block font-normal">
                  Headline auction rate × Total delivered weight
                </span>
              </div>
            </div>
            <span className="text-base font-black text-slate-900">
              ₹{b.grossRevenue.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Transport & Freight */}
          <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-md bg-rose-600 text-white flex items-center justify-center font-bold text-[10px]">
                -
              </span>
              <div>
                <span className="font-bold text-slate-800">Transport & Freight Fee</span>
                <span className="text-[11px] text-slate-500 block font-normal">
                  {market.distanceKm} km short-haul diesel + dedicated vehicle round-trip rate
                </span>
              </div>
            </div>
            <span className="text-sm font-black text-rose-700">
              -₹{b.transportCost.toLocaleString('en-IN')}
            </span>
          </div>

          {/* APMC Mandi Regulation Cess */}
          <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-md bg-rose-600 text-white flex items-center justify-center font-bold text-[10px]">
                -
              </span>
              <div>
                <span className="font-bold text-slate-800">APMC Mandi Regulation Cess (0.5%)</span>
                <span className="text-[11px] text-slate-500 block font-normal">
                  Statutory seller registration & market sanitation fee
                </span>
              </div>
            </div>
            <span className="text-sm font-black text-rose-700">
              -₹{b.mandiFees.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Estimated Perishable Spoilage */}
          <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-md bg-rose-600 text-white flex items-center justify-center font-bold text-[10px]">
                -
              </span>
              <div>
                <span className="font-bold text-slate-800">Estimated Perishable Transit Spoilage</span>
                <span className="text-[11px] text-slate-500 block font-normal">
                  Transit vibration & heat loss over {market.distanceKm} km distance window
                </span>
              </div>
            </div>
            <span className="text-sm font-black text-rose-700">
              -₹{b.expectedWastage.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Quality / Grade Refinement */}
          <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-md bg-rose-600 text-white flex items-center justify-center font-bold text-[10px]">
                -
              </span>
              <div>
                <span className="font-bold text-slate-800">Sorting & FAQ Standard Refinement</span>
                <span className="text-[11px] text-slate-500 block font-normal">
                  Post-auction refiltration for Grade-A premium
                </span>
              </div>
            </div>
            <span className="text-sm font-black text-rose-700">
              -₹{b.qualityDeductions.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Unloading & Porterage */}
          <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-md bg-rose-600 text-white flex items-center justify-center font-bold text-[10px]">
                -
              </span>
              <div>
                <span className="font-bold text-slate-800">Unloading & Porterage</span>
                <span className="text-[11px] text-slate-500 block font-normal">
                  Standard registered buyer unloader charge
                </span>
              </div>
            </div>
            <span className="text-sm font-black text-rose-700">
              -₹{b.unloadingPorterage.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Farmer Take-Home Payout Box */}
        <div className="p-5 rounded-2xl bg-forest-900 text-white flex items-center justify-between shadow-md">
          <div>
            <span className="text-xs text-emerald-300 font-extrabold uppercase tracking-wider block">
              FARMER TAKE-HOME BALANCE
            </span>
            <span className="text-sm text-slate-300">Expected Net Realisation</span>
          </div>

          <div className="text-right">
            <span className="text-3xl font-black text-white block leading-tight">
              ₹{b.netRealisation.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-bold text-emerald-300">
              ₹{b.netRealisationPerKg} per net kg
            </span>
          </div>
        </div>

        {/* Calculation protocol pill */}
        <div className="p-3 rounded-xl bg-slate-50 text-[10px] text-slate-500 flex items-center justify-between">
          <span>
            <strong>CALCULATION PROTOCOL:</strong> Net Realisation = Gross Revenue - Freight - Mandi Cess - Perishable Loss - Quality Cut
          </span>
        </div>
      </div>

      {/* Right 5 Cols: Why Market Wins & Visual Evidence */}
      <div className="lg:col-span-5 space-y-4">
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <span className="text-emerald-700 text-lg">💡</span>
            <h4 className="font-extrabold text-slate-900 text-sm">
              Why {market.marketName} Strategy Wins
            </h4>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {market.marketName} secures superior dividend because spatial proximity preserves harvest moisture and drastically scales down freight drag.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-2 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block">Benchmark Rate Stability:</strong>
                <span className="text-slate-500 text-[11px]">
                  Strong daily institutional buyer turnout supports ₹{market.quotedPricePerKg.toFixed(2)}/kg without sudden midday auction dips.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2 text-xs">
              <Truck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block">Minimum Transit Exposure:</strong>
                <span className="text-slate-500 text-[11px]">
                  Only {market.distanceKm} km transit protects delicate produce skin from transit heat and mechanical damage.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2 text-xs">
              <Percent className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block">Standard Statutory Cess:</strong>
                <span className="text-slate-500 text-[11px]">
                  Zero arbitrary off-book charges; e-NAM audited invoice receipt guaranteed.
                </span>
              </div>
            </div>
          </div>

          {/* Disclaimer on variances */}
          <div className="mt-4 p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-[10px] text-amber-900 leading-normal">
            <strong>Disclaimer on Variance:</strong> Net calculations utilize current median cess rates and published regional freight scales. Final disbursement depends on physical weighbridge and crate grading upon entry.
          </div>
        </div>

        {/* Highway transit route card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              🛣️
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Direct Transit Route</span>
              <span className="text-[10px] text-slate-500">Via SH-10 • Dedicated cargo quick-lane</span>
            </div>
          </div>
          <span className="text-xs font-extrabold text-forest-800 bg-forest-50 px-2.5 py-1 rounded-lg">
            {market.transitTimeEst}
          </span>
        </div>
      </div>
    </div>
  );
};
