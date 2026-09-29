import React from 'react';
import { useLanguage, Language } from '../../context/LanguageContext';

export const LanguageSelector: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { language, setLanguage } = useLanguage();

  const options: { id: Language; label: string }[] = [
    { id: 'en', label: 'English' },
    { id: 'mr', label: 'मराठी' },
    { id: 'hi', label: 'हिंदी' },
  ];

  return (
    <div className={`inline-flex items-center rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm ${className}`}>
      {options.map((opt) => {
        const isActive = language === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => setLanguage(opt.id)}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              isActive
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};
