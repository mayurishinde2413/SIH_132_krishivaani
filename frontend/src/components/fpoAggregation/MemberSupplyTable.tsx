import React from 'react';
import { Check, Lock, AlertTriangle, MapPin, SlidersHorizontal } from 'lucide-react';
import { FPOMemberItem } from '../../types/fpoAggregation';

interface MemberSupplyTableProps {
  members: FPOMemberItem[];
  selectedMemberIds: number[];
  allocations: Record<number, number>; // farmerId -> allocated quintals
  onToggleMember: (farmerId: number) => void;
  onUpdateAllocation: (farmerId: number, qty: number) => void;
  pricePerQuintal: number;
}

export const MemberSupplyTable: React.FC<MemberSupplyTableProps> = ({
  members,
  selectedMemberIds,
  allocations,
  onToggleMember,
  onUpdateAllocation,
  pricePerQuintal,
}) => {
  const pricePerKg = pricePerQuintal / 100;

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
      {/* Table Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              MEMBER ALLOCATION
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
            Available FPO Member Supply (Baramati Cluster)
          </h3>
          <p className="text-xs text-slate-500">
            Select eligible member farmers to bundle into this institutional consignment lot.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            Cluster Radius: 20 KM
          </span>
          <button
            type="button"
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
            title="Filter options"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse text-xs font-semibold">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              <th className="py-3 px-3">Select</th>
              <th className="py-3 px-3">Farmer Details & ID</th>
              <th className="py-3 px-3">Commodity & Grade</th>
              <th className="py-3 px-3">Location & Proximity</th>
              <th className="py-3 px-2 text-right">Available Qty</th>
              <th className="py-3 px-3 text-center">Allocated to Lot</th>
              <th className="py-3 px-3 text-right">Farmer Payout (₹) (@ ₹{pricePerKg.toFixed(0)}/kg)</th>
              <th className="py-3 px-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {members.map((m) => {
              const isSelected = selectedMemberIds.includes(m.farmerId);
              const isEligible = m.isEligible;
              const allocated = allocations[m.farmerId] || 0;
              const payout = Math.round(allocated * pricePerQuintal * 0.98); // 2% reserve retained

              return (
                <tr
                  key={m.farmerId}
                  className={`transition-colors ${
                    !isEligible
                      ? 'bg-slate-50/50 opacity-70'
                      : isSelected
                      ? 'bg-emerald-50/40'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  {/* Checkbox */}
                  <td className="py-3.5 px-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={!isEligible}
                      onChange={() => onToggleMember(m.farmerId)}
                      className="w-4 h-4 rounded text-forest-800 focus:ring-forest-600 cursor-pointer disabled:cursor-not-allowed"
                    />
                  </td>

                  {/* Farmer Details */}
                  <td className="py-3.5 px-3">
                    <div className="flex flex-col">
                      <span className="font-extrabold text-slate-900">{m.name}</span>
                      <span className="text-[10px] text-slate-400">
                        {m.fpoCode} • {m.membershipTier}
                      </span>
                    </div>
                  </td>

                  {/* Commodity & Quality Grade */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-slate-800 font-bold">{m.cropName}</span>
                      {isEligible ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> Exact Match ({m.qualityGrade})
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                          {m.qualityGrade} (Requires Grade A)
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Location & Proximity */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-1 text-slate-600 text-xs">
                      <MapPin className="w-3.5 h-3.5 text-forest-600 shrink-0" />
                      <span>{m.proximityLabel}</span>
                    </div>
                  </td>

                  {/* Available Quantity */}
                  <td className="py-3.5 px-2 text-right font-bold text-slate-800">
                    {m.availableQtyQuintals} Quintals
                  </td>

                  {/* Allocated Input box */}
                  <td className="py-3.5 px-3 text-center">
                    {isEligible ? (
                      <div className="inline-flex items-center gap-1">
                        <input
                          type="number"
                          min={0}
                          max={m.availableQtyQuintals}
                          value={allocated}
                          disabled={!isSelected}
                          onChange={(e) =>
                            onUpdateAllocation(
                              m.farmerId,
                              Math.min(m.availableQtyQuintals, Math.max(0, parseFloat(e.target.value) || 0))
                            )
                          }
                          className="w-16 text-center py-1 rounded-lg border border-slate-200 bg-white font-black text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-forest-600/20 disabled:bg-slate-100"
                        />
                        <span className="text-[10px] text-slate-400 font-bold">Q</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs font-bold">0 Q (Ineligible)</span>
                    )}
                  </td>

                  {/* Farmer Payout */}
                  <td className="py-3.5 px-3 text-right">
                    <span className="font-extrabold text-slate-900 text-sm">
                      ₹{payout.toLocaleString('en-IN')}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-3 text-center">
                    {isEligible ? (
                      isSelected ? (
                        <span className="px-2 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                          Allocated ({allocated} Q)
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                          Ready to Pool
                        </span>
                      )
                    ) : (
                      <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-slate-200 text-slate-500 inline-flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Ineligibility Warning Footnote */}
      <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-[11px] text-amber-900 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
        <span>
          <strong>Quality Protocol Notice:</strong> Grade B produce cannot be mixed with Grade A buyer contract lots under e-NAM procurement regulations.
        </span>
      </div>
    </div>
  );
};
