import React from 'react';
import { Ban, Truck, AlertCircle, AlertTriangle, ArrowRight, Check } from 'lucide-react';

export interface EmergencyTrigger {
  id: string;
  title: string;
  badge: string;
  iconType: 'cancel' | 'transport' | 'quality' | 'other';
  description: string;
  actionHint: string;
}

interface EmergencyTriggerSelectorProps {
  triggers: EmergencyTrigger[];
  selectedTriggerId: string;
  onSelectTrigger: (id: string) => void;
}

export const EmergencyTriggerSelector: React.FC<EmergencyTriggerSelectorProps> = ({
  triggers,
  selectedTriggerId,
  onSelectTrigger,
}) => {
  const getIcon = (type: string, isSelected: boolean) => {
    switch (type) {
      case 'cancel':
        return (
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
            isSelected ? 'bg-red-500 text-white' : 'bg-red-100 text-red-600'
          }`}>
            <Ban className="w-5 h-5" />
          </div>
        );
      case 'transport':
        return (
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
            isSelected ? 'bg-sky-500 text-white' : 'bg-sky-100 text-sky-600'
          }`}>
            <Truck className="w-5 h-5" />
          </div>
        );
      case 'quality':
        return (
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
            isSelected ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-600'
          }`}>
            <AlertCircle className="w-5 h-5" />
          </div>
        );
      default:
        return (
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
            isSelected ? 'bg-rose-500 text-white' : 'bg-rose-100 text-rose-600'
          }`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
        );
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
            STEP 1 OF 4
          </span>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            What happened with your lot?
          </h2>
        </div>
        <span className="text-xs font-semibold text-slate-500">
          Click to switch incident trigger
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {triggers.map((trigger) => {
          const isSelected = trigger.id === selectedTriggerId;

          return (
            <div
              key={trigger.id}
              onClick={() => onSelectTrigger(trigger.id)}
              className={`cursor-pointer rounded-3xl p-5 border-2 transition-all flex flex-col justify-between space-y-4 ${
                isSelected
                  ? 'border-emerald-600 bg-white ring-2 ring-emerald-600/20 shadow-md shadow-emerald-950/5'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  {getIcon(trigger.iconType, isSelected)}
                  {isSelected ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-800 text-white shadow-sm">
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>Selected</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">
                      {trigger.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-black text-slate-900 mb-1">
                  {trigger.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {trigger.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                <span className={isSelected ? 'text-emerald-700' : 'text-slate-500'}>
                  {trigger.actionHint}
                </span>
                <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'text-emerald-700 translate-x-0.5' : 'text-slate-400'}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
