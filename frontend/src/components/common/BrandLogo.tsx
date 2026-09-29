import React from 'react';

interface BrandLogoProps {
  /** 'light' = white text (for dark/image backgrounds), 'dark' = slate text (for white backgrounds) */
  variant?: 'light' | 'dark';
  /** Show the "Farmer-First Platform" tagline below the name */
  showTagline?: boolean;
  /** Optional icon style container */
  iconStyle?: 'glass' | 'solid';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * KrishiVaani Global Brand Logo
 * Uses the official Image 2 logo asset consistently across:
 * - Login Page (Hero section)
 * - Farmer Dashboard Header (All modules: Price Discovery, Net Realisation, FPO, Sell/Wait, Buyer Matching, Crop Rescue)
 * - Registration & Public Header
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'dark',
  showTagline = true,
  className = '',
  size = 'md',
}) => {
  const isLight = variant === 'light';

  const logoDimension =
    size === 'sm' ? 'w-9 h-9' : size === 'lg' ? 'w-14 h-14' : 'w-11 h-11';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official KrishiVaani Logo Image (IMAGE 2) */}
      <div
        className={`
          ${logoDimension} rounded-2xl overflow-hidden shrink-0 flex items-center justify-center p-1 bg-white shadow-sm border border-slate-200/90 transition-transform group-hover:scale-105
        `}
      >
        <img
          src="/krishivaani-logo.png"
          alt="KrishiVaani Logo"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-2">
          <span
            className={`text-xl sm:text-2xl font-black tracking-tight font-sans leading-none ${
              isLight ? 'text-white' : 'text-slate-900'
            }`}
          >
            KrishiVaani
          </span>
          <span
            className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
              isLight
                ? 'bg-emerald-400/20 text-emerald-200 border border-emerald-400/30'
                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}
          >
            Farmer-First
          </span>
        </div>
        {showTagline && (
          <p
            className={`text-xs font-medium mt-1 leading-none tracking-normal ${
              isLight ? 'text-emerald-200/90' : 'text-slate-500'
            }`}
          >
            Farmer-First Platform
          </p>
        )}
      </div>
    </div>
  );
};

export default BrandLogo;
