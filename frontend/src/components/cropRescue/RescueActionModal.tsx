import React, { useState } from 'react';
import { X, CheckCircle2, PhoneCall, Building2, Snowflake, ShieldCheck, ArrowRight } from 'lucide-react';
import { RescueBuyer } from './AlternativeBuyersList';
import { RescueMarket, RescueStorage } from './YardRerouteAndStorageCard';

export type ModalType = 'buyer' | 'fpo' | 'market' | 'storage' | null;

interface RescueActionModalProps {
  modalType: ModalType;
  selectedBuyer: RescueBuyer | null;
  selectedMarket: RescueMarket | null;
  selectedStorage: RescueStorage | null;
  lotSummary: string;
  onClose: () => void;
  onConfirmAction: (actionDetails: {
    actionType: string;
    targetName: string;
    details: string;
  }) => Promise<void>;
  isSubmitting: boolean;
}

export const RescueActionModal: React.FC<RescueActionModalProps> = ({
  modalType,
  selectedBuyer,
  selectedMarket,
  selectedStorage,
  lotSummary,
  onClose,
  onConfirmAction,
  isSubmitting,
}) => {
  const [confirmed, setConfirmed] = useState(false);

  if (!modalType) return null;

  const handleConfirm = async () => {
    let actionType = 'GENERAL_RESCUE';
    let targetName = '';
    let details = '';

    if (modalType === 'buyer' && selectedBuyer) {
      actionType = 'ALTERNATIVE_BUYER_DISPATCH';
      targetName = selectedBuyer.buyerName;
      details = `Direct line call dispatched to ${selectedBuyer.buyerName} for ${lotSummary} @ ₹${selectedBuyer.pricePerQuintal}/Q. Phone: ${selectedBuyer.phone}`;
    } else if (modalType === 'fpo') {
      actionType = 'FPO_BASKET_TRANSFER';
      targetName = 'Baramati Agro FPO';
      details = `Lot transferred to Baramati Agro FPO collective pool @ ₹2,650/Q guaranteed price.`;
    } else if (modalType === 'market' && selectedMarket) {
      actionType = 'MANDI_YARD_REROUTE';
      targetName = selectedMarket.name;
      details = `Truck rerouted to ${selectedMarket.name} (${selectedMarket.distanceKm} km away) with open bay auction.`;
    } else if (modalType === 'storage' && selectedStorage) {
      actionType = 'COLD_STORAGE_RESERVE';
      targetName = selectedStorage.facilityName;
      details = `Reserved 30 Q chamber bay at ${selectedStorage.facilityName} @ ${selectedStorage.rate}.`;
    }

    await onConfirmAction({ actionType, targetName, details });
    setConfirmed(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmed ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto text-3xl">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900">
                Rescue Action Registered!
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Incident logged in KrishiVaani emergency registry. Our local field officer and recipient have been alerted.
              </p>
            </div>

            <div className="bg-emerald-50 text-emerald-900 border border-emerald-200 p-4 rounded-2xl text-xs font-bold text-left space-y-1">
              <div>✅ Status: Dispatch Protected & Logged in PostgreSQL</div>
              <div>⚡ Priority Corridor: Activated via Baramati FPO Node</div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl bg-forest-900 text-white text-xs font-black shadow-md shadow-forest-950/20"
            >
              Back to Rescue Console
            </button>
          </div>
        ) : (
          <>
            {/* Modal Type: Buyer */}
            {modalType === 'buyer' && selectedBuyer && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <PhoneCall className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-emerald-700 tracking-wider">
                      DIRECT FARM-GATE DISPATCH
                    </span>
                    <h3 className="text-xl font-black text-slate-900">
                      {selectedBuyer.buyerName}
                    </h3>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Produce:</span>
                    <span className="font-bold text-slate-800">{selectedBuyer.crop}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Agreed Price:</span>
                    <span className="text-sm font-black text-slate-900">₹{selectedBuyer.pricePerQuintal} / Quintal</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Procurement Desk Direct Line:</span>
                    <span className="font-mono font-bold text-emerald-700 text-sm">{selectedBuyer.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Escrow Security:</span>
                    <span className="font-bold text-slate-800">100% Pre-cleared e-NAM</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500">
                  Clicking confirm will establish a direct emergency priority link and record this rescue dispatch to your farmer ledger.
                </p>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={isSubmitting}
                    className="flex-1 py-3 rounded-2xl bg-forest-900 hover:bg-forest-950 text-white text-xs font-black shadow-md shadow-forest-950/20 flex items-center justify-center gap-2"
                  >
                    <span>{isSubmitting ? 'Registering...' : 'Confirm & Call Buyer'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Modal Type: FPO Transfer */}
            {modalType === 'fpo' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center text-xl">
                    👥
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-sky-700 tracking-wider">
                      FPO BULK BASKET TRANSFER
                    </span>
                    <h3 className="text-xl font-black text-slate-900">
                      Baramati Agro FPO Collective Pool
                    </h3>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Lot Volume:</span>
                    <span className="font-bold text-slate-800">{lotSummary}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Guaranteed Base Floor:</span>
                    <span className="text-sm font-black text-emerald-800">₹2,650 / Q Guaranteed</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">FPO Hub Location:</span>
                    <span className="font-bold text-slate-800">Baramati Shed Gate 02</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500">
                  Transferring this lot into your FPO's pool secures guaranteed payment from institutional food contracts, avoiding open distress dumping.
                </p>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={isSubmitting}
                    className="flex-1 py-3 rounded-2xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-black shadow-md flex items-center justify-center gap-2"
                  >
                    <span>{isSubmitting ? 'Transferring...' : 'Confirm FPO Transfer'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Modal Type: Mandi Market */}
            {modalType === 'market' && selectedMarket && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                      MANDI YARD REROUTE
                    </span>
                    <h3 className="text-xl font-black text-slate-900">
                      {selectedMarket.name}
                    </h3>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Distance & Time:</span>
                    <span className="font-bold text-slate-800">{selectedMarket.distanceKm} km ({selectedMarket.transitTime})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Live Modal Price:</span>
                    <span className="font-black text-slate-900 text-sm">₹{selectedMarket.modalPrice} / {selectedMarket.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Corridor Status:</span>
                    <span className="font-bold text-emerald-700">Clear Green Route</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500">
                  Diverting to Phaltan APMC allows instant participation in the morning open floor auction with 12 active licensed commission traders.
                </p>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={isSubmitting}
                    className="flex-1 py-3 rounded-2xl bg-slate-900 hover:bg-black text-white text-xs font-black shadow-md flex items-center justify-center gap-2"
                  >
                    <span>{isSubmitting ? 'Confirming...' : 'Generate Gate Entry Pass'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Modal Type: Storage */}
            {modalType === 'storage' && selectedStorage && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center">
                    <Snowflake className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-indigo-700 tracking-wider">
                      TEMPORARY COLD BAY HOLD
                    </span>
                    <h3 className="text-xl font-black text-slate-900">
                      {selectedStorage.facilityName}
                    </h3>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Location:</span>
                    <span className="font-bold text-slate-800">{selectedStorage.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Subsidized Tariff:</span>
                    <span className="font-black text-slate-900 text-sm">{selectedStorage.rate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Holding Guarantee:</span>
                    <span className="font-bold text-indigo-700">{selectedStorage.maxDuration}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500">
                  Pre-booking preserves freshness while waiting for market prices to recover or an alternate buyer to arrive.
                </p>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={isSubmitting}
                    className="flex-1 py-3 rounded-2xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-black shadow-md flex items-center justify-center gap-2"
                  >
                    <span>{isSubmitting ? 'Reserving...' : 'Confirm 3-Day Space'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
