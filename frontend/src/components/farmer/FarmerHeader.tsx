import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSelector } from '../common/LanguageSelector';
import { BrandLogo } from '../common/BrandLogo';
import { PhoneCall, Bell, MapPin, LogOut } from 'lucide-react';

export const FarmerHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const village = user?.farmer?.village;
  const district = user?.farmer?.district;
  const locationString = village && district ? `${village}, ${district}` : district || 'Maharashtra, India';

  return (
    <header className="w-full bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Left: KrishiVaani brand — uses shared BrandLogo */}
          <Link to="/farmer/price-discovery" className="group">
            <BrandLogo variant="dark" iconStyle="solid" showTagline={true} />
          </Link>

          {/* Right: Kisan helpline + Language + Notifications + Profile */}
          <div className="flex items-center gap-3 sm:gap-4">

            {/* Kisan Call Centre Badge - Exactly from uploaded screenshot */}
            <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50/70 text-slate-700">
              <PhoneCall className="w-4 h-4 text-emerald-700" />
              <div className="text-xs">
                <span className="text-slate-500 font-normal mr-1.5">{t('kisanCallCentre')}</span>
                <span className="font-extrabold text-slate-900 tracking-wide">1800–180–1551</span>
              </div>
            </div>

            {/* Language Selector: English | मराठी | हिंदी */}
            <LanguageSelector />

            {/* Notification Bell with alert pip */}
            <button
              type="button"
              className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-white" />
            </button>

            {/* Farmer Profile & Location Pill */}
            <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-200">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  {user?.name || 'Ramesh Baburao Patil'}
                </span>
                <span className="text-[11px] text-slate-500 flex items-center justify-end gap-0.5 font-medium">
                  <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                  {locationString}
                </span>
              </div>

              {/* Avatar circle */}
              <div className="w-9 h-9 rounded-full bg-forest-100 border border-forest-300 flex items-center justify-center text-forest-800 font-bold text-sm shadow-inner">
                {(user?.name ? user.name.charAt(0) : 'R').toUpperCase()}
              </div>

              {/* Logout button */}
              <button
                type="button"
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
