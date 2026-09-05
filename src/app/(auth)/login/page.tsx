'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldAlert, ArrowRight, Lock, Mail } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@revenueshield.ai');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { refreshAuth } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed');
      } else {
        await refreshAuth();
        router.push('/');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background ambient glow matching theme */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-b from-[#E8B563]/20 via-indigo-600/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#E8B563] via-amber-500 to-[#E8B563] text-slate-950 shadow-xl shadow-[#E8B563]/30 border border-[#E8B563]/50 mb-2">
            <ShieldAlert className="h-7 w-7 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">Sign in to RevenueShield</h1>
          <p className="text-xs font-medium text-muted-foreground">Razorpay AI Payment Failure Recovery Platform</p>
        </div>

        {/* Demo Credentials Alert Banner */}
        <div className="p-4 rounded-xl border border-[#E8B563]/40 bg-[#E8B563]/10 text-xs text-amber-900 dark:text-[#E8B563] space-y-1.5 shadow-sm">
          <div className="font-bold flex items-center gap-1.5">🔑 Quick Demo Credentials Included</div>
          <div className="flex items-center justify-between">
            <span className="opacity-80">Email:</span>
            <code className="font-mono bg-[#E8B563]/20 dark:bg-black/60 px-2 py-0.5 rounded text-amber-950 dark:text-[#E8B563] border border-[#E8B563]/30 font-bold">admin@revenueshield.ai</code>
          </div>
          <div className="flex items-center justify-between">
            <span className="opacity-80">Password:</span>
            <code className="font-mono bg-[#E8B563]/20 dark:bg-black/60 px-2 py-0.5 rounded text-amber-950 dark:text-[#E8B563] border border-[#E8B563]/30 font-bold">password123</code>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 rounded-2xl border border-[#E8B563]/30 bg-card/90 backdrop-blur-xl shadow-2xl space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs focus:ring-2 focus:ring-[#E8B563] focus:border-[#E8B563] outline-none font-medium transition-all"
                placeholder="name@company.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs focus:ring-2 focus:ring-[#E8B563] focus:border-[#E8B563] outline-none font-medium transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#E8B563] via-amber-500 to-[#E8B563] text-slate-950 font-bold text-xs hover:brightness-110 active:scale-[0.99] transition-all shadow-lg shadow-[#E8B563]/25 flex items-center justify-center gap-2"
          >
            {submitting ? 'Authenticating...' : 'Sign In to Workspace'}
            <ArrowRight className="h-4 w-4 stroke-[2.5]" />
          </button>
        </form>

        <div className="text-center text-xs text-muted-foreground font-medium">
          Don't have a merchant workspace?{' '}
          <Link href="/signup" className="text-[#E8B563] font-bold hover:underline">
            Create new merchant organization
          </Link>
        </div>
      </div>
    </div>
  );
}
