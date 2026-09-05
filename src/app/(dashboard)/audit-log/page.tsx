'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/AuthContext';
import { FileCheck2, Download, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AuditLogPage() {
  const { activeOrgId } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({ search }).toString();
      const res = await fetch(`/api/audit-log?${query}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.auditLogs || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [activeOrgId, search]);

  const handleExportCSV = () => {
    window.location.href = `/api/audit-log?format=csv&search=${encodeURIComponent(search)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 w-full"
    >
      {/* Eye-catching Hero Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-[#F5F0E8] flex items-center gap-3">
            <FileCheck2 className="h-8 w-8 text-[#E8B563]" />
            Immutable Audit Trail Log
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-[#8A8A8A] mt-1.5 font-medium">
            Every AI recommendation, policy decision, and human merchant approval logged automatically
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#E8B563] to-[#D4A574] hover:opacity-95 text-[#0A0A0A] font-extrabold text-xs shadow-md transition-all flex items-center gap-2 self-start sm:self-auto hover:scale-[1.02] active:scale-[0.98]"
        >
          <Download className="h-4 w-4" />
          <span>Export Audit Log CSV</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121212] shadow-sm flex items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400 dark:text-[#8A8A8A]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search audit trail by recommendation, policy, or outcome..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1A1A1A] text-slate-900 dark:text-[#F5F0E8] text-sm focus:ring-2 focus:ring-[#E8B563] outline-none font-medium placeholder-slate-400"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121212] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 text-slate-700 dark:text-[#8A8A8A] font-extrabold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-6 py-4.5">Timestamp</th>
                <th className="px-6 py-4.5">Transaction</th>
                <th className="px-6 py-4.5">AI Recommendation</th>
                <th className="px-6 py-4.5">Policy Decision</th>
                <th className="px-6 py-4.5">Merchant Approval</th>
                <th className="px-6 py-4.5">Status</th>
                <th className="px-6 py-4.5">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-sm font-semibold text-slate-500 dark:text-[#8A8A8A]">
                    Loading immutable audit trail entries...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-sm font-semibold text-slate-500 dark:text-[#8A8A8A]">
                    No audit records found matching query.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4.5 font-mono text-xs font-semibold text-slate-500 dark:text-[#8A8A8A]">
                      {new Date(log.timestamp).toLocaleString('en-IN', {
                        month: 'short',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                    <td className="px-6 py-4.5 font-mono font-extrabold text-sm text-slate-900 dark:text-[#F5F0E8]">
                      {log.transaction?.transactionId || 'N/A'}
                    </td>
                    <td className="px-6 py-4.5 font-bold text-sm text-slate-900 dark:text-[#F5F0E8]">
                      {log.aiRecommendation}
                    </td>
                    <td className="px-6 py-4.5 font-mono text-xs font-bold text-slate-600 dark:text-[#8A8A8A]">
                      {log.policyDecision}
                    </td>
                    <td className="px-6 py-4.5 font-extrabold text-xs text-[#E8B563]">
                      {log.merchantApproval}
                    </td>
                    <td className="px-6 py-4.5">
                      <span
                        className={`px-3 py-1 rounded-xl text-xs font-extrabold font-mono border tracking-tight ${
                          log.status === 'SUCCESS'
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                            : log.status === 'PENDING'
                            ? 'bg-[#E8B563]/15 text-amber-900 dark:text-[#E8B563] border-[#E8B563]/40'
                            : 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 text-slate-600 dark:text-[#8A8A8A] text-xs font-medium max-w-xs truncate">
                      {log.outcome}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
