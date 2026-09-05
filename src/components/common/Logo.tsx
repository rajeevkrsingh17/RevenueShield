'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'gold';
}

export function Logo({ size = 'md', variant = 'default' }: LogoProps) {
  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-7 w-7',
  };

  const containerSizes = {
    sm: 'h-7 w-7 rounded-lg',
    md: 'h-9 w-9 rounded-xl',
    lg: 'h-12 w-12 rounded-2xl',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm font-bold',
    lg: 'text-xl font-extrabold',
  };

  return (
    <div className="flex items-center gap-2.5 select-none">
      <div
        className={`${containerSizes[size]} flex items-center justify-center shrink-0 relative ${
          variant === 'gold'
            ? 'bg-gradient-to-tr from-[#E8B563] via-[#D4A574] to-[#F5F0E8] text-[#0A0A0A] shadow-md shadow-[#E8B563]/20'
            : 'bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/30'
        }`}
      >
        <ShieldCheck className={iconSizes[size]} />
      </div>

      <div className={`tracking-tight ${textSizes[size]} flex items-center`}>
        <span className={variant === 'gold' ? 'text-slate-900 dark:text-[#F5F0E8]' : 'text-slate-900 dark:text-white'}>Revenue</span>
        <span
          className={
            variant === 'gold'
              ? 'text-[#E8B563] ml-0.5 font-serif italic'
              : 'bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent ml-0.5'
          }
        >
          Shield
        </span>
      </div>
    </div>
  );
}
