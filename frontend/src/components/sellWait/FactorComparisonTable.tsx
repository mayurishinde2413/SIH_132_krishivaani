import React from 'react';
import { ComparisonFactorItem } from '../../types/sellWait';

interface FactorComparisonTableProps {
  factors: ComparisonFactorItem[];
}

export const FactorComparisonTable: React.FC<FactorComparisonTableProps> = ({ factors }) => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-forest-800 text-white flex items-center justify-center text-xs font-black">
            4
          </span>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
            Why? Factor-by-Factor Comparison
          </h3>
        </div>
        <span className="text-[11px] font-bold text-slate-400">Side-by-side check</span>
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              <th className="py-3 px-3">Decision Factor</th>
              <th className="py-3 px-3">Sell Now</th>
              <th className="py-3 px-3">Wait (5 Days)</th>
              <th className="py-3 px-4">What it Means for You</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-semibold">
            {factors.map((f, i) => (
              <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3.5 px-3 text-slate-900 font-extrabold">
                  {f.factor}
                </td>
                <td className="py-3.5 px-3 text-emerald-800 font-bold">
                  {f.sellNow}
                </td>
                <td className="py-3.5 px-3 text-slate-700 font-medium">
                  {f.wait}
                </td>
                <td className="py-3.5 px-4 text-slate-500 font-normal text-[11px]">
                  {f.meaning}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
