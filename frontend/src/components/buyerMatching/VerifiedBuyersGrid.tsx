import React from 'react';
import { ShieldCheck, Star, CheckCircle2, ArrowRight, PhoneCall } from 'lucide-react';
import { BuyerMatchItem } from '../../types/buyerMatching';

interface VerifiedBuyersGridProps {
  buyers: BuyerMatchItem[];
  selectedBuyerId?: number;
  onSelectBuyer: (b: BuyerMatchItem) => void;
  onSendOffer: (b: BuyerMatchItem) => void;
}

export const VerifiedBuyersGrid: React.FC<VerifiedBuyersGridProps> = ({
  buyers,
  selectedBuyerId,
  onSelectBuyer,
  onSendOffer,
}) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-forest-800 text-white flex items-center justify-center text-xs font-black">
              2
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
              Suitable Verified Buyers Near You
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Ranked automatically by compatibility, offering price, distance, and historical prompt payment rating.
          </p>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 p-1 rounded-xl self-start sm:self-center">
          <span className="text-[11px] text-slate-400 font-semibold px-2">Filter by:</span>
          <button type="button" className="px-2.5 py-1 rounded-lg bg-white text-slate-900 shadow-sm">
            Highest Price
          </button>
          <button type="button" className="px-2.5 py-1 rounded-lg hover:bg-slate-200/60 text-slate-600">
            Closest Distance
          </button>
          <button type="button" className="px-2.5 py-1 rounded-lg hover:bg-slate-200/60 text-slate-600">
            Fastest Payout
          </button>
        </div>
      </div>

      {/* 3-Column Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {buyers.map((b) => {
          const isSelected = selectedBuyerId === b.id;

          return (
            <div
              key={b.id}
              className={`bg-white rounded-3xl p-5 border-2 transition-all flex flex-col justify-between space-y-4 ${
                isSelected
                  ? 'border-forest-800 ring-2 ring-forest-800/20 shadow-md'
                  : 'border-slate-200 hover:border-forest-300 shadow-sm'
              }`}
            >
              <div>
                {/* Header with Type & Match Score Pill */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-forest-800 bg-forest-50 px-2 py-0.5 rounded border border-forest-200 block max-w-fit">
                      {b.buyerType}
                    </span>
                    <h4 className="text-lg font-black text-slate-900 mt-1">{b.buyerName}</h4>
                    <p className="text-[11px] text-slate-400">{b.buyerCategory}</p>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300 shrink-0">
                    {b.matchScore}% Match
                  </span>
                </div>

                {/* Rating & Hub */}
                <div className="flex items-center gap-2 text-xs text-slate-600 pb-3 border-b border-slate-100 flex-wrap">
                  <span className="flex items-center gap-1 font-bold text-slate-800">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    {b.rating}/5 Rating
                  </span>
                  <span>•</span>
                  <span>{b.dealsFulfilled} Deals Fulfilled</span>
                  <span>•</span>
                  <span>{b.hubLocation}</span>
                </div>

                {/* Price Display */}
                <div className="mt-3 flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      OFFERED FARM-GATE PRICE
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl sm:text-3xl font-black text-forest-900">
                        ₹{b.offeredPricePerKg.toFixed(2)}
                      </span>
                      <span className="text-xs font-bold text-slate-500">/ kg</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-900 block">
                      ₹{b.offeredPricePerQuintal.toLocaleString('en-IN')} / Quintal
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Total Lot Value: ₹{b.totalLotValue.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Logistics & Delivery row */}
                <div className="mt-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Needs:</span>
                    <span className="font-bold text-slate-800">{b.neededQuantityQuintals} Quintals</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Hub Location:</span>
                    <span className="font-bold text-slate-800">{b.hubLocation}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Date:</span>
                    <span className="font-bold text-slate-800">{b.deliveryDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Payment:</span>
                    <span className="font-bold text-emerald-700">{b.paymentTerms}</span>
                  </div>
                </div>

                {/* Bullet points */}
                <div className="mt-3 space-y-1.5 text-xs text-slate-700 font-semibold">
                  {b.points.map((pt, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[11px]">
                      <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onSelectBuyer(b)}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 shadow-sm ${
                    isSelected
                      ? 'bg-forest-800 text-white'
                      : 'bg-forest-50 hover:bg-forest-100 text-forest-800'
                  }`}
                >
                  <span>{isSelected ? 'Negotiating Now' : 'View & Negotiate'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => onSendOffer(b)}
                  className="px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
                >
                  Send Offer
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
