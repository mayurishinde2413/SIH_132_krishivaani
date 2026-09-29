import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { Building2, User, Phone, Mail, Lock, MapPin, FileText, ArrowRight } from 'lucide-react';

const BUYER_TYPES = [
  'Fresh Produce Buyer',
  'Food Processing Unit',
  'Cold Storage',
  'Retailer',
  'Wholesaler',
  'Other',
];

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

export const BuyerRegisterForm: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    businessType: '',
    phone: '',
    email: '',
    gstNumber: '',
    password: '',
    confirmPassword: '',
    warehouseLocation: '',
    state: 'Maharashtra',
    district: '',
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
    if (!formData.companyName.trim()) {
      return setError('Please enter Business / Organization Name');
    }
    if (!formData.contactPerson.trim()) {
      return setError('Please enter Contact Person Name');
    }
    if (!formData.businessType) {
      return setError('Please select a Buyer Type');
    }
    if (!formData.phone.trim()) {
      return setError('Please enter Mobile Number');
    }
    if (!/^\d{10}$/.test(formData.phone.trim())) {
      return setError('Mobile Number must be a valid 10-digit number');
    }
    if (!formData.password) {
      return setError('Please enter a password');
    }
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters long');
    }
    if (formData.password !== formData.confirmPassword) {
      return setError('Password and Confirm Password do not match');
    }
    if (!formData.warehouseLocation.trim()) {
      return setError('Please enter Primary Delivery / Warehouse Location');
    }
    if (!formData.district) {
      return setError('Please select your District');
    }

    setIsLoading(true);
    try {
      const response = await api.post('/auth/register', {
        role: 'BUYER',
        companyName: formData.companyName.trim(),
        contactPerson: formData.contactPerson.trim(),
        businessType: formData.businessType,
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        gstNumber: formData.gstNumber.trim() || undefined,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        warehouseLocation: formData.warehouseLocation.trim(),
        state: formData.state,
        district: formData.district,
      });

      if (response.data?.success) {
        const { token, user } = response.data.data;
        login(token, user);
        // Direct redirect to buyer dashboard as specified
        navigate('/buyer/dashboard');
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

      {/* Business Details Group */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-blue-800/80 flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5" /> Business & Contact Profile
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Business / Organization Name"
            name="companyName"
            required
            placeholder="e.g. Sahyadri Agro Products Ltd"
            value={formData.companyName}
            onChange={handleChange}
            leftIcon={<Building2 className="w-4 h-4" />}
          />

          <Input
            label="Contact Person"
            name="contactPerson"
            required
            placeholder="e.g. Manoj Sharma"
            value={formData.contactPerson}
            onChange={handleChange}
            leftIcon={<User className="w-4 h-4" />}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Buyer Type"
            name="businessType"
            required
            placeholder="Select Buyer Type"
            options={BUYER_TYPES}
            value={formData.businessType}
            onChange={handleChange}
          />

          <Input
            label="Mobile Number"
            name="phone"
            required
            type="tel"
            maxLength={10}
            placeholder="10-digit mobile number"
            value={formData.phone}
            onChange={handleChange}
            leftIcon={<Phone className="w-4 h-4" />}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Email Address (optional)"
            name="email"
            type="email"
            placeholder="e.g. procurement@sahyadriagro.in"
            value={formData.email}
            onChange={handleChange}
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <Input
            label="GST / Trade License (optional)"
            name="gstNumber"
            placeholder="e.g. 27AAAAA0000A1Z5"
            value={formData.gstNumber}
            onChange={handleChange}
            leftIcon={<FileText className="w-4 h-4" />}
          />
        </div>

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

      {/* Warehouse & Fulfillment Location */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-blue-800/80 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" /> Procurement & Warehouse Location
        </h3>

        <Input
          label="Primary Delivery / Warehouse Location"
          name="warehouseLocation"
          required
          placeholder="e.g. Plot No 24, APMC Cold Storage Yard, Vashi"
          value={formData.warehouseLocation}
          onChange={handleChange}
          leftIcon={<MapPin className="w-4 h-4" />}
        />

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
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full mt-4 !bg-blue-600 hover:!bg-blue-700 !shadow-blue-600/30"
        isLoading={isLoading}
        rightIcon={<ArrowRight className="w-4 h-4" />}
      >
        Complete Buyer Registration
      </Button>
    </form>
  );
};
