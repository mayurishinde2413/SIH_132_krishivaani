import React, { useState } from 'react';
import { ShieldCheck, Plus, Minus, Send, CheckCircle2, MessageSquare, XCircle } from 'lucide-react';
import { BuyerMatchItem } from '../../types/buyerMatching';

interface NegotiationConsoleProps {
  buyer: BuyerMatchItem;
  quantityQuintals: number;
  askingRatePerKg: number;
  onAcceptOffer: (buyer: BuyerMatchItem, finalRate: number) => void;
  onCounterOffer: (buyer: BuyerMatchItem, counterRate: number) => void;
  onDeclineOffer: (buyer: BuyerMatchItem) => void;
  isProcessing: boolean;
}

export const NegotiationConsole: React.FC<NegotiationConsoleProps> = ({
  buyer,
  quantityQuintals,
  askingRatePerKg,
  onAcceptOffer,
  onCounterOffer,
  onDeclineOffer,
  isProcessing,
}) => {
  const [counterRate, setCounterRate] = useState<number>(29.25);
  const currentBuyerRate = buyer.offeredPricePerKg;

  const totalKg = quantityQuintals * 100;
  const buyerLotTotal = Math.round(totalKg * currentBuyerRate);
  const askingLotTotal = Math.round(totalKg * askingRatePerKg);
  const spreadDiff = Number((askingRatePerKg - currentBuyerRate).toFixed(2));

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-forest-800 text-white flex items-center justify-center text-xs font-black">
              3
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
              Interactive Direct Negotiation & Bidding Console
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
              e-NAM BID-AGR-2026-904
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Live transparent negotiation session with <strong>{buyer.buyerName}</strong>.
          </p>
        </div>

        <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1.5 self-start sm:self-center">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Session Security: Bank-grade 256-bit tokenized agreement</span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Cols: Offer Spread & Payout Differential */}
        <div className="lg:col-span-6 bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Offer Spread & Payout Differential
              </span>
              <span className="text-xs font-black text-slate-800">
                {quantityQuintals} Quintals ({totalKg.toLocaleString('en-IN')} kg) FAQ Grade A
              </span>
            </div>

            {/* Side by side rate boxes */}
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Your Asking Rate</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">Initial</span>
                </div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-900">₹{askingRatePerKg.toFixed(2)}</span>
                  <span className="text-xs font-bold text-slate-400">/ kg</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Lot Gross Value: ₹{askingLotTotal.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-forest-900 text-white shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-emerald-300 uppercase font-bold">Buyer's Current Offer</span>
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-700 text-white">Active Bid</span>
                </div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-2xl font-black text-white">₹{currentBuyerRate.toFixed(2)}</span>
                  <span className="text-xs font-bold text-emerald-200">/ kg</span>
                </div>
                <span className="text-[10px] text-emerald-200 mt-1 block">
                  Take-Home Total: ₹{buyerLotTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Spread Difference pill */}
            <div className="mt-3 p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
                <span>⚡</span>
                <span>Spread Difference: Only ₹{spreadDiff.toFixed(2)} / kg</span>
              </div>
              <span className="text-[11px] text-emerald-800 font-semibold">
                Zero Farmer Freight (Buyer Trucking)
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500">
            Buyer bears all round-trip container logistics from your Baramati FPO shed. You do not pay diesel, crate rent, or mandi hamali labor fees.
          </p>
        </div>

        {/* Right 6 Cols: Step 4 Confirm or Propose Counter */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-5 border border-slate-200 flex flex-col justify-between space-y-4">
          <div>
            <h4 className="text-sm font-extrabold text-slate-900">
              Step 4: Confirm or Propose Counter
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Accepting will instantly generate a digital bill of sale and hold ₹{buyerLotTotal.toLocaleString('en-IN')} in escrow. Or send a swift 25-paise counter.
            </p>

            {/* Counter Bid Rate Selector */}
            <div className="mt-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Propose Custom Rate (Counter)</span>
                <span className="text-[10px] text-slate-400">Max spread limit: +₹2.00</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center bg-white rounded-xl border border-slate-200 p-1 flex-1">
                  <button
                    type="button"
                    onClick={() => setCounterRate((r) => Math.max(currentBuyerRate, Number((r - 0.25).toFixed(2))))}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <div className="flex-1 text-center font-black text-slate-900 text-lg">
                    ₹{counterRate.toFixed(2)} <span className="text-xs font-normal text-slate-400">/ kg</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCounterRate((r) => Number((r + 0.25).toFixed(2)))}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => onCounterOffer(buyer, counterRate)}
                  disabled={isProcessing}
                  className="px-4 py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shrink-0 transition-colors shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Counter</span>
                </button>
              </div>

              <span className="text-[10px] text-slate-400 block text-right">
                Lot Total: ₹{Math.round(totalKg * counterRate).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Accept Offer Action Banner */}
          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={() => onAcceptOffer(buyer, currentBuyerRate)}
              disabled={isProcessing}
              className="w-full py-3.5 px-4 rounded-2xl bg-forest-800 hover:bg-forest-900 text-white font-black text-sm shadow-md shadow-forest-950/20 flex items-center justify-center gap-2 transition-all"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-300" />
              <span>
                Accept Offer (₹{currentBuyerRate.toFixed(2)} • ₹{buyerLotTotal.toLocaleString('en-IN')} Total)
              </span>
            </button>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => alert(`Connecting to ${buyer.buyerName} procurement desk on e-NAM secure chat...`)}
                className="text-slate-600 hover:text-slate-900 font-bold flex items-center gap-1"
              >
                <MessageSquare className="w-3.5 h-3.5 text-forest-700" />
                <span>Chat with Procurement Officer</span>
              </button>

              <button
                type="button"
                onClick={() => onDeclineOffer(buyer)}
                className="text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Decline</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
