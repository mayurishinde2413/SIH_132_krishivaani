// frontend/src/components/cropRescue/ActiveCasesList.tsx
import React from 'react';
import { CaseCard, RescueCaseData } from './CaseCard';

interface ActiveCasesListProps {
  cases: RescueCaseData[];
  isLoading: boolean;
  updatingId: number | null;
  onStatusChange: (id: number, newStatus: string) => void;
}

const STATUS_ORDER = { OPEN: 0, IN_PROGRESS: 1, RESOLVED: 2 };

export const ActiveCasesList: React.FC<ActiveCasesListProps> = ({
  cases,
  isLoading,
  updatingId,
  onStatusChange,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map(i => (
          <div key={i} className="bg-white rounded-3xl p-5 animate-pulse border border-gray-100">
            <div className="h-5 bg-gray-200 rounded-xl w-1/2 mb-3" />
            <div className="h-4 bg-gray-100 rounded-xl w-full mb-2" />
            <div className="h-4 bg-gray-100 rounded-xl w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (!cases.length) {
    return (
      <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-10 text-center">
        <div className="text-5xl mb-3">🌿</div>
        <div className="text-gray-500 font-medium">No rescue cases found.</div>
        <div className="text-sm text-gray-400 mt-1">Use the form above to report an emergency.</div>
      </div>
    );
  }

  // Sort: Open first, then In Progress, then Resolved; within each group newest first
  const sorted = [...cases].sort((a, b) => {
    const statusDiff = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
    if (statusDiff !== 0) return statusDiff;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Group counts for summary strip
  const open = cases.filter(c => c.status === 'OPEN').length;
  const inProgress = cases.filter(c => c.status === 'IN_PROGRESS').length;
  const resolved = cases.filter(c => c.status === 'RESOLVED').length;

  return (
    <div>
      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-red-50 rounded-2xl p-3 text-center">
          <div className="text-2xl font-bold text-red-700">{open}</div>
          <div className="text-xs text-red-500 font-medium">Open</div>
        </div>
        <div className="bg-amber-50 rounded-2xl p-3 text-center">
          <div className="text-2xl font-bold text-amber-700">{inProgress}</div>
          <div className="text-xs text-amber-500 font-medium">In Progress</div>
        </div>
        <div className="bg-green-50 rounded-2xl p-3 text-center">
          <div className="text-2xl font-bold text-green-700">{resolved}</div>
          <div className="text-xs text-green-500 font-medium">Resolved</div>
        </div>
      </div>

      {/* Case cards */}
      <div className="space-y-4">
        {sorted.map(c => (
          <CaseCard
            key={c.id}
            caseData={c}
            onStatusChange={onStatusChange}
            isUpdating={updatingId === c.id}
          />
        ))}
      </div>
    </div>
  );
};
