import React from 'react';
import { UserRole } from '../../context/AuthContext';
import { Sprout, ShoppingBag } from 'lucide-react';

interface RoleSelectorProps {
  selectedRole: UserRole;
  onChange: (role: UserRole) => void;
  className?: string;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRole,
  onChange,
  className = '',
}) => {
  return (
    <div className={`grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl ${className}`}>
      <button
        type="button"
        onClick={() => onChange('FARMER')}
        className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
          selectedRole === 'FARMER'
            ? 'bg-white text-emerald-800 shadow-sm shadow-slate-200 ring-1 ring-slate-900/5'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
        }`}
      >
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
            selectedRole === 'FARMER'
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-slate-200 text-slate-500'
          }`}
        >
          <Sprout className="w-4 h-4" />
        </div>
        <span>Farmer</span>
      </button>

      <button
        type="button"
        onClick={() => onChange('BUYER')}
        className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
          selectedRole === 'BUYER'
            ? 'bg-white text-blue-800 shadow-sm shadow-slate-200 ring-1 ring-slate-900/5'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
        }`}
      >
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
            selectedRole === 'BUYER'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-slate-200 text-slate-500'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
        </div>
        <span>Buyer / Trader</span>
      </button>
    </div>
  );
};
