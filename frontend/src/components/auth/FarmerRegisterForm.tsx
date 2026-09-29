import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { User, Phone, Mail, Lock, MapPin, Sprout, ArrowRight } from 'lucide-react';

const MAHARASHTRA_DISTRICTS = [
  'Ahmednagar',
  'Akola',
  'Amravati',
  'Chhatrapati Sambhajinagar (Aurangabad)',
  'Beed',
  'Bhandara',
  'Buldhana',
  'Chandrapur',
  'Dhule',
  'Gadchiroli',
  'Gondia',
  'Hingoli',
  'Jalgaon',
  'Jalna',
  'Kolhapur',
  'Latur',
  'Mumbai City',
  'Mumbai Suburban',
  'Nagpur',
  'Nanded',
  'Nandurbar',
  'Nashik',
  'Dharashiv (Osmanabad)',
  'Palghar',
  'Parbhani',
  'Pune',
  'Raigad',
  'Ratnagiri',
  'Sangli',
  'Satara',
  'Sindhudurg',
  'Solapur',
  'Thane',
  'Wardha',
  'Washim',
  'Yavatmal',
];

const CROPS_LIST = [
  'Wheat (Gehun)',
  'Onion (Kanda)',
  'Tomato (Tamatar)',
  'Bajra (Pearl Millet)',
  'Soybean',
  'Potato (Batata)',
  'Maize (Makka)',
  'Cotton (Kapas)',
  'Sugarcane',
  'Pomegranate',
  'Grapes',
  'Other',
];

export const FarmerRegisterForm: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    state: 'Maharashtra',
    district: '',
    taluka: '',
    village: '',
    landHolding: '',
    primaryCrop: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Form Validations
    if (!formData.name.trim()) return setError('Please enter your Full Name');
    if (!formData.phone.trim()) return setError('Please enter your Mobile Number');
    if (!/^\d{10}$/.test(formData.phone.trim())) {
      return setError('Mobile Number must be a valid 10-digit number');
    }
    if (!formData.password) return setError('Please enter a password');
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters long');
    }
    if (formData.password !== formData.confirmPassword) {
      return setError('Password and Confirm Password do not match');
    }
    if (!formData.state) return setError('State is required');
    if (!formData.district) return setError('Please select your District');
    if (!formData.taluka.trim()) return setError('Please enter your Taluka / Tehsil');
    if (!formData.village.trim()) return setError('Please enter your Village');

    setIsLoading(true);
    try {
      const response = await api.post('/auth/register', {
        role: 'FARMER',
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        state: formData.state,
        district: formData.district,
        taluka: formData.taluka.trim(),
        village: formData.village.trim(),
        landHolding: formData.landHolding ? parseFloat(formData.landHolding) : undefined,
        primaryCrop: formData.primaryCrop || undefined,
      });

      if (response.data?.success) {
        const { token, user } = response.data.data;
        login(token, user);
        // Direct redirect to price discovery as specified
        navigate('/farmer/price-discovery');
      } else {
        setError(response.data?.message || 'Registration failed');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Server error occurred during registration.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-700 text-sm flex items-start gap-3">
          <span className="shrink-0 text-rose-500 mt-0.5">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Personal Information Group */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-800/80 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5" /> Farmer Personal Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            name="name"
            required
            placeholder="e.g. Ramesh Devidas Patil"
            value={formData.name}
            onChange={handleChange}
            leftIcon={<User className="w-4 h-4" />}
          />

          <Input
            label="Mobile Number"
            name="phone"
            required
            type="tel"
            maxLength={10}
            placeholder="10-digit number (e.g. 9822001122)"
            value={formData.phone}
            onChange={handleChange}
            leftIcon={<Phone className="w-4 h-4" />}
          />
        </div>

        <Input
          label="Email Address (optional)"
          name="email"
          type="email"
          placeholder="e.g. ramesh@example.com"
          value={formData.email}
          onChange={handleChange}
          leftIcon={<Mail className="w-4 h-4" />}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Password"
            name="password"
            required
            type="password"
            placeholder="Minimum 6 characters"
            value={formData.password}
            onChange={handleChange}
            leftIcon={<Lock className="w-4 h-4" />}
          />

          <Input
            label="Confirm Password"
            name="confirmPassword"
            required
            type="password"
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            leftIcon={<Lock className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Location Details Group */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-800/80 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" /> Farm & Location Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="State"
            name="state"
            required
            readOnly
            value={formData.state}
            onChange={handleChange}
            className="bg-slate-50 cursor-not-allowed text-slate-600"
          />

          <Select
            label="District"
            name="district"
            required
            placeholder="Select District"
            options={MAHARASHTRA_DISTRICTS}
            value={formData.district}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Taluka / Tehsil"
            name="taluka"
            required
            placeholder="e.g. Junnar or Niphad"
            value={formData.taluka}
            onChange={handleChange}
          />

          <Input
            label="Village"
            name="village"
            required
            placeholder="e.g. Narayangaon"
            value={formData.village}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Agricultural Details Group */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-800/80 flex items-center gap-1.5">
          <Sprout className="w-3.5 h-3.5" /> Agricultural Details (Optional)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Land Holding (Acres)"
            name="landHolding"
            type="number"
            step="0.1"
            placeholder="e.g. 4.5"
            value={formData.landHolding}
            onChange={handleChange}
          />

          <Select
            label="Primary Crop"
            name="primaryCrop"
            placeholder="Select Primary Crop"
            options={CROPS_LIST}
            value={formData.primaryCrop}
            onChange={handleChange}
          />
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full mt-4"
        isLoading={isLoading}
        rightIcon={<ArrowRight className="w-4 h-4" />}
      >
        Complete Farmer Registration
      </Button>
    </form>
  );
};
