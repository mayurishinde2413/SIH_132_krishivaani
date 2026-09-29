import React from 'react';
import { Outlet } from 'react-router-dom';
import { FarmerHeader } from './FarmerHeader';
import { FarmerModuleNav } from './FarmerModuleNav';
import { FarmerFooter } from './FarmerFooter';

interface FarmerDashboardLayoutProps {
  children?: React.ReactNode;
}

export const FarmerDashboardLayout: React.FC<FarmerDashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      {/* 1. Universal Farmer Header — full width across top */}
      <FarmerHeader />

      {/* 2. Body: Left sidebar + Right content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Vertical Module Navigation */}
        <FarmerModuleNav />

        {/* Right: Module Content Area — scrollable */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children || <Outlet />}
          </div>
        </main>
      </div>

      {/* 3. Official Compliance & Helpline Footer */}
      <FarmerFooter />
    </div>
  );
};
