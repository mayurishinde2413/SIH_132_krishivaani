import React from 'react';
import { TrendingUp, CloudRain, ShieldAlert, Warehouse, Users } from 'lucide-react';
import { CurrentSituationData } from '../../types/sellWait';

interface CurrentSituationBannerProps {
  situation: CurrentSituationData;
}

export const CurrentSituationBanner: React.FC<CurrentSituationBannerProps> = ({ situation }) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-forest-800 text-white flex items-center justify-center text-xs font-black">
            2
          </span>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
            Current Situation
          </h3>
        </div>
        <span className="text-[11px] font-bold text-slate-400">At a Glance</span>
      </div>

      {/* 6 Metric Badges matching screenshot */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
        {/* Current Price */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">
            🏷️ Current Price
          </span>
          <span className="text-base font-black text-slate-900 block">
            {situation.currentPrice}
          </span>
        </div>

        {/* Price Trend */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
          <span className="text-emerald-800 text-[10px] font-bold uppercase tracking-wider block">
            📈 Price Trend
          </span>
          <span className="text-xs font-black text-emerald-900 block">
            {situation.priceTrend}
          </span>
        </div>

        {/* Weather */}
        <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-1">
          <span className="text-blue-800 text-[10px] font-bold uppercase tracking-wider block">
            🌧️ Weather
          </span>
          <span className="text-xs font-black text-blue-900 block">
            {situation.weather}
          </span>
        </div>

        {/* Perishability */}
        <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-1">
          <span className="text-rose-800 text-[10px] font-bold uppercase tracking-wider block">
            ⚠️ Perishability
          </span>
          <span className="text-xs font-black text-rose-900 block">
            {situation.perishability}
          </span>
        </div>

        {/* Storage */}
        <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-1">
          <span className="text-amber-800 text-[10px] font-bold uppercase tracking-wider block">
            📦 Storage
          </span>
          <span className="text-xs font-black text-amber-900 block">
            {situation.storage}
          </span>
        </div>

        {/* Mandi Inflow */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
          <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block">
            🚜 Mandi Inflow
          </span>
          <span className="text-xs font-black text-slate-900 block">
            {situation.mandiInflow}
          </span>
        </div>
      </div>
    </div>
  );
};
