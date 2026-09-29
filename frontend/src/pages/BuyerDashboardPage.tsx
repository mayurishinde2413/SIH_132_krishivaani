import React, { useEffect, useState } from 'react';
import { Header } from '../components/common/Header';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Building2, Package, MapPin, Search, PlusCircle, CheckCircle } from 'lucide-react';
import { getCropIcon } from '../utils/cropIcon';

interface BuyerRequirement {
  id: number;
  quantityMin: number;
  quantityMax: number;
  targetPrice: number;
  district: string | null;
  deliveryDate: string | null;
  crop: { id: number; name: string; localName: string | null; unit: string };
  buyer: { id: number; companyName: string; user: { name: string } };
}

export const BuyerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [requirements, setRequirements] = useState<BuyerRequirement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        const res = await api.get('/buyer-requirements');
        if (res.data?.data) {
          setRequirements(res.data.data);
        }
      } catch (e) {
        console.error('Error fetching buyer requirements:', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequirements();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-blue-900/10 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="px-3 py-1 bg-white/15 rounded-full text-xs font-semibold tracking-wide uppercase">
                Buyer Procurement Portal
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold mt-2">
                Welcome, {user?.buyer?.companyName || user?.name}! 💼
              </h1>
              <p className="text-blue-100 text-sm mt-1 max-w-2xl">
                Source directly from FPOs and verified farmers. Manage active procurement orders, view farmer inventory & bids.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center min-w-[160px]">
              <span className="text-xs text-blue-200 block uppercase font-medium">Facility Location</span>
              <span className="text-sm font-bold flex items-center justify-center gap-1 mt-0.5">
                <MapPin className="w-4 h-4 text-blue-300" />
                {user?.buyer?.district || 'Maharashtra'}
              </span>
            </div>
          </div>
        </div>

        {/* Section Heading & Action */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Active Procurement Demands</h2>
            <p className="text-xs text-slate-500">Live requirements posted across Maharashtra APMC regions</p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all">
            <PlusCircle className="w-4 h-4" /> Post New Requirement
          </button>
        </div>

        {/* Demand Cards */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-500">Loading procurement demands...</p>
          </div>
        ) : requirements.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <p className="text-slate-600 font-medium">No procurement requirements currently active.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {requirements.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg flex items-center gap-1.5">
                      <span>{getCropIcon(req.crop.name)}</span>
                      <span>{req.crop.name}</span>
                      {req.crop.localName && (
                        <span className="text-xs font-normal text-slate-500">
                          ({req.crop.localName})
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {req.buyer.companyName || req.buyer.user.name}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-semibold bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                    Active RFP
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-slate-400 font-medium block">Target Offer</span>
                    <span className="text-2xl font-black text-blue-700">
                      ₹{req.targetPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-slate-500 ml-1">/ {req.crop.unit}</span>
                  </div>

                  <div className="text-right text-xs text-slate-600">
                    <span className="text-slate-400 block text-[11px]">Requirement Volume</span>
                    <span className="font-bold text-slate-800">
                      {req.quantityMin} - {req.quantityMax} {req.crop.unit}s
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    Preferred: {req.district || 'Any Region'}
                  </span>
                  <button className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                    Match Farmers →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
