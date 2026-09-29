import React from 'react';
import { Building2, Snowflake, ExternalLink, ArrowRight, ShieldAlert, Compass } from 'lucide-react';

export interface RescueMarket {
  id: number;
  name: string;
  distanceKm: number;
  transitTime: string;
  modalPrice: number;
  unit: string;
  arrivalCapacity: string;
  activeTraders: number;
  corridorStatus: string;
  status: string;
  isRecommended: boolean;
  streamUrl?: string;
}

export interface RescueStorage {
  id: number;
  facilityName: string;
  location: string;
  availableCapacity: string;
  rate: string;
  maxDuration: string;
  humidityControl?: string;
  actionLabel: string;
}

interface YardRerouteAndStorageProps {
  market: RescueMarket;
  storage: RescueStorage;
  onViewMandiStream: (market: RescueMarket) => void;
  onPrebookStorage: (storage: RescueStorage) => void;
}

export const YardRerouteAndStorageCard: React.FC<YardRerouteAndStorageProps> = ({
  market,
  storage,
  onViewMandiStream,
  onPrebookStorage,
}) => {
  return (
    <div className="space-y-4">
      {/* ── 1. Yard Reroute Card ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-700" />
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-600">
              YARD REROUTE OPTION
            </span>
          </div>

          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{market.status}</span>
          </span>
        </div>

        {/* Market Title & Distance */}
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">
            {market.name}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {market.distanceKm} km away • Transit time {market.transitTime}
          </p>
        </div>

        {/* Key Metrics Box */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Current Modal Price:</span>
            <span className="text-base font-black text-slate-900">
              ₹{market.modalPrice.toLocaleString('en-IN')} / {market.unit}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Yard Arrival Capacity:</span>
            <span className="font-bold text-slate-800">{market.arrivalCapacity}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Active Commission Agents:</span>
            <span className="font-bold text-slate-800">{market.activeTraders} Licensed Traders</span>
          </div>
        </div>

        {/* Schematic Corridor / Route Banner */}
        <div className="rounded-2xl p-3 bg-amber-50/70 border border-amber-200 text-xs flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="font-bold text-amber-900">{market.corridorStatus}</span>
        </div>

        {/* Mandi Auction Button */}
        <button
          type="button"
          onClick={() => onViewMandiStream(market)}
          className="w-full py-3 px-4 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-800 font-black text-xs transition-colors flex items-center justify-center gap-1.5 border border-sky-200 shadow-sm"
        >
          <span>View Mandi Auction Live Stream</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── 2. Holding Facility Card ─────────────────────────────────────────── */}
      <div
        onClick={() => onPrebookStorage(storage)}
        className="bg-sky-50/70 hover:bg-sky-100/80 cursor-pointer rounded-3xl p-5 border border-sky-200 transition-all flex items-center gap-4 group"
      >
        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-sky-700 shadow-sm shrink-0">
          <Snowflake className="w-6 h-6" />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-black text-slate-900 truncate">
            {storage.facilityName}
          </h4>
          <p className="text-xs text-slate-600 font-medium truncate mt-0.5">
            {storage.location} • {storage.rate}
          </p>
          <div className="flex items-center gap-1 text-xs font-bold text-sky-800 mt-1.5 group-hover:text-sky-900">
            <span>{storage.actionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </div>
  );
};
