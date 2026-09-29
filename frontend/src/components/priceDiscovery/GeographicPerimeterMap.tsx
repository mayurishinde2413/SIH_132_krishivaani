import React from 'react';
import { Radio } from 'lucide-react';

interface PerimeterMapProps {
  radiusKm: number;
  originName?: string;
  markets: Array<{
    name: string;
    distanceKm: number;
    price?: number;
  }>;
}

export const GeographicPerimeterMap: React.FC<PerimeterMapProps> = ({
  radiusKm,
  originName = 'Baramati',
  markets,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
            Geographic Market Perimeter ({radiusKm} km)
          </h4>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold flex items-center gap-1">
          <Radio className="w-3 h-3" /> Live Radar
        </span>
      </div>

      <p className="text-[11px] text-slate-500">
        {originName} Rural APMC Catchment & Trade Corridors
      </p>

      {/* Stylized Radar Vector Canvas */}
      <div className="relative h-48 sm:h-56 bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center p-4 border border-slate-800 shadow-inner">
        {/* Concentric Radar Rings */}
        <div className="absolute w-44 h-44 rounded-full border border-dashed border-emerald-500/20" />
        <div className="absolute w-32 h-32 rounded-full border border-dashed border-emerald-500/30" />
        <div className="absolute w-20 h-20 rounded-full border border-dashed border-emerald-500/40" />

        {/* Center Farmer Origin Marker */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-xs ring-4 ring-emerald-500/30 shadow-lg">
            🌾
          </div>
          <span className="mt-1 px-2 py-0.5 rounded bg-slate-950/80 text-white text-[9px] font-bold border border-emerald-500/40">
            Farmer ({originName})
          </span>
        </div>

        {/* Dynamic Nearby Market Nodes positioned relative to radius */}
        <div className="absolute top-6 left-8 z-10">
          <div className="flex items-center gap-1 bg-slate-950/90 text-emerald-300 px-2 py-1 rounded-lg border border-slate-700 text-[9px] font-bold shadow">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Pune APMC: ₹28</span>
          </div>
        </div>

        <div className="absolute top-10 right-8 z-10">
          <div className="flex items-center gap-1 bg-slate-950/90 text-emerald-300 px-2 py-1 rounded-lg border border-slate-700 text-[9px] font-bold shadow">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Nashik: ₹27</span>
          </div>
        </div>

        <div className="absolute bottom-6 right-12 z-10">
          <div className="flex items-center gap-1 bg-slate-950/90 text-emerald-300 px-2 py-1 rounded-lg border border-slate-700 text-[9px] font-bold shadow">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Solapur: ₹25</span>
          </div>
        </div>

        {/* Radius perimeter badge */}
        <div className="absolute top-2 right-2 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
          {radiusKm} KM PERIMETER LIMIT
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Origin Point</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-300" />
          <span>Mandi Yard</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 bg-dashed bg-emerald-500/50" />
          <span>Direct Highway Corridors</span>
        </div>
      </div>
    </div>
  );
};
