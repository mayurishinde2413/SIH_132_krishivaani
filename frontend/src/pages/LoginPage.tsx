import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { BrandLogo } from '../components/common/BrandLogo';
import { LanguageSelector } from '../components/common/LanguageSelector';
import { Lock, Phone, ArrowRight, ShieldCheck, PhoneCall, Handshake, MapPin } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  // ── Existing form & auth state ─────────────────────────────────────────────
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ── Existing submit logic (100% unchanged) ─────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim()) {
      setError(t('errorEmptyId', 'Please enter your mobile number or email address'));
      return;
    }
    if (!password) {
      setError(t('errorEmptyPassword', 'Please enter your password'));
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', {
        identifier: identifier.trim(),
        password,
      });

      if (response.data?.success) {
        const { token, user } = response.data.data;
        login(token, user);

        if (user.role === 'FARMER') {
          navigate('/farmer/price-discovery');
        } else {
          navigate('/buyer/dashboard');
        }
      } else {
        setError(response.data?.message || t('errorLoginFailed', 'Login failed. Please check credentials.'));
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || t('errorServer', 'Unable to connect to server. Please try again.');
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-50 font-sans">

      {/* ══════════════════════════════════════════════════════════════════════
          LEFT 62%: Agricultural Field & Farmer Background Hero
          • Uses genuine photographic agricultural field & farmer background
          • Subtle dark green transparent overlay for text legibility
          • Global BrandLogo at top-left
          • Main typography & semi-transparent info cards
      ══════════════════════════════════════════════════════════════════════ */}
      <div
        className="relative w-full lg:w-[62%] min-h-[520px] lg:min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-14 text-white overflow-hidden"
        style={{
          backgroundImage: "url('/farmer-field-bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 45%',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Subtle dark green transparent overlay for high readability while keeping field clearly visible */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-forest-950/85 via-forest-900/35 to-forest-950/45 pointer-events-none"
          aria-hidden="true"
        />

        {/* ── TOP-LEFT: Global KrishiVaani Logo ────────────────────────────── */}
        <div className="relative z-10">
          <BrandLogo variant="light" iconStyle="glass" showTagline={true} />
        </div>

        {/* ── MIDDLE: Hero Headline & Subtext ──────────────────────────────── */}
        <div className="relative z-10 my-8 lg:my-auto max-w-xl">
          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-white leading-[1.15] tracking-tight">
            {t('loginTitle', 'Know your market.')}<br />
            <span className="text-emerald-300">{t('loginSubtitle', 'Understand your earnings.')}</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-emerald-100 font-semibold leading-relaxed">
            {t('heroDesc', 'Empowering Indian farmers through transparent price discovery.')}
          </p>

          <p className="mt-3 text-xs sm:text-sm text-emerald-100/80 leading-relaxed font-normal">
            {t('heroSubDesc', 'Real-time APMC price discovery across Maharashtra, with transparent net realization after freight & deductions, and direct linkage with verified buyers.')}
          </p>

          {/* ── BOTTOM-LEFT: Two Subtle Semi-Transparent Info Cards ───────── */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Card 1: Farmers & Verified Buyers */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 shadow-sm hover:bg-white/[0.14] transition-colors">
              <div className="flex items-center gap-2.5 font-bold text-sm sm:text-base text-white">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-200 shrink-0">
                  <Handshake className="w-4 h-4" />
                </div>
                <span>{t('farmersBuyersTitle', 'Farmers & Verified Buyers')}</span>
              </div>
              <p className="mt-2 text-xs text-emerald-100/80 leading-relaxed">
                {t('farmersBuyersDesc', 'Transparent price discovery with verified institutional buyers.')}
              </p>
            </div>

            {/* Card 2: Maharashtra State Mandis */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 shadow-sm hover:bg-white/[0.14] transition-colors">
              <div className="flex items-center gap-2.5 font-bold text-sm sm:text-base text-white">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-200 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>{t('maharashtraMandisTitle', 'Maharashtra State Mandis')}</span>
              </div>
              <p className="mt-2 text-xs text-emerald-100/80 leading-relaxed">
                {t('maharashtraMandisDesc', 'Live APMC mandi rates and market information.')}
              </p>
            </div>
          </div>
        </div>

        {/* ── BOTTOM-LEFT: Footer Links ────────────────────────────────────── */}
        <div className="relative z-10 pt-4 border-t border-white/15 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-emerald-100/60 font-medium">
          <span className="hover:text-white transition-colors cursor-pointer">{t('termsConditions', 'Terms & Conditions')}</span>
          <span>•</span>
          <span className="hover:text-white transition-colors cursor-pointer">{t('privacyPolicy', 'Privacy Policy')}</span>
          <span>•</span>
          <span className="hover:text-white transition-colors cursor-pointer">{t('aboutUs', 'About Us')}</span>
          <span className="sm:ml-auto">{t('allRightsReserved', '© 2025 KrishiVaani. All Rights Reserved.')}</span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          RIGHT 38%: Clean Light Panel with Existing React Login Form
          • Real React / HTML / Tailwind CSS components
          • ZERO duplicated screenshot
          • Only ONE KrishiVaani logo on page (on the left side)
          • Top controls: Kisan Call Centre & Language Selector
          • Existing validation, API calls, auth logic, demo logins untouched
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="w-full lg:w-[38%] min-h-screen flex flex-col justify-between p-6 sm:p-8 lg:p-10 bg-slate-50 border-l border-slate-200/80">

        {/* Top Header Row: Kisan Helpline & Language Selector (No second logo) */}
        <div className="flex items-center justify-between gap-3 w-full pb-6">
          <div className="flex items-center gap-2 text-slate-700">
            <PhoneCall className="w-4 h-4 text-emerald-700 shrink-0" />
            <div className="text-xs">
              <span className="text-slate-500 hidden sm:inline mr-1">{t('kisanCallCentre', 'Kisan Call Centre:')}</span>
              <span className="font-extrabold text-slate-900 tracking-wide">1800–180–1551</span>
            </div>
          </div>

          <LanguageSelector />
        </div>

        {/* Center: Existing Login Card */}
        <main className="my-auto w-full max-w-md mx-auto">
          <div className="bg-white rounded-3xl p-7 sm:p-9 shadow-xl shadow-slate-200/70 border border-slate-200/80 transition-all">

            {/* Title / Heading */}
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-3">
                <ShieldCheck className="w-3.5 h-3.5" /> {t('securePortalAccess', 'Secure Portal Access')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {t('welcomeTitle', 'Welcome to KrishiVaani')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-2">
                {t('welcomeSubtitle', 'Sign in to access price discovery, buyer linkages & mandi insights')}
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs sm:text-sm flex items-start gap-2.5">
                <span className="shrink-0 text-rose-500 mt-0.5">⚠️</span>
                <span className="flex-1 font-medium">{error}</span>
              </div>
            )}

            {/* Existing Login Form (Real HTML/React Components) */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <Input
                label={t('mobileOrEmailLabel', 'Mobile Number or Email')}
                required
                type="text"
                placeholder={t('mobileOrEmailPlaceholder', 'e.g. 9822001122 or ramesh@demo.com')}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
                autoComplete="username"
              />

              <div>
                <Input
                  label={t('passwordLabel', 'Password')}
                  required
                  type="password"
                  placeholder={t('passwordPlaceholder', 'Enter your password')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                  autoComplete="current-password"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-2"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {t('signInButton', 'Sign In to Account')}
              </Button>
            </form>

            {/* Quick Demo Credentials Info */}
            <div className="mt-7 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs text-slate-600">
              <span className="font-bold text-slate-800 block mb-1.5">{t('quickDemoLogins', 'Quick Demo Logins:')}</span>
              <div className="flex flex-col gap-1 text-[11px]">
                <div className="flex justify-between items-center">
                  <span>{t('farmerLabel', 'Farmer:')} <code className="bg-slate-200/80 px-1 py-0.5 rounded text-emerald-800 font-mono">ramesh@demo.com</code></span>
                  <span>{t('passLabel', 'Pass:')} <code className="bg-slate-200/80 px-1 py-0.5 rounded font-mono">demo@1234</code></span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{t('buyerLabel', 'Buyer:')} <code className="bg-slate-200/80 px-1 py-0.5 rounded text-blue-800 font-mono">freshmart@demo.com</code></span>
                  <span>{t('passLabel', 'Pass:')} <code className="bg-slate-200/80 px-1 py-0.5 rounded font-mono">demo@1234</code></span>
                </div>
              </div>
            </div>

            {/* Registration Link */}
            <div className="mt-6 pt-5 border-t border-slate-100 text-center">
              <p className="text-xs sm:text-sm text-slate-600">
                {t('dontHaveAccount', "Don't have an account yet?")}{' '}
                <Link
                  to="/register"
                  className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline inline-flex items-center gap-0.5"
                >
                  {t('registerHere', 'Register here')}
                </Link>
              </p>
            </div>

          </div>
        </main>

        {/* Bottom spacing & helpline hint on mobile */}
        <div className="text-center text-[11px] text-slate-400 pt-6">
          {t('govtInitiative', 'Official Government Mandi Linkage Initiative')}
        </div>

      </div>

    </div>
  );
};

export default LoginPage;
