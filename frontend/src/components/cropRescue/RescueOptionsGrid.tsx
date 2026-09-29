import React from 'react';
import { Store, Users, Building2, Snowflake, ArrowDown, ExternalLink } from 'lucide-react';

export interface RescueOption {
  id: string;
  title: string;
  badge: string;
  badgeType: 'recommended' | 'fpo' | 'market' | 'storage' | string;
  description: string;
  actionText: string;
  actionKey: string;
  isPrimary?: boolean;
}

interface RescueOptionsGridProps {
  options: RescueOption[];
  selectedProblemTitle: string;
  lotSummary: string;
  activeOptionId: string;
  onSelectOption: (option: RescueOption) => void;
}

export const RescueOptionsGrid: React.FC<RescueOptionsGridProps> = ({
  options,
  selectedProblemTitle,
  lotSummary,
  activeOptionId,
  onSelectOption,
}) => {
  const getBadgeStyle = (badgeType: string) => {
    switch (badgeType) {
      case 'recommended':
        return 'bg-emerald-800 text-white font-black';
      case 'fpo':
        return 'bg-sky-100 text-sky-800 font-bold';
      case 'market':
        return 'bg-slate-100 text-slate-700 font-bold';
      case 'storage':
        return 'bg-indigo-100 text-indigo-800 font-bold';
      default:
        return 'bg-slate-100 text-slate-700 font-bold';
    }
  };

  const getOptionIcon = (id: string, isActive: boolean) => {
    switch (id) {
      case 'alternative_buyer':
        return (
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
            isActive ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700'
          }`}>
            <Store className="w-5 h-5" />
          </div>
        );
      case 'fpo_pool':
        return (
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
            isActive ? 'bg-sky-600 text-white' : 'bg-sky-50 text-sky-700'
          }`}>
            <Users className="w-5 h-5" />
          </div>
        );
      case 'nearby_market':
        return (
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
            isActive ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-700'
          }`}>
            <Building2 className="w-5 h-5" />
          </div>
        );
      case 'cold_storage':
      default:
        return (
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
            isActive ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-700'
          }`}>
            <Snowflake className="w-5 h-5" />
          </div>
        );
    }
  };

  return (
    <div className="space-y-3">
      {/* Step Header with Lot badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
            STEP 2 OF 4
          </span>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Available Rescue Options for “{selectedProblemTitle}”
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Select an immediate alternative solution below. You can match instantly with a backup buyer, reroute into your FPO's bulk supply, divert to open yard, or store safely.
          </p>
        </div>

        <div className="bg-sky-50 text-sky-900 border border-sky-200 px-3.5 py-1.5 rounded-2xl flex items-center gap-1.5 text-xs font-bold shrink-0 self-start sm:self-center shadow-sm">
          <span>📦</span>
          <span>Your Lot: {lotSummary}</span>
        </div>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {options.map((option) => {
          const isActive = activeOptionId === option.id;

          return (
            <div
              key={option.id}
              onClick={() => onSelectOption(option)}
              className={`rounded-3xl p-5 border-2 transition-all flex flex-col justify-between space-y-4 cursor-pointer bg-white ${
                isActive
                  ? 'border-emerald-600 ring-2 ring-emerald-600/20 shadow-md shadow-emerald-950/5'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  {getOptionIcon(option.id, isActive)}
                  <span className={`px-2.5 py-1 rounded-full text-[10px] tracking-wide uppercase ${getBadgeStyle(option.badgeType)}`}>
                    {option.badge}
                  </span>
                </div>

                <h3 className="text-base font-black text-slate-900 mb-1">
                  {option.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {option.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                <span className={isActive ? 'text-emerald-700' : 'text-slate-700'}>
                  {option.actionText}
                </span>
                {option.id === 'alternative_buyer' ? (
                  <ArrowDown className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-700 animate-bounce' : 'text-slate-400'}`} />
                ) : (
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
