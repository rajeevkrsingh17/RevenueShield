'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/AuthContext';
import {
  TrendingUp,
  Layers,
  Building2,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { motion } from 'framer-motion';

export default function RevenueIntelligencePage() {
  const { activeOrgId } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/revenue-intelligence');
        if (res.ok) {
          const resData = await res.json();
          setData(resData);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeOrgId]);

  if (loading || !data) {
    return (
      <div className="space-y-6 p-8">
        <div className="h-8 w-64 bg-slate-200 dark:bg-white/5 animate-pulse rounded-lg"></div>
        <div className="h-64 bg-white dark:bg-[#121212] rounded-2xl border border-slate-200 dark:border-white/10 animate-pulse"></div>
      </div>
    );
  }

  const { funnel, anomalies, bankPerformance } = data;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 w-full"
    >
      <div className="border-b border-slate-200 dark:border-white/10 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-[#F5F0E8] flex items-center gap-3">
          <TrendingUp className="h-7 w-7 text-[#E8B563]" />
          Revenue Intelligence & Leakage Detection
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-[#8A8A8A] mt-1">
          End-to-end checkout conversion funnel and automated bank downtime anomaly detection rules
        </p>
      </div>

      {/* Conversion Funnel */}
      <div className="p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121212] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-[#F5F0E8] flex items-center gap-2">
              <Layers className="h-5 w-5 text-[#E8B563]" />
              Razorpay Checkout Conversion Funnel
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#8A8A8A] mt-0.5">Computed live from payment attempt lifecycle state counts</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 pt-2">
          {funnel.map((step: any, index: number) => (
            <div
              key={step.step}
              className={`p-5 rounded-2xl border relative space-y-2 ${
                index === 4
                  ? 'bg-[#E8B563]/15 border-[#E8B563]/40'
                  : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10'
              }`}
            >
              <div className="text-[11px] font-bold text-slate-500 dark:text-[#8A8A8A] uppercase tracking-wider">
                Step {index + 1}
              </div>
              <div className="text-sm font-extrabold text-slate-900 dark:text-[#F5F0E8] truncate">{step.step}</div>
              <div className="text-2xl font-extrabold font-mono text-[#E8B563]">
                {step.count.toLocaleString('en-IN')}
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-[#8A8A8A] pt-2 border-t border-slate-200 dark:border-white/10">
                <span>Conversion</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">{step.rate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Real Detection Rule Anomalies */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-[#F5F0E8] flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-rose-500" />
          Active Detected Systemic Anomalies
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {anomalies.map((anomaly: any) => (
            <div
              key={anomaly.id}
              className="p-6 rounded-2xl border border-rose-500/30 bg-white dark:bg-[#121212] shadow-sm space-y-4 relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded font-mono ${
                        anomaly.severity === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                          : 'bg-amber-500/20 text-amber-700 dark:text-amber-400'
                      }`}
                    >
                      {anomaly.severity} SEVERITY
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-[#8A8A8A] font-mono">
                      {Math.round(anomaly.confidence * 100)}% AI Confidence
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-[#F5F0E8]">{anomaly.title}</h3>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-[#8A8A8A] leading-relaxed">{anomaly.description}</p>

              <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-[#8A8A8A]">
                  Detected: {new Date(anomaly.detectedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="text-[#E8B563] font-bold flex items-center gap-1">
                  Rule Triggered <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gateway Bank Latency & Success Matrix */}
      <div className="p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121212] shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-[#F5F0E8] flex items-center gap-2">
          <Building2 className="h-5 w-5 text-[#E8B563]" />
          Bank Gateway Failure Rates vs Baseline
        </h2>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%" key="bank-failure-chart">
            <BarChart data={bankPerformance}>
              <XAxis dataKey="bank" stroke="#8A8A8A" fontSize={11} tickLine={false} />
              <YAxis stroke="#8A8A8A" fontSize={11} tickLine={false} unit="%" />
              <Tooltip
                content={({ active, payload, label }: any) => {
                  if (active && payload && payload.length) {
                    const item = payload[0];
                    const isHighFailure = item.value > 25;
                    return (
                      <div className={`bg-slate-950/95 border ${isHighFailure ? 'border-rose-500/60' : 'border-[#E8B563]/60'} p-3 rounded-xl shadow-2xl backdrop-blur-md text-xs space-y-1 z-50`}>
                        <p className="font-extrabold text-slate-100 border-b border-slate-800 pb-1 mb-1">{label}</p>
                        <div className="flex items-center gap-2 font-bold">
                          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${isHighFailure ? 'bg-rose-500' : 'bg-[#E8B563]'}`} />
                          <span className="text-slate-300 font-medium">Failure Rate:</span>
                          <span className={`font-extrabold ml-auto ${isHighFailure ? 'text-rose-400' : 'text-[#E8B563]'}`}>{item.value}%</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="failureRate" radius={[8, 8, 0, 0]}>
                {bankPerformance.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.failureRate > 25 ? '#ef4444' : '#E8B563'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
