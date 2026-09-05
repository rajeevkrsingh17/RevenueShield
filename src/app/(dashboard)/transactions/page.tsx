'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/AuthContext';
import { Search, ChevronLeft, ChevronRight, Receipt } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TransactionsPage() {
  const { activeOrgId } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchTransactions = async (page = 1) => {
    try {
      setLoading(true);
      const query = new URLSearchParams({
        status: statusFilter,
        search,
        page: page.toString(),
        limit: '15',
      }).toString();

      const res = await fetch(`/api/transactions?${query}`);
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions || []);
        setPagination(data.pagination || { page: 1, totalPages: 1, total: 0 });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(1);
  }, [activeOrgId, statusFilter, search]);

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
          <Receipt className="h-6 w-6 text-[#E8B563]" />
          Transactions Registry
        </h1>
        <p className="text-xs text-slate-500 dark:text-[#8A8A8A] mt-0.5 font-medium">
          Full paginated record of all attempted, failed, and AI recovered payments
        </p>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121212] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400 dark:text-[#8A8A8A]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, Customer, Bank..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1A1A1A] text-slate-900 dark:text-[#F5F0E8] text-xs focus:ring-2 focus:ring-[#E8B563] outline-none font-medium placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
          {['ALL', 'RECOVERABLE', 'RECOVERED', 'LOST', 'FAILED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                statusFilter === st
                  ? 'bg-[#E8B563] text-[#0A0A0A] shadow-xs'
                  : 'text-slate-600 dark:text-[#8A8A8A] hover:text-slate-900 dark:hover:text-[#F5F0E8]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Clean Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121212] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-[#8A8A8A] font-bold uppercase tracking-wider text-[10.5px]">
              <tr>
                <th className="px-5 py-3.5">Transaction ID</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Method & Gateway</th>
                <th className="px-5 py-3.5">Failure Reason</th>
                <th className="px-5 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-xs font-semibold text-slate-500 dark:text-[#8A8A8A]">
                    Fetching transaction history...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-xs font-semibold text-slate-500 dark:text-[#8A8A8A]">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-xs text-slate-900 dark:text-[#F5F0E8]">{tx.transactionId}</td>
                    <td className="px-5 py-3.5 text-slate-500 dark:text-[#8A8A8A] text-[11px]">
                      {new Date(tx.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-xs text-slate-900 dark:text-[#F5F0E8]">{tx.customerName}</td>
                    <td className="px-5 py-3.5 font-mono font-bold text-xs text-slate-900 dark:text-[#F5F0E8]">
                      ₹{tx.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-[#8A8A8A] font-medium">
                      {tx.paymentMethod} ({tx.bank})
                    </td>
                    <td className="px-5 py-3.5 text-slate-900 dark:text-[#F5F0E8] font-semibold text-xs">{tx.failureReason}</td>
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-[#8A8A8A]">
          <div>
            Showing Page <span className="font-bold text-slate-900 dark:text-[#F5F0E8]">{pagination.page}</span> of{' '}
            <span className="font-bold text-slate-900 dark:text-[#F5F0E8]">{pagination.totalPages}</span> ({pagination.total} total items)
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchTransactions(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-2 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#141414] disabled:opacity-50 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => fetchTransactions(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="p-2 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#141414] disabled:opacity-50 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
