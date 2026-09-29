import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { getCropIcon } from '../../utils/cropIcon';

interface Crop {
  id: number;
  name: string;
  localName: string | null;
  category: string | null;
  unit: string;
}

interface CropCardProps {
  crop: Crop;
  isSelected: boolean;
  onClick: (crop: Crop) => void;
}

export const CropCard: React.FC<CropCardProps> = ({ crop, isSelected, onClick }) => {
  const emoji = getCropIcon(crop.name);

  return (
    <button
      type="button"
      onClick={() => onClick(crop)}
      className={`relative flex flex-col items-center gap-2 py-4 px-3 rounded-2xl border-2 transition-all duration-150 min-w-[88px] text-center group ${
        isSelected
          ? 'bg-forest-800 border-forest-800 text-white shadow-lg shadow-forest-900/15 scale-105'
          : 'bg-white border-slate-200 text-slate-700 hover:border-forest-400 hover:shadow-md hover:scale-[1.03]'
      }`}
    >
      {isSelected && (
        <span className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-400 rounded-full flex items-center justify-center ring-2 ring-white shadow">
          <CheckCircle2 className="w-3 h-3 text-white fill-white" />
        </span>
      )}

      <span className="text-3xl leading-none">{emoji}</span>

      <div>
        <p className={`text-xs font-bold leading-tight ${isSelected ? 'text-white' : 'text-slate-800'}`}>
          {crop.name}
        </p>
        {crop.localName && (
          <p className={`text-[10px] font-medium ${isSelected ? 'text-emerald-200' : 'text-slate-500'}`}>
            {crop.localName}
          </p>
        )}
      </div>
    </button>
  );
};
