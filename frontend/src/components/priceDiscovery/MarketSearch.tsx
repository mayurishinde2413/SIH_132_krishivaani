import React, { useState } from 'react';
import { Search, MapPin, ExternalLink, Building2 } from 'lucide-react';
import api from '../../services/api';

interface SearchMarketItem {
  id: number;
  name: string;
  district: string;
  state: string;
  type: string | null;
}

interface MarketSearchProps {
  onSelectMarket: (market: SearchMarketItem) => void;
}

export const MarketSearch: React.FC<MarketSearchProps> = ({ onSelectMarket }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchMarketItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const majorHubs = [
    { name: 'Vashi APMC (Navi Mumbai)', district: 'Thane', dist: '110 km' },
    { name: 'Kolhapur APMC', district: 'Kolhapur', dist: '135 km' },
    { name: 'Ahmednagar APMC', district: 'Ahmednagar', dist: '78 km' },
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || query.trim().length < 2) return;

    setIsSearching(true);
    setHasSearched(true);
    try {
      const res = await api.get(`/markets/search?q=${encodeURIComponent(query.trim())}`);
      if (res.data?.data) {
        setResults(res.data.data);
      }
    } catch (err) {
      console.error('Error searching markets:', err);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
          <Search className="w-4 h-4" />
        </div>
        <div>
          <h4 className="font-bold text-slate-900 text-sm">Can't find your market?</h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Search all 300+ APMC Mandis across Maharashtra & Interstate trade corridors beyond your current radius filter.
          </p>
        </div>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search Market Name (e.g. Kolhapur, Vashi, Nashik)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-600"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        <button
          type="submit"
          disabled={isSearching || query.trim().length < 2}
          className="px-4 py-2.5 bg-forest-800 hover:bg-forest-900 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shrink-0 shadow-sm"
        >
          {isSearching ? 'Searching...' : 'Search Market'}
        </button>
      </form>

      {/* Search Results Dropdown / List */}
      {hasSearched && (
        <div className="pt-2 border-t border-slate-100">
          {results.length === 0 ? (
            <p className="text-xs text-slate-500 py-2">No mandis found matching "{query}".</p>
          ) : (
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {results.map((m) => (
                <div
                  key={m.id}
                  onClick={() => onSelectMarket(m)}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-forest-50 cursor-pointer text-xs transition-colors group"
                >
                  <span className="font-bold text-slate-800 group-hover:text-forest-800">
                    {m.name} ({m.district})
                  </span>
                  <span className="text-[11px] text-forest-700 font-semibold flex items-center gap-1">
                    Select <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Frequently Checked Major Hubs from screenshot */}
      <div className="pt-3 border-t border-slate-100">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
          Frequently Checked Major Hubs:
        </span>
        <div className="flex flex-wrap gap-2">
          {majorHubs.map((hub) => (
            <button
              key={hub.name}
              type="button"
              onClick={() => {
                setQuery(hub.name.split(' ')[0]);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-[11px] font-semibold transition-colors flex items-center gap-1.5"
            >
              <span>{hub.name}</span>
              <span className="text-slate-400 font-normal">{hub.dist}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
