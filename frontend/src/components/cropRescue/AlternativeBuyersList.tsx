import React from 'react';
import { ShieldCheck, PhoneCall, Clock, Scale, CheckCircle2, Factory, Store } from 'lucide-react';
import { getCropIcon } from '../../utils/cropIcon';

export interface RescueBuyer {
  id: number;
  buyerName: string;
  tag: string;
  tagColor: 'green' | 'blue' | 'amber' | string;
  location: string;
  crop: string;
  neededQuantity: string;
  pricePerQuintal: number;
  pricePerKg: number;
  payoutNote: string;
  perks: string[];
  phone: string;
  actionLabel: string;
}

interface AlternativeBuyersListProps {
  buyers: RescueBuyer[];
  onContactBuyer: (buyer: RescueBuyer) => void;
  isProcessing?: boolean;
}

export const AlternativeBuyersList: React.FC<AlternativeBuyersListProps> = ({
  buyers,
  onContactBuyer,
  isProcessing = false,
}) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
            STEP 3 OF 4: DIRECT ACTION
          </span>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Alternative Verified Buyers (Ready to Buy Today)
          </h2>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 self-start sm:self-center shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Pre-cleared Escrow</span>
        </span>
      </div>

      {/* Buyer Cards */}
      <div className="space-y-4">
        {buyers.map((buyer) => {
          const isGreen = buyer.tagColor === 'green';
          const isBlue = buyer.tagColor === 'blue';

          const tagBadgeStyle = isGreen
            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
            : isBlue
            ? 'bg-sky-100 text-sky-900 border border-sky-300'
            : 'bg-amber-100 text-amber-900 border border-amber-300';

          return (
            <div
              key={buyer.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
            >
              {/* Left accent strip */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                  isGreen ? 'bg-emerald-600' : isBlue ? 'bg-sky-600' : 'bg-amber-500'
                }`}
              />

              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                {/* Company & details */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700">
                      {isBlue ? <Factory className="w-5 h-5" /> : <Store className="w-5 h-5" />}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-black text-slate-900 tracking-tight">
                          {buyer.buyerName}
                        </h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black ${tagBadgeStyle}`}>
                          {buyer.tag}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span>📍 {buyer.location}</span>
                        <span>•</span>
                        <span>{getCropIcon(buyer.crop)} {buyer.crop}</span>
                        <span>•</span>
                        <span>📦 Need: {buyer.neededQuantity}</span>
                      </div>
                    </div>
                  </div>

                  {/* Perks row */}
                  <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-600 font-semibold">
                    {buyer.perks.map((perk, i) => (
                      <span key={i} className="inline-flex items-center gap-1">
                        {perk.includes('Escrow') ? (
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        ) : perk.includes('Pickup') || perk.includes('mins') ? (
                          <Clock className="w-3.5 h-3.5 text-sky-600" />
                        ) : perk.includes('Weighment') ? (
                          <Scale className="w-3.5 h-3.5 text-indigo-600" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                        <span>{perk}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price block & Action button */}
                <div className="flex md:flex-col items-center md:items-end justify-between gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-left md:text-right">
                    <div className="text-2xl sm:text-3xl font-black text-slate-900">
                      ₹{buyer.pricePerQuintal.toLocaleString('en-IN')}{' '}
                      <span className="text-xs text-slate-500 font-bold">/ Q</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      ₹{buyer.pricePerKg} / kg • {buyer.payoutNote}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onContactBuyer(buyer)}
                    disabled={isProcessing}
                    className="px-5 py-3 rounded-2xl bg-forest-900 hover:bg-forest-950 text-white font-black text-xs transition-all shadow-md shadow-forest-950/20 flex items-center gap-2 shrink-0 disabled:opacity-50"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{buyer.actionLabel}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
