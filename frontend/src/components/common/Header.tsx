import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { BrandLogo } from './BrandLogo';
import { LanguageSelector } from './LanguageSelector';
import { PhoneCall } from 'lucide-react';

export const Header: React.FC = () => {
  const { t } = useLanguage();

  return (
    <header className="w-full bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo — shared BrandLogo component */}
          <Link to="/" className="group">
            <BrandLogo variant="dark" iconStyle="solid" showTagline={true} />
          </Link>

          {/* Right: Kisan Call Centre + Language Selector */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50/70 text-slate-700">
              <PhoneCall className="w-4 h-4 text-emerald-700" />
              <div className="text-xs">
                <span className="text-slate-500 font-normal mr-1.5">{t('kisanCallCentre')}</span>
                <span className="font-extrabold text-slate-900 tracking-wide">1800–180–1551</span>
              </div>
            </div>

            <LanguageSelector />
          </div>
        </div>
      </div>
    </header>
  );
};
