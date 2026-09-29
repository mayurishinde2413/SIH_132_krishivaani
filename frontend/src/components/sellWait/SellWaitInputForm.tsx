import React from 'react';
import { ArrowRight, MapPin, CheckCircle, RefreshCw } from 'lucide-react';
import { getCropIcon } from '../../utils/cropIcon';

interface SellWaitInputFormProps {
  crops: Array<{ id: number; name: string; localName: string | null }>;
  crop: string;
  setCrop: (c: string) => void;
  quantityQuintals: number;
  setQuantityQuintals: (q: number) => void;
  currentMarketPrice: number;
  setCurrentMarketPrice: (p: number) => void;
  hasStorage: boolean;
  setHasStorage: (s: boolean) => void;
  farmerLocation: string;
  onCheckOptions: () => void;
  isLoading: boolean;
}

export const SellWaitInputForm: React.FC<SellWaitInputFormProps> = ({
  crops,
  crop,
  setCrop,
  quantityQuintals,
  setQuantityQuintals,
  currentMarketPrice,
  setCurrentMarketPrice,
  hasStorage,
  setHasStorage,
  farmerLocation,
  onCheckOptions,
  isLoading,
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-forest-800 text-white flex items-center justify-center text-xs font-black">
            1
          </span>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
            What are you planning to sell?
          </h2>
        </div>
        <span className="text-[11px] font-bold text-slate-400">Step 1 of 3</span>
      </div>

      {/* Grid of 5 parameters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs font-semibold">
        {/* Crop Select */}
        <div>
          <label className="text-slate-500 uppercase tracking-wider block mb-1 text-[11px]">
            Select Crop
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
          <span className="text-[10px] text-slate-400 mt-0.5 block">Tomato (Hybrid) Selected</span>
        </div>

        {/* Quantity in Quintals */}
        <div>
          <label className="text-slate-500 uppercase tracking-wider block mb-1 text-[11px]">
            Quantity
          </label>
          <div className="relative">
            <input
              type="number"
              min={1}
              value={quantityQuintals}
              onChange={(e) => setQuantityQuintals(Math.max(1, parseFloat(e.target.value) || 0))}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-forest-600/20"
            />
            <span className="absolute right-3 top-2 text-slate-400 text-[11px] font-bold">
              Quintals
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            ({(quantityQuintals * 100).toLocaleString('en-IN')} kg)
          </span>
        </div>

        {/* Current Market Price */}
        <div>
          <label className="text-slate-500 uppercase tracking-wider block mb-1 text-[11px]">
            Current Market Price
          </label>
          <div className="relative">
            <input
              type="number"
              value={currentMarketPrice}
              onChange={(e) => setCurrentMarketPrice(parseFloat(e.target.value) || 0)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-forest-600/20"
            />
            <span className="absolute right-3 top-2 text-slate-400 text-[10px] font-bold">
              / Quintal
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Baramati APMC Yard</span>
        </div>

        {/* Farmer Location */}
        <div>
          <label className="text-slate-500 uppercase tracking-wider block mb-1 text-[11px]">
            Your Location
          </label>
          <div className="flex items-center justify-between px-3 py-2 rounded-xl border border-slate-200 bg-slate-50">
            <span className="text-xs font-bold text-slate-800 truncate">{farmerLocation}</span>
            <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0">
              📍 Locked
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Baramati, Pune | MH</span>
        </div>

        {/* Storage Available */}
        <div>
          <label className="text-slate-500 uppercase tracking-wider block mb-1 text-[11px]">
            Storage Available?
          </label>
          <div
            onClick={() => setHasStorage(!hasStorage)}
            className={`flex items-center justify-between px-3 py-2 rounded-xl border cursor-pointer transition-colors ${
              hasStorage
                ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <span className="text-xs font-bold">
              {hasStorage ? '✓ Yes (Cold/Ambient CA)' : '✗ No Cold Storage'}
            </span>
            <span className="text-[10px] font-bold text-forest-800 underline">Change</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">₹80/Q for 5-day cycle</span>
        </div>
      </div>

      {/* Button and feedback info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Real-time prices and weather forecast loaded for Baramati cluster.</span>
        </div>

        <button
          type="button"
          onClick={onCheckOptions}
          disabled={isLoading}
          className="px-6 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 disabled:opacity-50 text-white font-black text-xs transition-all shadow-md shadow-forest-950/10 flex items-center justify-center gap-2 self-start sm:self-center"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing Market Factors...</span>
            </>
          ) : (
            <>
              <span>Check Options</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
