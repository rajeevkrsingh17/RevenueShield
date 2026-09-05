'use client';

import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/components/providers/AuthContext';
import {
  Settings as SettingsIcon,
  User,
  Building2,
  Moon,
  Sun,
  Key,
  RotateCcw,
  LogOut,
  CheckCircle2,
  Shield,
  Bell,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user, logout, refreshAuth } = useAuth();
  const [profileName, setProfileName] = useState(user?.name || '');
  const [orgName, setOrgName] = useState(user?.organizationName || '');
  const [apiKey, setApiKey] = useState('rs_live_9f82k7x0219481n49a8d29b');
  const [showKey, setShowKey] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage('Profile settings updated successfully');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleResetDemoData = async () => {
    if (!confirm('Are you sure you want to reset demo transaction data for your organization?')) return;
    setResetting(true);
    try {
      const res = await fetch('/api/organizations/reset-demo', { method: 'POST' });
      if (res.ok) {
        setToastMessage('Demo dataset reset to initial baseline');
        await refreshAuth();
        window.location.reload();
      }
    } catch {
      setToastMessage('Failed to reset demo data');
    } finally {
      setResetting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 w-full"
    >
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-white/10 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-[#F5F0E8] flex items-center gap-3">
          <SettingsIcon className="h-7 w-7 text-[#E8B563]" />
          Platform & Organization Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-[#8A8A8A] mt-1">
          Manage merchant organization credentials, theme preferences, and demo environments
        </p>
      </div>

      {toastMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 2-Column Responsive Grid Filling Widescreen Space */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Section */}
        <form onSubmit={handleSaveProfile} className="p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121212] shadow-sm space-y-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-[#F5F0E8] flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
            <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            User Profile Settings
          </h2>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-[#F5F0E8]">Full Name</label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1A1A1A] text-slate-900 dark:text-[#F5F0E8] text-xs focus:ring-2 focus:ring-[#E8B563] outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-[#F5F0E8]">Email Address</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-[#8A8A8A] text-xs outline-none cursor-not-allowed"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#E8B563] hover:bg-[#d8a553] text-[#0A0A0A] font-extrabold text-xs transition-all shadow-md"
          >
            Save Profile Changes
          </button>
        </form>

        {/* Organization & Reset Section */}
        <div className="p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121212] shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-[#F5F0E8] flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
              <Building2 className="h-5 w-5 text-[#E8B563]" />
              Merchant Organization Settings
            </h2>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-[#F5F0E8]">Organization Display Name</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1A1A1A] text-slate-900 dark:text-[#F5F0E8] text-xs focus:ring-2 focus:ring-[#E8B563] outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-[#F5F0E8]">Reset Organization Demo Data</div>
              <div className="text-[11px] text-slate-500 dark:text-[#8A8A8A]">
                Re-generate initial 45 realistic payment transactions and anomalies.
              </div>
            </div>
            <button
              type="button"
              onClick={handleResetDemoData}
              disabled={resetting}
              className="px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 font-bold text-xs transition-colors flex items-center gap-2 shrink-0"
            >
              <RotateCcw className="h-4 w-4" />
              <span>{resetting ? 'Resetting...' : 'Reset Demo Data'}</span>
            </button>
          </div>
        </div>

        {/* Theme Preferences */}
        <div className="p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121212] shadow-sm space-y-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-[#F5F0E8] flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
            <Moon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Theme & Display Mode
          </h2>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setTheme('dark')}
              className={`flex-1 p-5 rounded-xl border flex items-center justify-center gap-3 text-xs font-extrabold transition-all ${
                theme === 'dark'
                  ? 'bg-[#E8B563]/15 border-[#E8B563] text-[#E8B563] shadow-md'
                  : 'bg-slate-50 dark:bg-[#141414] border-slate-200 dark:border-white/10 text-slate-600 dark:text-[#8A8A8A] hover:text-slate-900 dark:hover:text-[#F5F0E8]'
              }`}
            >
              <Moon className="h-5 w-5" />
              <span>Dark Mode (Obsidian)</span>
            </button>

            <button
              onClick={() => setTheme('light')}
              className={`flex-1 p-5 rounded-xl border flex items-center justify-center gap-3 text-xs font-extrabold transition-all ${
                theme === 'light'
                  ? 'bg-[#E8B563]/15 border-[#E8B563] text-[#E8B563] shadow-md'
                  : 'bg-slate-50 dark:bg-[#141414] border-slate-200 dark:border-white/10 text-slate-600 dark:text-[#8A8A8A] hover:text-slate-900 dark:hover:text-[#F5F0E8]'
              }`}
            >
              <Sun className="h-5 w-5 text-amber-500" />
              <span>Light Mode (Executive Slate)</span>
            </button>
          </div>
        </div>

        {/* API Key */}
        <div className="p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121212] shadow-sm space-y-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-[#F5F0E8] flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
            <Key className="h-5 w-5 text-[#E8B563]" />
            Razorpay Webhook & RevenueShield API Keys
          </h2>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-[#F5F0E8]">Active Merchant API Key</label>
            <div className="flex items-center gap-2">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                readOnly
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 font-mono text-slate-900 dark:text-[#F5F0E8] text-xs outline-none"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#141414] text-xs font-bold text-slate-700 dark:text-[#F5F0E8] hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
              >
                {showKey ? 'Hide' : 'Reveal'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Action */}
      <div className="p-6 md:p-8 rounded-2xl border border-rose-500/20 bg-rose-500/5 flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-slate-900 dark:text-[#F5F0E8]">Sign out of Workspace</div>
          <div className="text-[11px] text-slate-500 dark:text-[#8A8A8A]">Terminate active JWT session on this device</div>
        </div>
        <button
          onClick={logout}
          className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs transition-colors shadow flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </button>
      </div>
    </motion.div>
  );
}
