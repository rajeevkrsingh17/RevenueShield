'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/AuthContext';
import {
  Search,
  Zap,
  CheckCircle2,
  XCircle,
  X,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PaymentRecoveryPage() {
  const { activeOrgId } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('RECOVERABLE');
  const [methodFilter, setMethodFilter] = useState('ALL');
  const [selectedTx, setSelectedTx] = useState<any | null>(null);
  const [executingId, setExecutingId] = useState<string | null>(null);
  const [lastActionResult, setLastActionResult] = useState<any | null>(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({
        status: statusFilter,
        method: methodFilter,
        search,
        limit: '50',
      }).toString();

      const res = await fetch(`/api/transactions?${query}`);
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [activeOrgId, statusFilter, methodFilter, search]);

  const handleExecuteAction = async (txId: string, actionType: string) => {
    try {
      setExecutingId(txId);
      const res = await fetch(`/api/transactions/${txId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionType }),
      });

      if (res.ok) {
        const data = await res.json();
        setLastActionResult(data);
        if (selectedTx?.id === txId) {
          setSelectedTx(data.transaction);
        }
        await fetchTransactions();
      }
    } catch (e) {
      console.error('Execution failed', e);
    } finally {
      setExecutingId(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-5 w-full"
    >
      {/* Clean Minimal Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-[#F5F0E8] flex items-center gap-2.5">
          <Zap className="h-6 w-6 text-[#E8B563]" />
          Payment Recovery Engine
        </h1>
        <p className="text-xs text-slate-500 dark:text-[#8A8A8A] mt-0.5 font-medium">
          Approve AI recommended smart retries, payment method switching, or automated customer recovery links
        </p>
      </div>

      {/* State Change Result Toast */}
      {lastActionResult && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-bold shadow-md ${
            lastActionResult.isSuccessful
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-400'
          }`}
        >
          <div className="flex items-center gap-2">
            {lastActionResult.isSuccessful ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            <span>{lastActionResult.auditLog.outcome}</span>
          </div>
          <button onClick={() => setLastActionResult(null)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}

      {/* Clean Minimal Filter Bar */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121212] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400 dark:text-[#8A8A8A]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ID, customer, bank..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1A1A1A] text-slate-900 dark:text-[#F5F0E8] text-xs focus:ring-2 focus:ring-[#E8B563] outline-none font-medium placeholder-slate-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
            {['RECOVERABLE', 'RECOVERED', 'LOST', 'ALL'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all tracking-tight ${
                  statusFilter === st
                    ? 'bg-[#E8B563] text-[#0A0A0A] shadow-xs'
                    : 'text-slate-600 dark:text-[#8A8A8A] hover:text-slate-900 dark:hover:text-[#F5F0E8]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Payment Method Selector */}
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1A1A1A] text-slate-900 dark:text-[#F5F0E8] text-xs focus:ring-2 focus:ring-[#E8B563] outline-none font-semibold cursor-pointer"
          >
            <option value="ALL">All Methods</option>
            <option value="UPI">UPI</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Netbanking">Netbanking</option>
          </select>
        </div>
      </div>

      {/* Clean Minimal Table matching User Screenshot */}
      <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121212] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-[#8A8A8A] font-bold uppercase tracking-wider text-[10.5px]">
              <tr>
                <th className="px-5 py-3.5">Transaction ID</th>
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Failure Reason</th>
                <th className="px-5 py-3.5">Recovery Probability</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-xs font-semibold text-slate-500 dark:text-[#8A8A8A]">
                    Querying live payment recovery database...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-xs font-semibold text-slate-500 dark:text-[#8A8A8A]">
                    No transactions match current filters.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    onClick={() => setSelectedTx(tx)}
                    className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    <td className="px-5 py-3.5 font-mono font-bold text-xs text-slate-900 dark:text-[#F5F0E8]">
                      {tx.transactionId}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-xs text-slate-900 dark:text-[#F5F0E8]">{tx.customerName}</div>
                      <div className="text-[10.5px] text-slate-500 dark:text-[#8A8A8A]">{tx.customerTier} Tier</div>
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-xs text-slate-900 dark:text-[#F5F0E8]">
                      ₹{tx.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="text-slate-900 dark:text-[#F5F0E8] font-bold text-xs">{tx.failureReason}</div>
                      <div className="text-[10.5px] text-slate-500 dark:text-[#8A8A8A]">
                        {tx.paymentMethod} • {tx.bank}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-16 bg-slate-200 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              tx.recoveryProbability > 0.7
                                ? 'bg-emerald-500'
                                : tx.recoveryProbability > 0.4
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${tx.recoveryProbability * 100}%` }}
                          ></div>
                        </div>
                        <span className="font-mono font-bold text-xs text-slate-900 dark:text-[#F5F0E8]">
                          {Math.round(tx.recoveryProbability * 100)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-[10.5px] font-bold font-mono border ${
                          tx.status === 'RECOVERED'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                            : tx.status === 'RECOVERABLE'
                            ? 'bg-[#E8B563]/15 text-amber-800 dark:text-[#E8B563] border-[#E8B563]/30'
                            : tx.status === 'LOST'
                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                            : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-[#8A8A8A] border-slate-200'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      {tx.status === 'RECOVERABLE' ? (
                        <button
                          onClick={() => handleExecuteAction(tx.id, tx.recommendedAction)}
                          disabled={executingId === tx.id}
                          className="px-3 py-1.5 rounded-xl bg-[#E8B563] hover:bg-[#d8a553] text-[#0A0A0A] font-extrabold text-xs shadow-xs hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5 ml-auto"
                        >
                          <Zap className="h-3.5 w-3.5" />
                          <span>{executingId === tx.id ? 'Processing...' : 'Approve Action'}</span>
                        </button>
                      ) : (
                        <span className="text-slate-400 dark:text-[#8A8A8A] text-[11px] font-mono">Resolved</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Detail Drawer */}
      <AnimatePresence>
        {selectedTx && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-white dark:bg-[#121212] border-l border-slate-200 dark:border-white/10 h-full p-6 space-y-6 overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-[#F5F0E8] font-mono">{selectedTx.transactionId}</h3>
                  <p className="text-xs text-slate-500 dark:text-[#8A8A8A]">Transaction Detail & AI Diagnostics</p>
                </div>
                <button onClick={() => setSelectedTx(null)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Status Badge */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-[#8A8A8A]">Current Status</span>
                  <span className="text-xs font-bold font-mono text-[#E8B563] uppercase">{selectedTx.status}</span>
                </div>
                <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-[#F5F0E8]">
                  ₹{selectedTx.amount.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-slate-500 dark:text-[#8A8A8A]">
                  Expected Recovery: <span className="font-bold text-slate-900 dark:text-[#F5F0E8]">₹{selectedTx.expectedRecoveryAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Customer & Bank Info */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold text-slate-500 dark:text-[#8A8A8A] uppercase tracking-wider">
                  Context Metadata
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1A1A1A]">
                    <div className="text-slate-500 dark:text-[#8A8A8A]">Customer</div>
                    <div className="font-bold text-slate-900 dark:text-[#F5F0E8] mt-0.5">{selectedTx.customerName}</div>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1A1A1A]">
                    <div className="text-slate-500 dark:text-[#8A8A8A]">Gateway / Bank</div>
                    <div className="font-bold text-slate-900 dark:text-[#F5F0E8] mt-0.5">{selectedTx.bank}</div>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1A1A1A]">
                    <div className="text-slate-500 dark:text-[#8A8A8A]">Payment Method</div>
                    <div className="font-bold text-slate-900 dark:text-[#F5F0E8] mt-0.5">{selectedTx.paymentMethod}</div>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1A1A1A]">
                    <div className="text-slate-500 dark:text-[#8A8A8A]">Failure Category</div>
                    <div className="font-bold text-slate-900 dark:text-[#F5F0E8] mt-0.5">{selectedTx.failureCategory}</div>
                  </div>
                </div>
              </div>

              {/* AI Recovery Scoring */}
              <div className="p-4 rounded-xl border border-[#E8B563]/30 bg-[#E8B563]/10 space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#E8B563]" />
                  <span className="text-xs font-bold text-slate-900 dark:text-[#F5F0E8]">AI Action Recommendation</span>
                </div>
                <div className="text-sm font-extrabold text-[#E8B563]">{selectedTx.recommendedAction}</div>
                <div className="text-xs text-slate-600 dark:text-[#8A8A8A] leading-relaxed">
                  Derived from {selectedTx.failureReason} pattern history across Razorpay bank routes.
                </div>
              </div>

              {/* Action Buttons */}
              {selectedTx.status === 'RECOVERABLE' && (
                <button
                  onClick={() => handleExecuteAction(selectedTx.id, selectedTx.recommendedAction)}
                  disabled={executingId === selectedTx.id}
                  className="w-full py-3 rounded-xl bg-[#E8B563] hover:bg-[#d8a553] text-[#0A0A0A] font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Zap className="h-4 w-4" />
                  <span>{executingId === selectedTx.id ? 'Executing State Transition...' : 'Approve Recommended Action'}</span>
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
