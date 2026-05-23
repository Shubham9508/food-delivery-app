import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Phone, MapPin, Mail, Save, ShieldAlert, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return toast.error('Name is required');

    setSaving(true);
    try {
      await updateProfile(name, phone, address);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6 bg-slate-50 dark:bg-darkBg-primary">
        <div className="text-center font-bold">Please sign in to view your profile.</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 bg-slate-50 dark:bg-darkBg-primary min-h-[calc(100vh-4rem)]">
      <div className="flex items-center gap-2.5 mb-8">
        <User className="text-primary-500" size={26} />
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">Account Profile</h1>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Left Card: Account Card Overview */}
        <div className="md:col-span-1 rounded-2xl bg-white p-6 shadow-premium border border-slate-100 dark:bg-darkBg-secondary dark:border-slate-800 text-center flex flex-col items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-500 text-white text-3xl font-extrabold shadow-md mb-4">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white truncate max-w-full">{user.name}</h3>
          <p className="text-xs text-slate-400 font-semibold mb-3">{user.email}</p>

          <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
            user.role === 'admin'
              ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
              : 'bg-primary-100 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400'
          }`}>
            {user.role} Member
          </span>
        </div>

        {/* Right Card: Settings Update Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl bg-white p-6 shadow-premium border border-slate-100 dark:bg-darkBg-secondary dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white border-b border-slate-100 pb-3 dark:border-slate-800">
              Personal Information
            </h2>

            {/* Email (Read Only) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Email Address (Permanent)
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-400 cursor-not-allowed outline-none dark:border-slate-800 dark:bg-darkBg-primary"
                />
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Full Name
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-800 dark:bg-darkBg-primary dark:text-white"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Phone Number
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Phone size={16} />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +1 (555) 000-0000"
                  className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-800 dark:bg-darkBg-primary dark:text-white"
                />
              </div>
            </div>

            {/* Default Delivery Address */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Default Shipping Address
              </label>
              <div className="relative">
                <div className="absolute top-3.5 left-3 text-slate-400">
                  <MapPin size={16} />
                </div>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Apartment/Suite, Street Address, City, State, ZIP Code"
                  rows="3"
                  className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-800 dark:bg-darkBg-primary dark:text-white"
                />
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 py-3 text-sm font-extrabold text-white transition hover:bg-primary-600 hover:shadow-premium disabled:bg-slate-300 dark:disabled:bg-slate-800 sm:w-auto sm:px-6"
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Saving Changes...
                </>
              ) : (
                <>
                  <Save size={16} /> Save Changes
                </>
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
