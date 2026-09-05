'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Logo } from '@/components/common/Logo';
import {
  ArrowRight,
  ChevronDown,
  Activity,
  Sun,
  Moon,
} from 'lucide-react';

export default function PublicLandingPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [simulatedRecovered, setSimulatedRecovered] = useState(false);
  const [hoveredMerchant, setHoveredMerchant] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const merchantLogos = [
    { id: 'cred', name: 'CRED', label: 'CRED', brandColor: '#10B981', glowColor: 'rgba(16, 185, 129, 0.3)', recovered: '₹4.2 Cr' },
    { id: 'bms', name: 'BookMyShow', label: 'bookmyshow', brandColor: '#E50914', glowColor: 'rgba(229, 9, 20, 0.35)', recovered: '₹3.8 Cr', italic: true },
    { id: 'ola', name: 'OLA', label: 'OLA', brandColor: '#059669', glowColor: 'rgba(52, 183, 108, 0.35)', recovered: '₹6.1 Cr' },
    { id: 'zomato', name: 'Zomato', label: 'zomato', brandColor: '#CB202D', glowColor: 'rgba(203, 32, 45, 0.35)', recovered: '₹9.4 Cr', italic: true },
    { id: 'blinkit', name: 'Blinkit', label: 'blinkit', brandColor: '#D97706', glowColor: 'rgba(247, 198, 0, 0.35)', recovered: '₹5.6 Cr' },
    { id: 'zepto', name: 'Zepto', label: 'zepto', brandColor: '#8B5CF6', glowColor: 'rgba(157, 78, 221, 0.35)', recovered: '₹4.9 Cr' },
    { id: 'swiggy', name: 'Swiggy', label: 'SWIGGY', brandColor: '#EA580C', glowColor: 'rgba(252, 128, 25, 0.35)', recovered: '₹8.7 Cr' },
    { id: 'lenskart', name: 'Lenskart', label: 'lenskart', brandColor: '#0D9488', glowColor: 'rgba(0, 160, 153, 0.35)', recovered: '₹3.1 Cr' },
    { id: 'urban', name: 'Urban Company', label: 'Urban Company', brandColor: '#6366F1', glowColor: 'rgba(108, 92, 231, 0.35)', recovered: '₹2.8 Cr' },
    { id: 'nykaa', name: 'Nykaa', label: 'NYKAA', brandColor: '#DB2777', glowColor: 'rgba(252, 39, 121, 0.35)', recovered: '₹5.1 Cr', italic: true },
  ];

  const featureRows = [
    {
      label: 'Real-time Detection',
      description: 'Detects HDFC UPI timeouts, 3DS OTP delays, and gateway downtime in under 500ms.',
    },
    {
      label: 'AI-Scored Recovery',
      description: 'Derived probability scoring calculates optimal backoff retries & instant WhatsApp payment links.',
    },
    {
      label: '1-Click Approval',
      description: 'Merchants approve machine recommended actions with weighted outcome resolutions.',
    },
    {
      label: 'Immutable Audit Trail',
      description: 'Every recommendation, merchant approval, and outcome is logged automatically to an audit trail.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0A] text-slate-900 dark:text-[#F5F0E8] font-sans selection:bg-[#E8B563]/30 selection:text-[#E8B563] overflow-x-hidden transition-colors duration-300">
      {/* Top Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 px-6 sm:px-12 py-5 transition-all duration-300 flex items-center justify-between ${
          scrolled
            ? 'bg-white/90 dark:bg-[#0A0A0A]/95 border-b border-slate-200 dark:border-white/10 shadow-2xl backdrop-blur-xl'
            : 'bg-transparent'
        }`}
      >
        <Link href="/" className="hover:scale-105 transition-transform" title="Go to Merchant Dashboard">
          <Logo size="md" variant="gold" />
        </Link>

        <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600 dark:text-[#8A8A8A]">
          <Link href="/" className="group relative py-1 hover:text-amber-600 dark:hover:text-[#E8B563] transition-colors font-bold flex items-center gap-1.5 text-amber-600 dark:text-[#E8B563]">
            <span>Go to Dashboard</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <a href="#merchants" className="group relative py-1 hover:text-slate-900 dark:hover:text-[#F5F0E8] transition-colors">
            <span>Merchants</span>
            <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#E8B563] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"></span>
          </a>
          <a href="#features" className="group relative py-1 hover:text-slate-900 dark:hover:text-[#F5F0E8] transition-colors">
            <span>Capabilities</span>
            <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#E8B563] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"></span>
          </a>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-[#E8B563] transition-all shadow-xs flex items-center justify-center"
              title="Toggle Light/Dark Theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 text-[#E8B563]" /> : <Moon className="h-4 w-4 text-slate-800" />}
            </button>
          )}

          <Link
            href="/"
            className="text-xs font-bold text-amber-600 dark:text-[#E8B563] bg-[#E8B563]/15 border border-[#E8B563]/30 hover:bg-[#E8B563]/25 transition-all px-3 py-2 rounded-xl flex items-center gap-1.5"
          >
            <span>Dashboard</span>
          </Link>

          <Link
            href="/login"
            className="text-xs font-semibold text-slate-600 dark:text-[#8A8A8A] hover:text-slate-900 dark:hover:text-[#F5F0E8] transition-colors px-3 py-2"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E8B563] via-amber-500 to-[#E8B563] text-slate-950 font-extrabold text-xs transition-all hover:scale-[1.03] active:scale-[0.98] shadow-lg shadow-[#E8B563]/25 flex items-center gap-2"
          >
            <span>Get Started</span>
            <ArrowRight className="h-4 w-4 stroke-[2.5]" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-36 pb-16 px-6 sm:px-12 max-w-6xl mx-auto min-h-[85vh] flex flex-col justify-between">
        {/* Ambient Gold Glow Mesh */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-gradient-to-b from-[#E8B563]/20 via-[#E8B563]/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-6 max-w-4xl pt-8 z-10">
          {/* Main Headline */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05]">
            <div className="text-slate-900 dark:text-[#F5F0E8]">Think you can recover failed payments?</div>
            <div className="text-amber-600 dark:text-[#E8B563] font-serif italic mt-2">Prove it.</div>
          </h1>

          {/* Subtext */}
          <p className="text-slate-600 dark:text-[#8A8A8A] text-sm sm:text-base max-w-lg leading-relaxed font-normal">
            Autonomous payment failure recovery and real-time bank downtime leakage intelligence built for high-volume checkout pipelines.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#E8B563] via-amber-500 to-[#E8B563] text-slate-950 font-extrabold text-sm transition-all hover:scale-[1.03] active:scale-[0.98] shadow-xl shadow-[#E8B563]/25 flex items-center justify-center gap-2"
            >
              <span>Launch Merchant Workspace</span>
              <ArrowRight className="h-5 w-5 stroke-[2.5]" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-900 dark:text-[#F5F0E8] font-bold text-sm transition-all hover:scale-[1.02] text-center shadow-xs"
            >
              Sign In to Sandbox
            </Link>
          </div>
        </div>

        {/* Hero Bottom Meta Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-12 border-t border-slate-200 dark:border-white/10 text-xs text-slate-500 dark:text-[#8A8A8A] font-mono uppercase tracking-wider mt-16 z-10">
          <div className="flex flex-wrap items-center gap-4">
            <span>/ Real-time detection</span>
            <span>/ AI-scored recovery</span>
            <span>/ Full audit trail</span>
          </div>

          <div className="flex items-center gap-3 font-mono text-amber-600 dark:text-[#E8B563]">
            <span>UTCS TIME</span>
            <span className="font-bold text-slate-900 dark:text-white bg-slate-200 dark:bg-white/5 px-2.5 py-1 rounded border border-slate-300 dark:border-white/10">
              {currentTime || '23:47:08'}
            </span>
          </div>
        </div>

        {/* Bouncing Scroll Indicator */}
        <div className="mt-8 flex flex-col items-center gap-1 text-[10px] font-mono tracking-widest text-slate-500 dark:text-[#8A8A8A] uppercase">
          <span>SCROLL FOR MERCHANTS</span>
          <ChevronDown className="h-4 w-4 text-amber-600 dark:text-[#E8B563] animate-bounce" />
        </div>
      </section>

      {/* Top Indian Merchants Showcase Section */}
      <section id="merchants" className="py-16 px-6 sm:px-12 bg-slate-100/80 dark:bg-[#0E0E0E] border-y border-slate-200 dark:border-white/10">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <div className="text-[11px] font-mono font-bold text-amber-600 dark:text-[#E8B563] uppercase tracking-widest">
              TRUSTED BY HIGH-VOLUME CHECKOUT PIPELINES
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-[#F5F0E8] tracking-tight">
              Empowering India&apos;s Top E-Commerce & Merchant Platforms
            </h3>
          </div>

          {/* Interactive Merchant Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 pt-4">
            {merchantLogos.map((m) => {
              const isHovered = hoveredMerchant === m.id;
              const isDark = theme === 'dark';
              return (
                <div
                  key={m.id}
                  onMouseEnter={() => setHoveredMerchant(m.id)}
                  onMouseLeave={() => setHoveredMerchant(null)}
                  style={{
                    boxShadow: isHovered ? `0 0 25px ${m.glowColor}` : 'none',
                    borderColor: isHovered ? m.brandColor : (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'),
                  }}
                  className="group relative p-5 rounded-2xl border bg-white dark:bg-[#141414] hover:bg-slate-50 dark:hover:bg-[#1A1A1A] transition-all duration-300 cursor-pointer flex flex-col items-center justify-center space-y-2 select-none transform hover:-translate-y-1 shadow-sm"
                >
                  {/* Brand Label */}
                  <span
                    style={{
                      color: isHovered ? m.brandColor : (isDark ? '#A0A0A0' : '#334155'),
                    }}
                    className={`text-base font-black tracking-tight transition-colors duration-300 ${
                      m.italic ? 'italic font-serif' : ''
                    }`}
                  >
                    {m.label}
                  </span>

                  {/* Recovery Stat Badge */}
                  <div
                    style={{
                      backgroundColor: isHovered ? `${m.brandColor}20` : (isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'),
                      color: isHovered ? m.brandColor : (isDark ? '#8A8A8A' : '#64748B'),
                      borderColor: isHovered ? `${m.brandColor}40` : 'transparent',
                    }}
                    className="px-2.5 py-0.5 rounded-full border text-[10.5px] font-mono font-semibold transition-all duration-300"
                  >
                    {m.recovered} Recovered
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Statement Section */}
      <section className="py-24 px-6 sm:px-12 max-w-6xl mx-auto">
        <div className="space-y-6 max-w-4xl">
          <div className="text-xs font-mono font-bold uppercase tracking-widest text-amber-600 dark:text-[#E8B563] flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span>THE NIGHT PAYS OFF</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-[#F5F0E8] tracking-tight leading-snug">
            We recover the payment,{' '}
            <span className="text-amber-600 dark:text-[#E8B563] font-serif italic">not just flag it.</span>
          </h2>

          <p className="text-slate-600 dark:text-[#8A8A8A] text-base max-w-2xl leading-relaxed">
            While basic analytics tools display static failure charts, RevenueShield executes automated backoff retries and dispatches instant WhatsApp links to turn lost transactions into settled revenue.
          </p>
        </div>
      </section>

      {/* Feature Rows Section */}
      <section id="features" className="py-24 bg-slate-100/80 dark:bg-[#0E0E0E] border-t border-slate-200 dark:border-white/10">
        <div className="max-w-6xl mx-auto px-6 sm:px-12 space-y-16">
          <div className="space-y-2">
            <div className="text-xs font-mono font-bold text-amber-600 dark:text-[#E8B563] uppercase tracking-widest">
              07:20 / CAPABILITIES
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-[#F5F0E8] tracking-tight">
              Engineered for high-volume{' '}
              <span className="text-amber-600 dark:text-[#E8B563] font-serif italic">payment checkout pipelines.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* Feature Rows */}
            <div className="lg:col-span-2 space-y-0 divide-y divide-slate-200 dark:divide-white/10 border-y border-slate-200 dark:border-white/10">
              {featureRows.map((row, idx) => (
                <div
                  key={idx}
                  className="group py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:bg-slate-200/50 dark:hover:bg-white/[0.02] px-2"
                >
                  <div className="w-56 font-bold text-sm text-slate-900 dark:text-[#F5F0E8] group-hover:text-amber-600 dark:group-hover:text-[#E8B563] transition-colors">
                    {row.label}
                  </div>
                  <div className="flex-1 text-xs text-slate-600 dark:text-[#8A8A8A] leading-relaxed font-medium">
                    {row.description}
                  </div>
                </div>
              ))}
            </div>

            {/* Illustrative Angled Mockup Card */}
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/15 bg-white dark:bg-gradient-to-b dark:from-[#181818] dark:to-[#121212] shadow-2xl space-y-4 transform lg:-rotate-2 hover:rotate-0 transition-transform duration-300">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#8A8A8A] font-mono">
                <span>pay_9F82K7XP</span>
                <span className="text-amber-600 dark:text-[#E8B563] font-bold">88% Recovery Prob</span>
              </div>
              <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">₹14,999</div>
              <div className="text-xs text-slate-500 dark:text-[#8A8A8A]">Rahul Sharma • 3D Secure Timeout</div>

              <button
                onClick={() => setSimulatedRecovered(!simulatedRecovered)}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow ${
                  simulatedRecovered
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                    : 'bg-gradient-to-r from-[#E8B563] via-amber-500 to-[#E8B563] text-slate-950 hover:scale-[1.02]'
                }`}
              >
                {simulatedRecovered ? '✓ Recovered ₹14,999' : '⚡ Simulate AI Recovery'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#0A0A0A] text-center text-xs text-slate-500 dark:text-[#8A8A8A] font-mono">
        RevenueShield • Payment Failure Recovery Platform
      </footer>
    </div>
  );
}
