import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

interface RadiusSelectorProps {
  selectedRadius: number;
  onSelectRadius: (radius: number) => void;
  cropName?: string;
  marketCount?: number;
  originLocation?: string;
}

export const RadiusSelector: React.FC<RadiusSelectorProps> = ({
  selectedRadius,
  onSelectRadius,
  cropName,
  marketCount = 0,
  originLocation = 'Baramati, Pune (MH)',
}) => {
  const radiusOptions = [10, 25, 50, 100];

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Active Crop & Benchmark summary */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-forest-100 border border-forest-200 flex items-center justify-center text-forest-800 shrink-0">
          <Navigation className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900">
              {cropName ? `${cropName} Selected` : 'Select a crop above'}
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full">
              ACTIVE BENCHMARK
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Displaying {marketCount} verified APMC mandis within {selectedRadius} km radius of {originLocation}
          </p>
        </div>
      </div>

      {/* Radius Switcher & GPS Status */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <span className="text-xs font-semibold text-slate-500 px-2">Radius:</span>
          {radiusOptions.map((r) => {
            const isActive = selectedRadius === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => onSelectRadius(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-forest-800 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {r} km {r === 50 ? '(Default)' : ''}
              </button>
            );
          })}
        </div>

        {/* GPS Locked pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>GPS Locked</span>
        </div>
      </div>
    </div>
  );
};
