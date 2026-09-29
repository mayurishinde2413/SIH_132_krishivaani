import React from 'react';
import { Headphones, PhoneCall, MessageCircle } from 'lucide-react';

interface GroundSupportBannerProps {
  onCallFPO: () => void;
  onCallHelpline: () => void;
  onOpenWhatsApp: () => void;
}

export const GroundSupportBanner: React.FC<GroundSupportBannerProps> = ({
  onCallFPO,
  onCallHelpline,
  onOpenWhatsApp,
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left side text with icon */}
        <div className="flex items-start gap-4 flex-1">
          <div className="w-12 h-12 rounded-2xl bg-forest-900 text-emerald-400 flex items-center justify-center shrink-0 shadow-sm">
            <Headphones className="w-6 h-6" />
          </div>

          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
              KRISHIVAANI GROUND SUPPORT
            </span>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              You are not alone. Help is on standby.
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-2xl">
              Our local Baramati field coordinator and agri-extension desk can intervene directly with buyers or arrange immediate vehicle clearance.
            </p>
          </div>
        </div>

        {/* 3 Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {/* Call FPO Manager */}
          <button
            type="button"
            onClick={onCallFPO}
            className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center gap-2"
          >
            <PhoneCall className="w-3.5 h-3.5 text-slate-600" />
            <span>Call FPO Manager (Baramati)</span>
          </button>

          {/* 24x7 SOS */}
          <button
            type="button"
            onClick={onCallHelpline}
            className="px-4 py-3 rounded-2xl bg-forest-900 hover:bg-forest-950 text-white font-bold text-xs transition-colors flex items-center gap-2 shadow-md shadow-forest-950/20"
          >
            <Headphones className="w-3.5 h-3.5 text-emerald-400" />
            <span>24x7 SOS: 1800-180-1551</span>
          </button>

          {/* WhatsApp SOS Desk */}
          <button
            type="button"
            onClick={onOpenWhatsApp}
            className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center gap-2"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp SOS Desk</span>
          </button>
        </div>
      </div>
    </div>
  );
};
