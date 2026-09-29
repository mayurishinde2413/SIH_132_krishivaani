import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Sparkles, ArrowRight } from 'lucide-react';

interface FarmerModulePlaceholderProps {
  moduleNumber: string;
  titleKey: string;
  fallbackTitle: string;
  description: string;
  features: string[];
}

export const FarmerModulePlaceholder: React.FC<FarmerModulePlaceholderProps> = ({
  moduleNumber,
  titleKey,
  fallbackTitle,
  description,
  features,
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-forest-50 text-forest-800 border border-forest-200 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-forest-600" />
          <span>{moduleNumber} · Module Overview</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t(titleKey, fallbackTitle)}
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
          {description}
        </p>
      </div>

      {/* Feature Blueprint Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 mb-4">
          Core Capabilities in this Module
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80"
            >
              <div className="w-7 h-7 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <p className="text-sm font-medium text-slate-700">{feature}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
