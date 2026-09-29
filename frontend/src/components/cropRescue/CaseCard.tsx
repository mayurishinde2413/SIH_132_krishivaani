// frontend/src/components/cropRescue/CaseCard.tsx
import React from 'react';
import { getCropIcon } from '../../utils/cropIcon';

export interface RescueCaseData {
  id: number;
  description: string;
  quantity: number | null;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  resolvedAt: string | null;
  createdAt: string;
  crop: { id: number; name: string; localName?: string };
}

interface CaseCardProps {
  caseData: RescueCaseData;
  onStatusChange?: (id: number, newStatus: string) => void;
  isUpdating?: boolean;
}

const STATUS_CONFIG = {
  OPEN:        { label: 'Open',        bg: 'bg-red-100',    text: 'text-red-700',    dot: 'bg-red-500',    icon: '🔴' },
  IN_PROGRESS: { label: 'In Progress', bg: 'bg-amber-100',  text: 'text-amber-700',  dot: 'bg-amber-500',  icon: '🟡' },
  RESOLVED:    { label: 'Resolved',    bg: 'bg-green-100',  text: 'text-green-700',  dot: 'bg-green-500',  icon: '🟢' },
};

const NEXT_STATUS: Record<string, string> = {
  OPEN:        'IN_PROGRESS',
  IN_PROGRESS: 'RESOLVED',
};

const NEXT_LABEL: Record<string, string> = {
  OPEN:        'Mark In Progress',
  IN_PROGRESS: 'Mark Resolved',
};

// Extract problem type from description prefix [Crop Disease] ...
function parseProblemType(description: string): { type: string; text: string } {
  const match = description.match(/^\[([^\]]+)\]\s*(.*)/s);
  if (match) return { type: match[1], text: match[2] };
  return { type: 'Other', text: description };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export const CaseCard: React.FC<CaseCardProps> = ({ caseData, onStatusChange, isUpdating }) => {
  const statusCfg = STATUS_CONFIG[caseData.status];
  const { type, text } = parseProblemType(caseData.description);
  const nextStatus = NEXT_STATUS[caseData.status];

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-forest-50 rounded-2xl flex items-center justify-center text-2xl">
            {getCropIcon(caseData.crop.name)}
          </div>
          <div>
            <div className="font-bold text-gray-800 text-base">{caseData.crop.name}</div>
            <div className="text-xs text-gray-400">Case #{caseData.id}</div>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusCfg.bg} ${statusCfg.text}`}>
          <span className={`w-2 h-2 rounded-full ${statusCfg.dot}`} />
          {statusCfg.label}
        </span>
      </div>

      {/* Problem type chip */}
      <div className="mb-3">
        <span className="inline-block bg-red-50 text-red-600 text-xs font-semibold px-3 py-1 rounded-full">
          ⚠️ {type}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{text}</p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 rounded-2xl p-3 text-center">
          <div className="text-lg font-bold text-forest-800">
            {caseData.quantity != null ? caseData.quantity : '—'} qtl
          </div>
          <div className="text-xs text-gray-500">Affected Qty</div>
        </div>
        <div className="bg-gray-50 rounded-2xl p-3 text-center">
          <div className="text-sm font-bold text-gray-700">{formatDate(caseData.createdAt)}</div>
          <div className="text-xs text-gray-500">Reported On</div>
        </div>
      </div>

      {/* Resolved date */}
      {caseData.status === 'RESOLVED' && caseData.resolvedAt && (
        <div className="bg-green-50 rounded-2xl px-4 py-2 mb-4 text-xs text-green-700 font-medium">
          ✅ Resolved on {formatDate(caseData.resolvedAt)}
        </div>
      )}

      {/* Action button */}
      {nextStatus && onStatusChange && (
        <button
          onClick={() => onStatusChange(caseData.id, nextStatus)}
          disabled={isUpdating}
          className="w-full border border-forest-700 text-forest-800 hover:bg-forest-50 disabled:opacity-60 font-semibold py-2.5 rounded-2xl text-sm transition-colors"
        >
          {isUpdating ? '⏳ Updating...' : NEXT_LABEL[caseData.status]}
        </button>
      )}
    </div>
  );
};
