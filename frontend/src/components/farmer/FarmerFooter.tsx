import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { CheckCircle2 } from 'lucide-react';

export const FarmerFooter: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="w-full bg-slate-50 border-t border-slate-200 mt-auto py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            <span>{t('helplineHours')}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {t('verifiedMandi')}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-200/70 text-slate-700 font-medium">
              {t('sihPrototype')}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
