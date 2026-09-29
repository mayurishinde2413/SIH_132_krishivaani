import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { UserRole } from '../context/AuthContext';
import { Header } from '../components/common/Header';
import { RoleSelector } from '../components/common/RoleSelector';
import { FarmerRegisterForm } from '../components/auth/FarmerRegisterForm';
import { BuyerRegisterForm } from '../components/auth/BuyerRegisterForm';
import { ShieldCheck, CheckCircle2, TrendingUp, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const RegisterPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialRole = (searchParams.get('role')?.toUpperCase() === 'BUYER' ? 'BUYER' : 'FARMER') as UserRole;
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/30 via-slate-50 to-white flex flex-col">
      <Header />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Card Container */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
            {/* Title / Header */}
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-3">
                <ShieldCheck className="w-3.5 h-3.5" /> {t('farmerFirstEcosystem', 'Farmer-First Ecosystem')}
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {t('createAccountTitle', 'Create your KrishiVaani Account')}
              </h1>
              <p className="text-sm text-slate-500 mt-2">
                {t('joinSubtitle', 'Join thousands of verified farmers & institutional buyers across Maharashtra')}
              </p>
            </div>

            {/* Role Toggle Selector */}
            <div className="mb-8">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2 text-center">
                {t('selectRoleLabel', 'Select your platform role')}
              </label>
              <RoleSelector
                selectedRole={selectedRole}
                onChange={(role) => setSelectedRole(role)}
              />
            </div>

            {/* Conditional Form Rendering */}
            {selectedRole === 'FARMER' ? (
              <FarmerRegisterForm />
            ) : (
              <BuyerRegisterForm />
            )}

            {/* Login Link */}
            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-600">
                {t('alreadyRegistered', 'Already registered with KrishiVaani?')} {' '}
                <Link
                  to="/login"
                  className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                  {t('signInLink', 'Sign in to your account')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
