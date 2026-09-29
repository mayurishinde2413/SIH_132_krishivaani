// frontend/src/components/cropRescue/SuccessBanner.tsx
import React from 'react';
import { getCropIcon } from '../../utils/cropIcon';
import { RescueCaseData } from './CaseCard';

interface SuccessBannerProps {
  rescueCase: RescueCaseData;
  onDismiss: () => void;
}

export const SuccessBanner: React.FC<SuccessBannerProps> = ({ rescueCase, onDismiss }) => {
  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-3xl p-6 mb-6 animate-pulse-once">
      {/* Icon + headline */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 bg-green-100 rounded-3xl flex items-center justify-center text-4xl">
          ✅
        </div>
        <div>
          <h3 className="text-xl font-bold text-green-800">Rescue Case Raised!</h3>
          <p className="text-sm text-green-600">Your emergency has been registered successfully.</p>
        </div>
      </div>

      {/* Case details */}
      <div className="bg-white rounded-2xl p-4 space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Case ID</span>
          <span className="font-bold text-gray-800">#{rescueCase.id}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Crop</span>
          <span className="font-bold text-gray-800">
            {getCropIcon(rescueCase.crop.name)} {rescueCase.crop.name}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Quantity</span>
          <span className="font-bold text-gray-800">{rescueCase.quantity} quintals</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Status</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            Open — Awaiting Response
          </span>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onDismiss}
          className="flex-1 bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-2xl text-sm transition-colors"
        >
          View My Cases
        </button>
      </div>
    </div>
  );
};
