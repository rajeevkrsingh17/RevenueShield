'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthContext';
import { useCountUp } from '@/hooks/useCountUp';
import { ToastContainer, ToastMessage } from '@/components/ui/Toast';
import {
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  DollarSign,
  ArrowUpRight,
  Sparkles,
  Zap,
  Cpu,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  PieChart as PieIcon,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from 'recharts';

export default function OverviewDashboard() {
  const { activeOrgId } = useAuth();
  const [data, setData] = useState<any>(null);
  const [recoverableTx, setRecoverableTx] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [executingId, setExecutingId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = Math.random().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [statsRes, txRes] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/transactions?status=RECOVERABLE&limit=8'),
      ]);

      if (statsRes.ok && txRes.ok) {
        const statsData = await statsRes.json();
        const txData = await txRes.json();
        setData(statsData);
        setRecoverableTx(txData.transactions || []);
      }
    } catch (e) {
      console.error('Failed to load dashboard stats', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [activeOrgId]);

  const handleApproveAction = async (id: string, actionType: string) => {
    try {
      setExecutingId(id);
      const res = await fetch(`/api/transactions/${id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionType }),
      });

      if (res.ok) {
        const resData = await res.json();
        if (resData.isSuccessful) {
          addToast('success', 'Payment Successfully Recovered!', resData.auditLog.outcome);
        } else {
          addToast('error', 'Recovery Action Unsuccessful', resData.auditLog.outcome);
        }
        await fetchStats();
      }
    } catch {
      addToast('error', 'Execution Failed', 'Unable to reach recovery server.');
    } finally {
      setExecutingId(null);
    }
  };

  const totalProcessedCount = useCountUp(data?.metrics?.totalProcessed || 0);
  const revenueAtRiskCount = useCountUp(data?.metrics?.revenueAtRisk || 0);
  const recoveredRevenueCount = useCountUp(data?.metrics?.recoveredRevenue || 0);
  const activeRetriesCount = useCountUp(data?.metrics?.activeRetries || 0);

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <div className="h-20 w-full bg-slate-200 dark:bg-white/5 animate-pulse rounded-2xl"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-32 bg-white dark:bg-[#121212] rounded-2xl border border-slate-200 dark:border-white/10 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const { metrics, sparkline, topAnomaly, orgName } = data;

  const mockBankLatency = [
    { bank: 'ICICI UPI', latency: 420, rate: 96.4, color: '#34B76C' },
    { bank: 'Axis UPI', latency: 610, rate: 94.1, color: '#34B76C' },
    { bank: 'HDFC Cards', latency: 1840, rate: 88.2, color: '#E8B563' },
    { bank: 'SBI UPI', latency: 2450, rate: 81.5, color: '#EF4444' },
  ];

  const failureDistMock = [
    { name: 'Bank Downtime', value: 45, color: '#EF4444' },
    { name: 'OTP Expiry', value: 25, color: '#F59E0B' },
    { name: 'Limit Exceeded', value: 18, color: '#6366F1' },
    { name: 'Auth Network Timeout', value: 12, color: '#EC4899' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-300 pb-16">
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      {/* SECTION 1: EXECUTIVE OVERVIEW */}
      <section id="overview" className="space-y-6 scroll-mt-28">
        {/* Sleek Theme Banner Header Card (Zero Top Gap) */}
        <div className="p-6 md:p-8 rounded-2xl border border-[#E8B563]/30 bg-gradient-to-r from-[#E8B563]/15 via-slate-100/80 to-[#E8B563]/10 dark:from-[#E8B563]/15 dark:via-[#141414] dark:to-[#E8B563]/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-[#F5F0E8] flex flex-wrap items-center gap-3">
              Executive Overview
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-[#E8B563]/25 text-amber-900 dark:text-[#E8B563] border border-[#E8B563]/40">
                {orgName}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#8A8A8A] font-medium mt-1">
              Real-time payment failure recovery telemetry & leakage intelligence
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/simulator"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-[#F5F0E8] hover:bg-slate-100 dark:hover:bg-white/10 font-bold text-xs transition-all shadow-xs"
            >
              <Cpu className="h-4 w-4 text-[#E8B563]" />
              <span>Simulator</span>
            </Link>
            <Link
              href="/payment-recovery"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#E8B563] to-[#D4A574] hover:opacity-95 text-[#0A0A0A] font-extrabold text-xs transition-all shadow-md shadow-[#E8B563]/20 hover:scale-[1.02]"
            >
              <Zap className="h-4 w-4" />
              <span>Recovery Engine</span>
            </Link>
          </div>
        </div>

        {/* Critical Anomaly Banner */}
        {topAnomaly && (
          <div className="p-6 md:p-8 rounded-2xl border border-rose-500/40 bg-rose-500/5 dark:bg-[#121212] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                    Critical Leakage Anomaly
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold">
                    {Math.round(topAnomaly.confidence * 100)}% AI Confidence
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-[#F5F0E8]">{topAnomaly.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-[#8A8A8A] leading-relaxed">{topAnomaly.description}</p>
              </div>
            </div>

            <Link
              href="/revenue-intelligence"
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold shrink-0 transition-all shadow-sm flex items-center gap-2"
            >
              <span>Investigate Root Cause</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {/* 5 Core Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121212] shadow-sm space-y-3 hover:border-[#E8B563]/40 transition-all">
            <div className="flex items-center justify-between text-slate-500 dark:text-[#8A8A8A]">
              <span className="text-xs font-bold">Total Processed</span>
              <DollarSign className="h-4 w-4 text-[#E8B563]" />
            </div>
            <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-[#F5F0E8]">
              ₹{totalProcessedCount.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <ArrowUpRight className="h-3.5 w-3.5" /> +12.4% vs last week
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121212] shadow-sm space-y-3 hover:border-rose-500/40 transition-all">
            <div className="flex items-center justify-between text-slate-500 dark:text-[#8A8A8A]">
              <span className="text-xs font-bold">Revenue at Risk</span>
              <AlertTriangle className="h-4 w-4 text-rose-500" />
            </div>
            <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-[#F5F0E8]">
              ₹{revenueAtRiskCount.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold">Failed / Pending retries</div>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121212] shadow-sm space-y-3 hover:border-emerald-500/40 transition-all">
            <div className="flex items-center justify-between text-slate-500 dark:text-[#8A8A8A]">
              <span className="text-xs font-bold">Recovery Rate</span>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-[#F5F0E8]">{metrics.recoveryRate}%</div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">+4.2% AI model uplift</div>
          </div>

          <div className="p-6 rounded-2xl border border-[#E8B563]/40 bg-[#E8B563]/10 dark:bg-[#E8B563]/5 shadow-sm space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between text-[#E8B563]">
              <span className="text-xs font-extrabold uppercase tracking-wider">Recovered Revenue</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-extrabold font-mono text-amber-800 dark:text-[#E8B563]">
              ₹{recoveredRevenueCount.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-amber-900/80 dark:text-[#E8B563]/80 font-semibold">Saved revenue via retries</div>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121212] shadow-sm space-y-3 hover:border-amber-500/40 transition-all">
            <div className="flex items-center justify-between text-slate-500 dark:text-[#8A8A8A]">
              <span className="text-xs font-bold">Active Retries</span>
              <RefreshCw className="h-4 w-4 text-amber-500" />
            </div>
            <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-[#F5F0E8]">{activeRetriesCount} items</div>
            <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">Pending approval</div>
          </div>
        </div>

        {/* 7-Day Trend Chart & High-Probability Retry Queue Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121212] shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-[#F5F0E8]">7-Day Revenue Recovery Telemetry</h2>
                <p className="text-xs text-slate-500 dark:text-[#8A8A8A] mt-0.5">Daily recovered revenue computed from live database rows</p>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-[#8A8A8A] font-semibold border border-slate-200 dark:border-white/10">
                Sparkline Aggregation
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%" key="sparkline-chart">
                <AreaChart data={sparkline}>
                  <defs>
                    <linearGradient id="colorRecovered" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E8B563" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#E8B563" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#8A8A8A" fontSize={11} tickLine={false} />
                  <YAxis stroke="#8A8A8A" fontSize={11} tickLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
                  <Tooltip
                    content={({ active, payload, label }: any) => {
                      if (active && payload && payload.length) {
                        const item = payload[0];
                        return (
                          <div className="bg-slate-950/95 border border-[#E8B563]/60 p-3 rounded-xl shadow-2xl backdrop-blur-md text-xs space-y-1 z-50">
                            <p className="font-extrabold text-slate-100 border-b border-slate-800 pb-1 mb-1">{label}</p>
                            <div className="flex items-center gap-2 font-bold">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#E8B563] shrink-0" />
                              <span className="text-slate-300 font-medium">Recovered Revenue:</span>
                              <span className="font-extrabold text-[#E8B563] ml-auto">₹{Number(item.value).toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#E8B563"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRecovered)"
                    isAnimationActive={true}
                    animationDuration={1500}
                    animationEasing="ease-in-out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121212] shadow-sm space-y-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900 dark:text-[#F5F0E8] flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#E8B563]" />
                  High-Probability Retries
                </h2>
                <Link href="/payment-recovery" className="text-xs text-[#E8B563] font-bold hover:underline">
                  View all
                </Link>
              </div>
              <p className="text-xs text-slate-500 dark:text-[#8A8A8A] mt-0.5">Execute 1-click AI actions to recover payments now</p>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {recoverableTx.length === 0 ? (
                <div className="py-10 text-center text-xs text-slate-500 dark:text-[#8A8A8A]">All recoverable payments processed!</div>
              ) : (
                recoverableTx.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-900 dark:text-[#F5F0E8] flex items-center gap-2 font-mono">
                        {tx.transactionId}
                        <span className="text-[10px] font-normal font-sans px-1.5 py-0.2 rounded bg-[#E8B563]/15 text-amber-900 dark:text-[#E8B563] font-bold border border-[#E8B563]/30">
                          {Math.round(tx.recoveryProbability * 100)}% prob
                        </span>
                      </div>
                      <div className="text-slate-500 dark:text-[#8A8A8A] font-medium">
                        {tx.customerName} • ₹{tx.amount.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <button
                      onClick={() => handleApproveAction(tx.id, tx.recommendedAction)}
                      disabled={executingId === tx.id}
                      className="px-3.5 py-1.5 rounded-xl bg-[#E8B563] hover:bg-[#d8a553] text-[#0A0A0A] font-extrabold text-xs shadow-xs transition-all flex items-center gap-1 shrink-0"
                    >
                      {executingId === tx.id ? (
                        'Executing...'
                      ) : (
                        <>
                          <Zap className="h-3 w-3" />
                          <span>Approve</span>
                        </>
                      )}
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-500 dark:text-[#8A8A8A] font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-500" /> Auto Audit Trail Active
              </span>
              <span>Immutable Log</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
