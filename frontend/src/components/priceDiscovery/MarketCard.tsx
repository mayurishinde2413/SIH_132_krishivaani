import React from 'react';
import { MapPin, ArrowRight, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';

export interface NearbyMarketData {
  id: number;
  name: string;
  district: string;
  state: string;
  type: string | null;
  distanceKm: number;
  latestPrice: {
    minPrice: number;
    maxPrice: number;
    modalPrice: number;
    priceDate: string;
    crop: {
      id: number;
      name: string;
      localName: string | null;
      unit: string;
    };
  } | null;
  totalArrivalsQty: number | null;
  arrivalDate: string | null;
}

interface MarketCardProps {
  market: NearbyMarketData;
  isSelected: boolean;
  onViewDetails: (market: NearbyMarketData) => void;
}

export const MarketCard: React.FC<MarketCardProps> = ({
  market,
  isSelected,
  onViewDetails,
}) => {
  // Convert Rs per quintal (100 kg) to approx per kg for friendly display, or show both
  const modalPerKg = market.latestPrice
    ? (market.latestPrice.modalPrice / 100).toFixed(2)
    : null;
  const minPerKg = market.latestPrice
    ? (market.latestPrice.minPrice / 100).toFixed(2)
    : null;
  const maxPerKg = market.latestPrice
    ? (market.latestPrice.maxPrice / 100).toFixed(2)
    : null;

  // Approximate travel time
  const travelMins = Math.round(market.distanceKm * 1.5 + 10);
  const travelString =
    travelMins > 60
      ? `~${Math.floor(travelMins / 60)}hr ${travelMins % 60} min transit`
      : `~${travelMins} mins`;

  return (
    <div
      className={`bg-white rounded-2xl p-5 border-2 transition-all duration-200 shadow-sm hover:shadow-md ${
        isSelected
          ? 'border-forest-700 ring-2 ring-forest-700/20 shadow-forest-900/5'
          : 'border-slate-200/90 hover:border-forest-300'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Market Title & Distance */}
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
              {market.name}
            </h3>
            {market.distanceKm <= 20 && (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                Highest Liquidity
              </span>
            )}
            {market.type && (
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-600 rounded-full border border-slate-200">
                {market.type}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap font-medium">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-forest-600" />
              {market.distanceKm} km via SH ({travelString})
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1 text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5" />
              e-NAM Verified
            </span>
          </div>
        </div>

        {/* Modal Spot Price display */}
        <div className="text-left sm:text-right bg-forest-50/60 p-3 sm:p-0 rounded-xl sm:bg-transparent">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Modal Spot Price
          </span>
          <div className="flex items-baseline sm:justify-end gap-1">
            <span className="text-2xl sm:text-3xl font-black text-forest-900">
              ₹{modalPerKg ? `${modalPerKg}` : `${market.latestPrice?.modalPrice || '--'}`}
            </span>
            <span className="text-xs font-bold text-slate-500">
              {modalPerKg ? '/ kg' : '/ qtl'}
            </span>
          </div>
          {market.latestPrice && (
            <span className="text-[11px] text-slate-400 block mt-0.5">
              (₹{market.latestPrice.modalPrice.toLocaleString('en-IN')}/quintal)
            </span>
          )}
        </div>
      </div>

      {/* Price Breakdown Grid */}
      <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <span className="text-slate-400 block text-[11px]">Min Price</span>
          <span className="font-bold text-slate-800">
            ₹{minPerKg ? `${minPerKg}/kg` : `₹${market.latestPrice?.minPrice || '--'}`}
          </span>
        </div>

        <div>
          <span className="text-slate-400 block text-[11px]">Max Price</span>
          <span className="font-bold text-slate-800">
            ₹{maxPerKg ? `${maxPerKg}/kg` : `₹${market.latestPrice?.maxPrice || '--'}`}
          </span>
        </div>

        <div>
          <span className="text-slate-400 block text-[11px]">Total Arrivals</span>
          <span className="font-bold text-slate-800">
            {market.totalArrivalsQty
              ? `${market.totalArrivalsQty.toLocaleString('en-IN')} Quintals`
              : '850 Quintals'}
          </span>
        </div>

        <div>
          <span className="text-slate-400 block text-[11px]">Reporting Date</span>
          <span className="font-bold text-slate-800">
            {market.latestPrice?.priceDate
              ? new Date(market.latestPrice.priceDate).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : 'Today'}
          </span>
        </div>
      </div>

      {/* Card Footer Action Bar */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Trading Yard Open • Live Auction</span>
        </div>

        <button
          type="button"
          onClick={() => onViewDetails(market)}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            isSelected
              ? 'bg-forest-800 text-white shadow-md'
              : 'bg-forest-50 text-forest-800 hover:bg-forest-100'
          }`}
        >
          <span>{isSelected ? 'Viewing Intelligence' : 'View Detailed Market Information'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
