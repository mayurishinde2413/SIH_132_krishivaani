import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { ChevronLeft, ChevronRight, TrendingUp, Receipt, Users, Clock, Handshake, AlertTriangle } from 'lucide-react';

export interface ModuleTab {
  id: string;
  number: string;
  nameKey: string;
  fallbackName: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const FARMER_MODULES: ModuleTab[] = [
  {
    id: 'price-discovery',
    number: '01',
    nameKey: 'priceDiscovery',
    fallbackName: 'Price Discovery',
    path: '/farmer/price-discovery',
    icon: TrendingUp,
  },
  {
    id: 'net-realisation',
    number: '02',
    nameKey: 'netRealisation',
    fallbackName: 'Net Realisation',
    path: '/farmer/net-realisation',
    icon: Receipt,
  },
  {
    id: 'fpo-aggregation',
    number: '03',
    nameKey: 'fpoAggregation',
    fallbackName: 'FPO Aggregation',
    path: '/farmer/fpo',
    icon: Users,
  },
  {
    id: 'sell-wait',
    number: '04',
    nameKey: 'sellWait',
    fallbackName: 'Sell Now / Wait',
    path: '/farmer/sell-wait',
    icon: Clock,
  },
  {
    id: 'buyer-matching',
    number: '05',
    nameKey: 'buyerMatching',
    fallbackName: 'Buyer Matching & Bidding',
    path: '/farmer/buyer-matching',
    icon: Handshake,
  },
  {
    id: 'crop-rescue',
    number: '06',
    nameKey: 'cropRescue',
    fallbackName: 'Crop Rescue',
    path: '/farmer/crop-rescue',
    icon: AlertTriangle,
  },
];

/**
 * Vertical left-side module navigation.
 * On small screens it collapses to icon-only mode with a toggle button.
 */
export const FarmerModuleNav: React.FC = () => {
  const { t } = useLanguage();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`
        relative flex flex-col bg-white border-r border-slate-200/90 shadow-[2px_0_4px_rgba(0,0,0,0.03)]
        transition-all duration-200 shrink-0
        ${collapsed ? 'w-14' : 'w-52'}
      `}
    >
      {/* Modules Label */}
      {!collapsed && (
        <div className="px-4 pt-4 pb-2">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
            Modules
          </span>
        </div>
      )}

      {/* Nav Links */}
      <nav className="flex-1 flex flex-col gap-1 px-2 py-2">
        {FARMER_MODULES.map((module) => {
          const Icon = module.icon;
          return (
            <NavLink
              key={module.id}
              to={module.path}
              title={t(module.nameKey, module.fallbackName)}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  collapsed ? 'justify-center' : ''
                } ${
                  isActive
                    ? 'bg-forest-800 text-white shadow-sm shadow-forest-900/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Module number badge */}
                  {!collapsed && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md shrink-0 ${
                        isActive
                          ? 'bg-white/20 text-emerald-200 font-bold'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {module.number}
                    </span>
                  )}

                  {/* Icon */}
                  <Icon
                    className={`shrink-0 ${collapsed ? 'w-5 h-5' : 'w-4 h-4'} ${
                      isActive ? 'text-emerald-300' : 'text-slate-400'
                    }`}
                  />

                  {/* Label — hidden when collapsed */}
                  {!collapsed && (
                    <span className="leading-tight truncate">
                      {t(module.nameKey, module.fallbackName)}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse / Expand Toggle */}
      <button
        type="button"
        aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
        onClick={() => setCollapsed((prev) => !prev)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-all"
      >
        {collapsed ? (
          <ChevronRight className="w-3.5 h-3.5" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5" />
        )}
      </button>
    </aside>
  );
};
