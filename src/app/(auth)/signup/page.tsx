'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldAlert, ArrowRight, Lock, Mail, User, Building2 } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthContext';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { refreshAuth } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, organizationName }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Signup failed');
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
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">Create Merchant Account</h1>
          <p className="text-xs font-medium text-muted-foreground">Start recovering failed Razorpay payments automatically</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 rounded-2xl border border-[#E8B563]/30 bg-card/90 backdrop-blur-xl shadow-2xl space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-background text-foreground text-xs focus:ring-2 focus:ring-[#E8B563] focus:border-[#E8B563] outline-none font-medium transition-all"
                placeholder="Rajeev Singh"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Organization Name</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-background text-foreground text-xs focus:ring-2 focus:ring-[#E8B563] focus:border-[#E8B563] outline-none font-medium transition-all"
                placeholder="Acme SaaS India"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Work Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-background text-foreground text-xs focus:ring-2 focus:ring-[#E8B563] focus:border-[#E8B563] outline-none font-medium transition-all"
                placeholder="rajeev@acmesaas.in"
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
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-background text-foreground text-xs focus:ring-2 focus:ring-[#E8B563] focus:border-[#E8B563] outline-none font-medium transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#E8B563] via-amber-500 to-[#E8B563] text-slate-950 font-bold text-xs hover:brightness-110 active:scale-[0.99] transition-all shadow-lg shadow-[#E8B563]/25 flex items-center justify-center gap-2 mt-2"
          >
            {submitting ? 'Creating Merchant Org...' : 'Initialize Merchant Account'}
            <ArrowRight className="h-4 w-4 stroke-[2.5]" />
          </button>
        </form>

        <div className="text-center text-xs text-muted-foreground font-medium">
          Already have an account?{' '}
          <Link href="/login" className="text-[#E8B563] font-bold hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
