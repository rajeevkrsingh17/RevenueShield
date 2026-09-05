'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/AuthContext';
import { Bell, CheckCheck, AlertTriangle, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AlertsPage() {
  const { activeOrgId, refreshNotifications } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/alerts');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [activeOrgId]);

  const handleMarkRead = async (id: string) => {
    await fetch('/api/alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notificationId: id }),
    });
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    refreshNotifications();
  };

  const handleMarkAllRead = async () => {
    await fetch('/api/alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markAllRead: true }),
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    refreshNotifications();
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
            <Bell className="h-8 w-8 text-[#E8B563]" />
            Alerts & Security Feed
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-[#8A8A8A] mt-1.5 font-medium">
            Real-time notification stream for bank anomalies, gateway downtime, and recovery executions
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="px-5 py-3 rounded-xl bg-white dark:bg-[#141414] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-[#F5F0E8] hover:bg-slate-100 dark:hover:bg-white/10 font-extrabold text-xs transition-colors flex items-center gap-2 shadow-sm shrink-0"
        >
          <CheckCheck className="h-4 w-4 text-[#E8B563]" />
          <span>Mark All as Read</span>
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-sm font-semibold text-slate-500 dark:text-[#8A8A8A]">Loading notification feed...</div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center text-sm font-semibold text-slate-500 dark:text-[#8A8A8A]">No alerts reported.</div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-5 md:p-6 rounded-2xl border flex items-start justify-between gap-4 transition-all ${
                n.isRead
                  ? 'bg-white/60 dark:bg-white/5 border-slate-200 dark:border-white/10 opacity-75'
                  : 'bg-white dark:bg-[#121212] border-[#E8B563]/40 shadow-md'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-xl shrink-0 mt-0.5 ${
                    n.type === 'ANOMALY'
                      ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      : n.type === 'ACTION'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'bg-[#E8B563]/15 text-[#E8B563]'
                  }`}
                >
                  {n.type === 'ANOMALY' ? (
                    <AlertTriangle className="h-6 w-6" />
                  ) : n.type === 'ACTION' ? (
                    <Zap className="h-6 w-6" />
                  ) : (
                    <Bell className="h-6 w-6" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-extrabold text-slate-900 dark:text-[#F5F0E8]">{n.title}</span>
                    {!n.isRead && (
                      <span className="text-[10px] font-extrabold font-mono px-2 py-0.5 rounded bg-[#E8B563] text-[#0A0A0A]">
                        NEW
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-[#8A8A8A] leading-relaxed font-medium">{n.message}</p>
                  <div className="text-xs text-slate-500 dark:text-[#8A8A8A] font-mono pt-1">
                    {new Date(n.createdAt).toLocaleString('en-IN', {
                      month: 'short',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>

              {!n.isRead && (
                <button
                  onClick={() => handleMarkRead(n.id)}
                  className="px-4 py-2 rounded-xl text-xs font-extrabold text-[#E8B563] hover:bg-[#E8B563]/10 transition-colors shrink-0"
                >
                  Mark read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
