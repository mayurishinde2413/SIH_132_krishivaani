// frontend/src/components/cropRescue/RaiseRescueForm.tsx
import React, { useEffect, useState } from 'react';
import { getCropIcon } from '../../utils/cropIcon';

interface Crop {
  id: number;
  name: string;
  localName?: string;
}

interface RaiseRescueFormProps {
  onSubmit: (data: {
    cropId: number;
    cropName: string;
    problemType: string;
    quantity: number;
    description: string;
  }) => void;
  isLoading: boolean;
}

const PROBLEM_TYPES = [
  { value: 'Crop Disease',     label: '🦠 Crop Disease',      desc: 'Fungal, bacterial or viral infection' },
  { value: 'Pest Attack',      label: '🐛 Pest Attack',        desc: 'Insect or pest infestation' },
  { value: 'Natural Disaster', label: '🌪️ Natural Disaster',   desc: 'Flood, drought, hail or storm' },
  { value: 'Market Glut',      label: '📉 Market Glut',        desc: 'Oversupply causing price crash' },
  { value: 'Storage Failure',  label: '🏚️ Storage Failure',    desc: 'Cold chain or godown breakdown' },
  { value: 'Other',            label: '⚠️ Other Emergency',    desc: 'Any other urgent situation' },
];

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const RaiseRescueForm: React.FC<RaiseRescueFormProps> = ({ onSubmit, isLoading }) => {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [cropId, setCropId] = useState<number | ''>('');
  const [problemType, setProblemType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_BASE}/api/crops`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
    })
      .then(r => r.json())
      .then(json => setCrops(json.data || []))
      .catch(() => {});
  }, []);

  const selectedCrop = crops.find(c => c.id === cropId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropId || !problemType || !quantity || !description.trim()) {
      setError('Please fill all fields.');
      return;
    }
    setError('');
    onSubmit({
      cropId: cropId as number,
      cropName: selectedCrop?.name || '',
      problemType,
      quantity: parseFloat(quantity),
      description,
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 border border-red-100">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-2xl">
          🆘
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Raise Rescue Case</h2>
          <p className="text-sm text-gray-500">Report your crop emergency for immediate support</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-3 mb-4 text-red-700 text-sm">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Crop */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            🌱 Affected Crop
          </label>
          <select
            value={cropId}
            onChange={e => setCropId(parseInt(e.target.value, 10))}
            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-300"
            required
          >
            <option value="">Select crop...</option>
            {crops.map(c => (
              <option key={c.id} value={c.id}>
                {getCropIcon(c.name)} {c.name} {c.localName ? `(${c.localName})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Problem Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            ⚠️ Problem Type
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {PROBLEM_TYPES.map(pt => (
              <button
                key={pt.value}
                type="button"
                onClick={() => setProblemType(pt.value)}
                className={`rounded-2xl p-3 text-left text-xs font-medium border transition-all ${
                  problemType === pt.value
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-red-300'
                }`}
              >
                <div className="text-base mb-0.5">{pt.label}</div>
                <div className="text-gray-400 leading-tight">{pt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            📦 Quantity Affected (quintals)
          </label>
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
            placeholder="e.g. 25"
            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-300"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            📝 Describe the Emergency
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe what is happening with your crop..."
            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-bold py-4 rounded-2xl transition-colors text-base"
        >
          {isLoading ? '⏳ Submitting...' : '🆘 Submit Rescue Case'}
        </button>
      </form>
    </div>
  );
};
