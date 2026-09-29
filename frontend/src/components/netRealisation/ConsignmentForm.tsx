import React from 'react';
import { Sparkles, Calculator, RotateCcw, MapPin, Calendar, CheckCircle } from 'lucide-react';
import { getCropIcon } from '../../utils/cropIcon';

interface ConsignmentFormProps {
  crops: Array<{ id: number; name: string; localName: string | null }>;
  commodity: string;
  setCommodity: (val: string) => void;
  quantity: number;
  setQuantity: (val: number) => void;
  unit: 'kg' | 'quintal';
  setUnit: (val: 'kg' | 'quintal') => void;
  grade: string;
  setGrade: (val: string) => void;
  harvestDate: string;
  setHarvestDate: (val: string) => void;
  farmerLocation: string;
  onCalculate: () => void;
  onReset: () => void;
  isLoading: boolean;
}

export const ConsignmentForm: React.FC<ConsignmentFormProps> = ({
  crops,
  commodity,
  setCommodity,
  quantity,
  setQuantity,
  unit,
  setUnit,
  grade,
  setGrade,
  harvestDate,
  setHarvestDate,
  farmerLocation,
  onCalculate,
  onReset,
  isLoading,
}) => {
  const grades = [
    'Grade A (FAQ Standard)',
    'Grade B (Fair Average)',
    'Grade C (Under-sized / Blemished)',
  ];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
      {/* Form Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-forest-800 text-white flex items-center justify-center text-xs font-black">
            1
          </span>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
            Specify Consignment Parameters
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-emerald-800 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Instant sensitivity recalibration enabled</span>
        </div>
      </div>

      {/* Grid Inputs matching screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs font-semibold">
        {/* Commodity Select */}
        <div>
          <label className="text-slate-500 uppercase tracking-wider block mb-1.5 text-[11px]">
            Commodity
          </label>
          <select
            value={commodity}
            onChange={(e) => setCommodity(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-600"
          >
            {crops.map((c) => (
              <option key={c.id} value={c.name}>
                {getCropIcon(c.name)} {c.name} {c.localName ? `(${c.localName})` : ''}
              </option>
            ))}
          </select>
          <span className="text-[10px] text-slate-400 mt-1 block">HS Code: 0702.00.00</span>
        </div>

        {/* Quantity with kg/quintal toggle */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-slate-500 uppercase tracking-wider text-[11px]">Quantity</label>
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-[10px]">
              <button
                type="button"
                onClick={() => setUnit('kg')}
                className={`px-1.5 py-0.5 rounded font-bold transition-all ${
                  unit === 'kg' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                }`}
              >
                kg
              </button>
              <button
                type="button"
                onClick={() => setUnit('quintal')}
                className={`px-1.5 py-0.5 rounded font-bold transition-all ${
                  unit === 'quintal' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                }`}
              >
                Quintal
              </button>
            </div>
          </div>
          <div className="relative">
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseFloat(e.target.value) || 0))}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-600"
            />
            <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold uppercase">
              {unit}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Net: {unit === 'kg' ? `${(quantity / 100).toFixed(1)} Quintals` : `${quantity * 100} kg`}
          </span>
        </div>

        {/* Quality / Grade */}
        <div>
          <label className="text-slate-500 uppercase tracking-wider block mb-1.5 text-[11px]">
            Quality / Grade
          </label>
          <select
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-600"
          >
            {grades.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          <span className="text-[10px] text-slate-400 mt-1 block">FAQ Baseline 0% Tolerance cut</span>
        </div>

        {/* Farmer Location */}
        <div>
          <label className="text-slate-500 uppercase tracking-wider block mb-1.5 text-[11px]">
            Farmer Location
          </label>
          <div className="flex items-center justify-between px-3 py-2 rounded-xl border border-slate-200 bg-slate-50">
            <span className="text-xs font-bold text-slate-800 truncate">{farmerLocation}</span>
            <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0">
              GPS Locked
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Lat: 18.5204° N, 74.5815° E</span>
        </div>

        {/* Harvest / Dispatch Date */}
        <div>
          <label className="text-slate-500 uppercase tracking-wider block mb-1.5 text-[11px]">
            Harvest / Dispatch
          </label>
          <input
            type="date"
            value={harvestDate}
            onChange={(e) => setHarvestDate(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-600"
          />
          <span className="text-[10px] text-slate-400 mt-1 block">Morning Dispatch (06:00 AM)</span>
        </div>
      </div>

      {/* Action Buttons & Feedback row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCalculate}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 disabled:opacity-50 text-white font-extrabold text-xs shadow-md shadow-forest-950/10 transition-all"
          >
            <Calculator className="w-4 h-4" />
            <span>{isLoading ? 'Recalculating...' : 'Calculate Net Realisation'}</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold text-xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-500 flex items-center gap-1">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span>Recalculated in 0.4s • AGMARKNET API & FastFreight Multimodal verified</span>
        </div>
      </div>
    </div>
  );
};
