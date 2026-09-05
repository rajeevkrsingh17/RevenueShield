'use client';

import React, { useState } from 'react';
import { Cpu, Sparkles, Zap, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SimulatorPage() {
  const [amount, setAmount] = useState('14999');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [bank, setBank] = useState('HDFC Bank');
  const [failureReason, setFailureReason] = useState('3D Secure Timeout');
  const [customerTier, setCustomerTier] = useState('VIP');
  const [result, setResult] = useState<any | null>(null);
  const [simulating, setSimulating] = useState(false);

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSimulating(true);

    try {
      const res = await fetch('/api/simulator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(amount),
          paymentMethod,
          bank,
          failureReason,
          customerTier,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data.result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSimulating(false);
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
          <Cpu className="h-7 w-7 text-[#E8B563]" />
          Recovery Scoring Simulator
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-[#8A8A8A] mt-1">
          Simulate hypothetical transaction parameters against RevenueShield ML scoring engine
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Simulation Input Form */}
        <form onSubmit={handleSimulate} className="p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121212] shadow-sm space-y-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-[#F5F0E8] flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
            <Cpu className="h-5 w-5 text-[#E8B563]" />
            Hypothetical Payment Attributes
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-[#F5F0E8]">Transaction Amount (₹)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1A1A1A] text-slate-900 dark:text-[#F5F0E8] text-xs focus:ring-2 focus:ring-[#E8B563] outline-none font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-[#F5F0E8]">Customer Tier</label>
              <select
                value={customerTier}
                onChange={(e) => setCustomerTier(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1A1A1A] text-slate-900 dark:text-[#F5F0E8] text-xs focus:ring-2 focus:ring-[#E8B563] outline-none"
              >
                <option value="VIP">VIP Customer (+8%)</option>
                <option value="Enterprise">Enterprise (+8%)</option>
                <option value="Premium">Premium (+4%)</option>
                <option value="Standard">Standard (0%)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-[#F5F0E8]">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1A1A1A] text-slate-900 dark:text-[#F5F0E8] text-xs focus:ring-2 focus:ring-[#E8B563] outline-none"
              >
                <option value="UPI">UPI</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Netbanking">Netbanking</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-[#F5F0E8]">Issuer Bank / Gateway</label>
              <select
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1A1A1A] text-slate-900 dark:text-[#F5F0E8] text-xs focus:ring-2 focus:ring-[#E8B563] outline-none"
              >
                <option value="HDFC Bank">HDFC Bank</option>
                <option value="ICICI Bank">ICICI Bank</option>
                <option value="SBI">SBI</option>
                <option value="Axis Bank">Axis Bank</option>
                <option value="PhonePe">PhonePe</option>
                <option value="Paytm">Paytm</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-[#F5F0E8]">Payment Failure Reason</label>
            <select
              value={failureReason}
              onChange={(e) => setFailureReason(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1A1A1A] text-slate-900 dark:text-[#F5F0E8] text-xs focus:ring-2 focus:ring-[#E8B563] outline-none"
            >
              <option value="3D Secure Timeout">3D Secure Timeout (High Recovery)</option>
              <option value="Bank Server Timeout">Bank Server Timeout (High Recovery)</option>
              <option value="UPI PIN Mismatch">UPI PIN Mismatch (Medium Recovery via Link)</option>
              <option value="Netbanking Session Expired">Netbanking Session Expired (Medium)</option>
              <option value="Insufficient Funds">Insufficient Funds (Low Recovery)</option>
              <option value="Card Declined by Issuer">Card Declined by Issuer (Low Recovery)</option>
              <option value="International Card Blocked">International Card Blocked (Low)</option>
            </select>
          </div>

          {/* Warm Theme Primary CTA Button */}
          <button
            type="submit"
            disabled={simulating}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#E8B563] to-[#D4A574] hover:opacity-95 text-[#0A0A0A] font-extrabold text-xs transition-all shadow-lg shadow-[#E8B563]/20 flex items-center justify-center gap-2"
          >
            <Zap className="h-4 w-4" />
            <span>{simulating ? 'Computing Recovery Matrix...' : 'Run Simulation Model'}</span>
          </button>
        </form>

        {/* Results Card */}
        <div className="p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121212] shadow-sm flex flex-col justify-between space-y-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-[#F5F0E8] flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
            <Sparkles className="h-5 w-5 text-[#E8B563]" />
            Engine Output & Diagnostics
          </h2>

          {!result ? (
            <div className="py-20 text-center text-xs text-slate-500 dark:text-[#8A8A8A] space-y-3">
              <Cpu className="h-10 w-10 text-[#E8B563] mx-auto opacity-40" />
              <div>Submit payment parameters on the left to view real-time recovery scoring breakdown</div>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
              <div className="p-5 rounded-2xl bg-[#E8B563]/10 border border-[#E8B563]/30 space-y-1">
                <div className="text-xs text-amber-800 dark:text-[#E8B563] font-bold">Estimated Recovery Probability</div>
                <div className="text-4xl font-extrabold font-mono text-[#E8B563]">
                  {Math.round(result.recoveryProbability * 100)}%
                </div>
                <div className="text-xs text-slate-600 dark:text-[#8A8A8A] pt-1">
                  Expected Recoverable Amount: <span className="font-mono font-extrabold text-slate-900 dark:text-[#F5F0E8]">₹{result.expectedRecoveryAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1A1A1A]">
                  <div className="text-slate-500 dark:text-[#8A8A8A]">Recommended Action</div>
                  <div className="font-extrabold text-[#E8B563] text-sm mt-0.5">{result.recommendedAction}</div>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1A1A1A]">
                  <div className="text-slate-500 dark:text-[#8A8A8A]">Failure Classification</div>
                  <div className="font-extrabold text-slate-900 dark:text-[#F5F0E8] text-sm mt-0.5">{result.failureCategory}</div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 space-y-2 text-xs">
                <div className="font-bold text-slate-900 dark:text-[#F5F0E8]">Model Diagnostic Rationale</div>
                <p className="text-slate-600 dark:text-[#8A8A8A] leading-relaxed">{result.explanation}</p>
                <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 dark:text-[#8A8A8A]">Optimal Timeframe:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">{result.recommendedTimeframe}</span>
                </div>
              </div>
            </motion.div>
          )}

          <div className="pt-3 border-t border-slate-200 dark:border-white/10 text-[11px] text-slate-500 dark:text-[#8A8A8A] text-center font-medium">
            Powered by RevenueShield Machine Intelligence Pipeline
          </div>
        </div>
      </div>
    </motion.div>
  );
}
