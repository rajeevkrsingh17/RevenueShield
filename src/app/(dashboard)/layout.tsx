'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthContext';
import { AppHeader } from '@/components/layout/AppHeader';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0A] flex flex-col items-center justify-center space-y-4 transition-colors duration-300">
        <div className="relative flex h-12 w-12 items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E8B563]"></div>
          <div className="absolute h-6 w-6 rounded-full bg-[#E8B563]/20"></div>
        </div>
        <div className="text-xs font-mono text-slate-500 dark:text-[#8A8A8A] animate-pulse">Initializing RevenueShield Ops Context...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0A] text-slate-900 dark:text-[#F5F0E8] transition-colors duration-300 relative overflow-hidden">
      {/* Subtle Golden Ambient Glow Backdrop */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1800px] h-64 bg-gradient-to-b from-[#E8B563]/15 via-[#E8B563]/5 to-transparent dark:from-[#E8B563]/12 dark:via-indigo-950/20 dark:to-transparent blur-3xl opacity-70 z-0" />

      <AppHeader />
      <main className="pt-[100px] min-h-screen relative z-10">
        <div className="pt-3 pb-8 px-4 sm:px-6 lg:px-8 max-w-[1800px] w-full mx-auto space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
}
