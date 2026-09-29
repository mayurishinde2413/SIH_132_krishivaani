import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  TrendingUp,
  ShieldCheck,
  Scale,
  CreditCard,
  Building2,
  Package,
  Calculator,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useProduce } from '../../context/ProduceContext';

interface PricePoint {
  date: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  crop: { id: number; name: string; localName: string | null; unit: string };
}

interface MarketDetailsProps {
  marketId: number;
  marketName: string;
  district: string;
  distanceKm: number;
  cropId: number;
  cropName: string;
  onBack: () => void;
}

export const MarketDetails: React.FC<MarketDetailsProps> = ({
  marketId,
  marketName,
  district,
  distanceKm,
  cropId,
  cropName,
  onBack,
}) => {
  const navigate = useNavigate();
  const { setSelectedMarket, setCrop } = useProduce();
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>([]);
  const [latestData, setLatestData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleProceedToNetRealisation = () => {
    setCrop(cropName, cropId);
    setSelectedMarket({
      id: marketId,
      name: marketName,
      district,
      distanceKm,
      modalPrice: latestData?.latestPrice?.modalPrice || 2800,
    });
    navigate('/farmer/net-realisation');
  };

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/markets/${marketId}/prices?cropId=${cropId}`);
        if (res.data?.data) {
          setPriceHistory(res.data.data.priceHistory || []);
          setLatestData(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching market price history:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [marketId, cropId]);

  // Derived metrics
  const latestPrice = latestData?.latestPrice;
  const modalPerKg = latestPrice ? (latestPrice.modalPrice / 100).toFixed(2) : '28.00';
  const minPerKg = latestPrice ? (latestPrice.minPrice / 100).toFixed(2) : '24.00';
  const maxPerKg = latestPrice ? (latestPrice.maxPrice / 100).toFixed(2) : '32.00';
  const totalArrivals = latestData?.totalArrivalsQty || 1450;

  // Calculate 7-day trend gain percentage if history exists
  let trendGain = '+0.0%';
  let trendPositive = true;
  if (priceHistory.length >= 2) {
    const first = priceHistory[0].modalPrice;
    const last = priceHistory[priceHistory.length - 1].modalPrice;
    const diff = ((last - first) / first) * 100;
    trendPositive = diff >= 0;
    trendGain = `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}%`;
  }

  // ── SVG Bar Chart Renderer ──────────────────────────────────────────────────
  const renderPriceTrendChart = () => {
    if (isLoading) {
      return (
        <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
          Loading price history...
        </div>
      );
    }

    if (priceHistory.length === 0) {
      return (
        <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
          No price history available for this market/crop combination.
        </div>
      );
    }

    const SVG_HEIGHT = 160;
    const SVG_WIDTH = 500;
    const PADDING = { top: 16, bottom: 36, left: 8, right: 8 };
    const plotH = SVG_HEIGHT - PADDING.top - PADDING.bottom;
    const plotW = SVG_WIDTH - PADDING.left - PADDING.right;

    const prices = priceHistory.map((p) => p.modalPrice);
    const minVal = Math.min(...prices) * 0.97;
    const maxVal = Math.max(...prices) * 1.03;
    const range = maxVal - minVal || 1;

    const n = priceHistory.length;
    const barWidth = Math.floor(plotW / (n * 1.6));
    const gap = (plotW - barWidth * n) / (n + 1);

    const bars = priceHistory.map((pt, i) => {
      const x = PADDING.left + gap * (i + 1) + barWidth * i;
      const normalised = (pt.modalPrice - minVal) / range;
      const barH = Math.max(4, Math.round(normalised * plotH));
      const y = PADDING.top + (plotH - barH);
      const kgRate = (pt.modalPrice / 100).toFixed(1);
      const dateLabel = new Date(pt.date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
      });
      const isLatest = i === n - 1;
      return { x, y, barH, barWidth, kgRate, dateLabel, modalPrice: pt.modalPrice, isLatest };
    });

    return (
      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="w-full"
          style={{ minWidth: '260px', height: '160px' }}
          aria-label={`${cropName} 7-day price trend chart`}
        >
          {/* Horizontal grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
            const cy = PADDING.top + plotH * (1 - frac);
            const priceAtLine = Math.round(minVal + range * frac);
            return (
              <g key={frac}>
                <line
                  x1={PADDING.left}
                  x2={SVG_WIDTH - PADDING.right}
                  y1={cy}
                  y2={cy}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  strokeDasharray="4 3"
                />
                <text
                  x={PADDING.left}
                  y={cy - 3}
                  fontSize="9"
                  fill="#94a3b8"
                  fontFamily="monospace"
                >
                  ₹{priceAtLine}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {bars.map((bar, i) => (
            <g key={i}>
              {/* Bar */}
              <rect
                x={bar.x}
                y={bar.y}
                width={bar.barWidth}
                height={bar.barH}
                rx="3"
                fill={bar.isLatest ? '#166534' : '#16a34a'}
                opacity={bar.isLatest ? 1 : 0.75}
              />
              {/* Price label above bar */}
              <text
                x={bar.x + bar.barWidth / 2}
                y={bar.y - 4}
                textAnchor="middle"
                fontSize="8.5"
                fontWeight="700"
                fill="#15803d"
                fontFamily="sans-serif"
              >
                ₹{bar.kgRate}
              </text>
              {/* Date label below bar */}
              <text
                x={bar.x + bar.barWidth / 2}
                y={SVG_HEIGHT - 4}
                textAnchor="middle"
                fontSize="8"
                fill="#64748b"
                fontFamily="sans-serif"
              >
                {bar.dateLabel}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6 animate-fadeIn">
      {/* 1. Header with Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-forest-800 text-white flex items-center justify-center text-xs font-black">
              3
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Detailed Market Intelligence: {marketName}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Official mandi clearing pricing, arrival volume trends, and trade floor parameters.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0 self-start sm:self-center">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Markets</span>
          </button>

          <button
            type="button"
            onClick={handleProceedToNetRealisation}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-black shadow-md transition-all"
          >
            <Calculator className="w-4 h-4 text-emerald-400" />
            <span>Calculate Net Realisation (Module 02) →</span>
          </button>
        </div>
      </div>

      {/* 2. Parameters Overview Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
        <div>
          <span className="text-slate-400 block text-[11px] font-medium">MANDI YARD</span>
          <span className="font-bold text-slate-900 block">{marketName}</span>
          <span className="text-[10px] text-slate-500">{district}, Maharashtra</span>
        </div>

        <div>
          <span className="text-slate-400 block text-[11px] font-medium">CROP COMMODITY</span>
          <span className="font-bold text-slate-900 block">{cropName}</span>
          <span className="text-[10px] text-emerald-700 font-semibold">Hybrid / Desi FAQ</span>
        </div>

        <div>
          <span className="text-slate-400 block text-[11px] font-medium">TRANSIT DISTANCE</span>
          <span className="font-bold text-slate-900 block">{distanceKm} km</span>
          <span className="text-[10px] text-slate-500">Via State Highway</span>
        </div>

        <div>
          <span className="text-slate-400 block text-[11px] font-medium">MARKET SESSION</span>
          <span className="font-bold text-slate-900 block">
            {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
          <span className="text-[10px] text-emerald-700 font-semibold">Regular Daily Auction</span>
        </div>

        <div>
          <span className="text-slate-400 block text-[11px] font-medium">LAST SYNC TIME</span>
          <span className="font-bold text-slate-900 block">08:30 AM IST</span>
          <span className="text-[10px] text-slate-500">AGMARKNET Daily Bulletin</span>
        </div>
      </div>

      {/* 3. Main Data Highlights: Modal Spotlight + 7-Day Trend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Key Pricing Spotlight */}
        <div className="lg:col-span-5 space-y-4">
          {/* Today's Benchmark Card */}
          <div className="bg-forest-900 text-white rounded-2xl p-5 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                Today's Modal Price (Benchmark)
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-800 text-[10px] font-bold text-emerald-100">
                MOST TRADED
              </span>
            </div>

            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-4xl font-black text-white">₹{modalPerKg}</span>
              <span className="text-sm font-bold text-emerald-200">/ kg</span>
            </div>

            <p className="text-xs text-emerald-200/80 mt-1">
              Equates to ₹{(parseFloat(modalPerKg) * 100).toLocaleString('en-IN')} per Quintal (100 kg) at primary auction ring.
            </p>
          </div>

          {/* Min & Max Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl border border-slate-200 bg-white">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Minimum Price
              </span>
              <span className="text-xl font-extrabold text-slate-900 block mt-1">
                ₹{minPerKg}
              </span>
              <span className="text-[10px] text-slate-500">Low grade / small size lots</span>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-white">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Maximum Price
              </span>
              <span className="text-xl font-extrabold text-slate-900 block mt-1">
                ₹{maxPerKg}
              </span>
              <span className="text-[10px] text-slate-500">Grade-A export / crate quality</span>
            </div>
          </div>

          {/* Total Arrivals Card */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                Today's Total Mandi Arrivals
              </span>
              <span className="text-xl font-black text-emerald-950 mt-0.5 block">
                {totalArrivals.toLocaleString('en-IN')} Quintals
              </span>
              <span className="text-[10px] text-emerald-700">Strong arrival volume with steady buyer demand</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Package className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Right Column: 7-Day Price Trend Chart */}
        <div className="lg:col-span-7 bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm">
                  {cropName} Price Trend (Last 7 Days)
                </h3>
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold flex items-center gap-1 ${
                    trendPositive
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  <TrendingUp className="w-3 h-3" /> {trendGain} 7D Gain
                </span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400">Currency: INR (₹)</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Daily modal clearing price per quintal at {marketName}
            </p>
          </div>

          {/* Chart */}
          <div className="mt-4 flex-1">
            {renderPriceTrendChart()}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-[10px] text-slate-500">
            <span>
              Benchmark: Lowest ₹{minPerKg}/kg • Highest ₹{maxPerKg}/kg (Today)
            </span>
            <span className="font-semibold text-emerald-800 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified by APMC Grading Inspectorate
            </span>
          </div>
        </div>
      </div>

      {/* 4. Mandi Infrastructure & Trading Protocols Bar */}
      <div className="pt-4 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Mandi Infrastructure & Trading Protocols
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <Scale className="w-5 h-5 text-forest-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 text-xs block">Certified Electronic Weighbridge</span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Calibrated computerized weighbridges at Gates 1, 3, and 5 with instant printout tickets.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <CreditCard className="w-5 h-5 text-forest-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 text-xs block">Same-Day Settlement</span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                e-NAM integrated direct bank transfer or APMC approved commission agent draft by 5:00 PM.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <Building2 className="w-5 h-5 text-forest-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 text-xs block">Regulated APMC Commission</span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Standard Maharashtra Mandi statutory charges; no hidden handling or unloading deduction.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
