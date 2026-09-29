import React from 'react';
import { ArrowRight, RotateCcw, MapPin, CheckCircle, Sparkles } from 'lucide-react';
import { getCropIcon } from '../../utils/cropIcon';

interface ProduceInputProps {
  crops: Array<{ id: number; name: string; localName: string | null }>;
  crop: string;
  setCrop: (c: string) => void;
  quantityQuintals: number;
  setQuantityQuintals: (q: number) => void;
  grade: string;
  setGrade: (g: string) => void;
  availableFrom: string;
  setAvailableFrom: (d: string) => void;
  originLocation: string;
  onFindMatches: () => void;
  onReset: () => void;
  isLoading: boolean;
}

export const ProduceInputForm: React.FC<ProduceInputProps> = ({
  crops,
  crop,
  setCrop,
  quantityQuintals,
  setQuantityQuintals,
  grade,
  setGrade,
  availableFrom,
  setAvailableFrom,
  originLocation,
  onFindMatches,
  onReset,
  isLoading,
}) => {
  const grades = [
    'Grade A (Firm Red, >45mm)',
    'Grade A+ (Premium Export)',
    'Grade B (Processing Standard)',
  ];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-forest-800 text-white flex items-center justify-center text-xs font-black">
            1
          </span>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
            Specify Your Available Produce
          </h2>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Live Farmer Draft</span>
        </div>
      </div>

      <p className="text-xs text-slate-500">
        Update crop parameters to recalculate instant institutional buyer matches in your region.
      </p>

      {/* Grid of 5 parameters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs font-semibold">
        {/* Crop Variety */}
        <div>
          <label className="text-slate-500 uppercase tracking-wider block mb-1 text-[11px]">
            Crop Variety
          </label>
          <select
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-forest-600/20"
          >
            {crops.map((c) => (
              <option key={c.id} value={c.name}>
                {getCropIcon(c.name)} {c.name} {c.localName ? `(${c.localName})` : ''}
              </option>
            ))}
          </select>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Standard FAQ sorting applied</span>
        </div>

        {/* Quantity (Quintals) */}
        <div>
          <label className="text-slate-500 uppercase tracking-wider block mb-1 text-[11px]">
            Quantity (Quintals)
          </label>
          <div className="relative">
            <input
              type="number"
              min={1}
              value={quantityQuintals}
              onChange={(e) => setQuantityQuintals(Math.max(1, parseFloat(e.target.value) || 0))}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-forest-600/20"
            />
            <span className="absolute right-3 top-2 text-slate-400 text-[10px] font-bold">
              {(quantityQuintals * 100).toLocaleString('en-IN')} kg
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Min. wholesale volume: 5 Q</span>
        </div>

        {/* Quality / Grade */}
        <div>
          <label className="text-slate-500 uppercase tracking-wider block mb-1 text-[11px]">
            Quality / Grade
          </label>
          <select
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-forest-600/20"
          >
            {grades.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          <span className="text-[10px] text-slate-400 mt-0.5 block">★ Premium export acceptable</span>
        </div>

        {/* Available From */}
        <div>
          <label className="text-slate-500 uppercase tracking-wider block mb-1 text-[11px]">
            Available From
          </label>
          <input
            type="text"
            value={availableFrom}
            onChange={(e) => setAvailableFrom(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-forest-600/20"
          />
          <span className="text-[10px] text-slate-400 mt-0.5 block">Morning pluck window: 6–9 AM</span>
        </div>

        {/* Origin Location */}
        <div>
          <label className="text-slate-500 uppercase tracking-wider block mb-1 text-[11px]">
            Origin Location
          </label>
          <div className="flex items-center justify-between px-3 py-2 rounded-xl border border-slate-200 bg-slate-50">
            <span className="text-xs font-bold text-slate-800 truncate">{originLocation}</span>
            <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0">
              📍 Locked
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">GPS Locked via FPO Node</span>
        </div>
      </div>

      {/* Button Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>All offers backed by Irrevocable Agri-Escrow funds prior to farmer dispatch.</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onReset}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold text-xs transition-colors"
          >
            Reset Fields
          </button>

          <button
            type="button"
            onClick={onFindMatches}
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 disabled:opacity-50 text-white font-black text-xs transition-all shadow-md shadow-forest-950/10 flex items-center justify-center gap-2"
          >
            <span>{isLoading ? 'Scanning Buyers...' : 'Find Matching Buyers'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
