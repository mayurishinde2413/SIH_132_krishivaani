import React from 'react';
import { Download, CheckCircle2 } from 'lucide-react';
import { MarketNetResult } from '../../types/netRealisation';

interface MandiCostMatrixProps {
  markets: MarketNetResult[];
  quantityKg: number;
  cropName: string;
  selectedMarketId?: number;
  onSelectRow: (m: MarketNetResult) => void;
}

export const MandiCostMatrix: React.FC<MandiCostMatrixProps> = ({
  markets,
  quantityKg,
  cropName,
  selectedMarketId,
  onSelectRow,
}) => {
  const handleExportCSV = () => {
    const headers = [
      'Rank',
      'Market Name',
      'Quoted Price (Rs/kg)',
      'Distance (km)',
      'Gross Revenue (Rs)',
      'Transport Cost (Rs)',
      'Mandi Fees (Rs)',
      'Est Wastage (Rs)',
      'Quality Cut (Rs)',
      'Unloading (Rs)',
      'Expected Net Realisation (Rs)',
      'Net Return (Rs/kg)',
    ];

    const rows = markets.map((m) => [
      m.rank,
      `"${m.marketName}"`,
      m.quotedPricePerKg,
      m.distanceKm,
      m.breakdown.grossRevenue,
      m.breakdown.transportCost,
      m.breakdown.mandiFees,
      m.breakdown.expectedWastage,
      m.breakdown.qualityDeductions,
      m.breakdown.unloadingPorterage,
      m.breakdown.netRealisation,
      m.breakdown.netRealisationPerKg,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `KrishiVaani_Net_Realisation_${cropName}_${quantityKg}kg.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
      {/* Table Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
            Mandi Cost & Return Matrix
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Side-by-side decomposition for {quantityKg.toLocaleString('en-IN')} kg {cropName} consignment
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors self-start sm:self-center"
        >
          <Download className="w-3.5 h-3.5 text-forest-700" />
          <span>Export Audit CSV</span>
        </button>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              <th className="py-3 px-3">Mandi / Market Name</th>
              <th className="py-3 px-2">Quoted Price</th>
              <th className="py-3 px-2">Distance</th>
              <th className="py-3 px-2 text-right">Gross Revenue</th>
              <th className="py-3 px-2 text-right text-rose-500">Transport Cost</th>
              <th className="py-3 px-2 text-right text-rose-500">Market Cess</th>
              <th className="py-3 px-2 text-right text-rose-500">Est. Wastage</th>
              <th className="py-3 px-2 text-right text-rose-500">Quality Cut</th>
              <th className="py-3 px-3 text-right text-forest-800 font-black">Expected Net Realisation</th>
              <th className="py-3 px-3 text-right text-forest-800 font-black">Net Return / kg</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {markets.map((m) => {
              const isSelected = selectedMarketId === m.marketId;
              const isRecommended = m.isRecommended;

              return (
                <tr
                  key={m.marketId}
                  onClick={() => onSelectRow(m)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-forest-50/70 font-semibold'
                      : isRecommended
                      ? 'bg-emerald-50/30 hover:bg-emerald-50/60 font-medium'
                      : 'hover:bg-slate-50/80'
                  }`}
                >
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      {isRecommended && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-700 text-white text-[9px] font-extrabold uppercase">
                          RECOMMENDED
                        </span>
                      )}
                      <span className="font-bold text-slate-900">{m.marketName}</span>
                      <span className="text-slate-400 text-[10px]">({m.district})</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-2 font-bold text-slate-800">
                    ₹{m.quotedPricePerKg.toFixed(2)}/kg
                  </td>
                  <td className="py-3.5 px-2 text-slate-500">{m.distanceKm} km</td>
                  <td className="py-3.5 px-2 text-right font-bold text-slate-800">
                    ₹{m.breakdown.grossRevenue.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-2 text-right font-bold text-rose-600">
                    -₹{m.breakdown.transportCost.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-2 text-right font-bold text-rose-600">
                    -₹{m.breakdown.mandiFees.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-2 text-right font-bold text-rose-600">
                    -₹{m.breakdown.expectedWastage.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-2 text-right font-bold text-rose-600">
                    -₹{m.breakdown.qualityDeductions.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <span className="text-sm font-black text-forest-900">
                      ₹{m.breakdown.netRealisation.toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right font-black text-emerald-700">
                    ₹{m.breakdown.netRealisationPerKg}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-[10px] text-slate-400 text-right">
        * Statutory cess applied as per Maharashtra Agricultural Produce Marketing (Regulation) Act.
      </p>
    </div>
  );
};
