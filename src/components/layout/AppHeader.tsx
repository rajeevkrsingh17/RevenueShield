'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useAuth } from '@/components/providers/AuthContext';
import { useDropdown, DropdownType } from '@/components/providers/DropdownContext';
import { useClickOutside } from '@/hooks/useClickOutside';
import { Logo } from '@/components/common/Logo';
import {
  Building2,
  ChevronDown,
  Sun,
  Moon,
  Bell,
  LogOut,
  Settings,
  Check,
  CheckCheck,
  LayoutDashboard,
  TrendingUp,
  RefreshCw,
  Receipt,
  Cpu,
  Bot,
  BarChart3,
  FileCheck2,
  Menu,
  X,

} from 'lucide-react';
import { motion } from 'framer-motion';

export function AppHeader() {
  const { theme, setTheme } = useTheme();
  const { user, organizations, activeOrgId, switchOrganization, logout, unreadCount, refreshNotifications } = useAuth();
  const { activeDropdown, setActiveDropdown, closeAllDropdowns } = useDropdown();
  const pathname = usePathname();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useClickOutside(headerRef, () => closeAllDropdowns(), activeDropdown !== null);

  useEffect(() => {
    closeAllDropdowns();
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAllDropdowns();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeAllDropdowns]);

  const navItems = [
    { name: 'Overview', href: '/', icon: LayoutDashboard },
    { name: 'Intelligence', href: '/revenue-intelligence', icon: TrendingUp },
    { name: 'Recovery', href: '/payment-recovery', icon: RefreshCw },
    { name: 'Transactions', href: '/transactions', icon: Receipt },
    { name: 'Simulator', href: '/simulator', icon: Cpu },
    { name: 'AI Copilot', href: '/copilot', icon: Bot },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },

    { name: 'Audit Log', href: '/audit-log', icon: FileCheck2 },
    { name: 'Alerts', href: '/alerts', icon: Bell },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const toggleDropdown = async (type: DropdownType) => {
    if (activeDropdown === type) {
      closeAllDropdowns();
    } else {
      setActiveDropdown(type);
      if (type === 'notifications') {
        try {
          const res = await fetch('/api/alerts');
          if (res.ok) {
            const data = await res.json();
            setNotifications(data.notifications || []);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  const handleOrgSelect = async (orgId: string) => {
    closeAllDropdowns();
    await switchOrganization(orgId);
  };

  const handleMarkAllRead = async () => {
    await fetch('/api/alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markAllRead: true }),
    });
    refreshNotifications();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'RS';

  return (
    <div ref={headerRef} className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/10 shadow-xl transition-colors duration-300">
      {/* Top Tier: Logo, Org Switcher & Compact User Profile */}
      <div className="h-14 px-4 md:px-8 flex items-center justify-between border-b border-slate-200/60 dark:border-white/[0.06]">
        {/* Left: Brand Logo + Merchant Org Switcher */}
        <div className="flex items-center gap-4">
          <Link href="/" onClick={closeAllDropdowns} className="flex items-center group transition-transform hover:scale-105 shrink-0">
            <Logo size="md" variant="gold" />
          </Link>

          <div className="h-4 w-[1px] bg-slate-300 dark:bg-white/10 hidden sm:block" />

          {/* Merchant Organization Switcher */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => toggleDropdown('org')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100/80 dark:bg-[#121212] hover:bg-slate-200/60 dark:hover:bg-white/[0.07] hover:border-[#E8B563]/40 active:scale-[0.98] transition-all text-xs font-medium text-slate-900 dark:text-[#F5F0E8] shadow-xs group"
            >
              <Building2 className="h-3.5 w-3.5 text-[#E8B563] group-hover:rotate-12 transition-transform duration-200 shrink-0" />
              <span className="max-w-[150px] truncate font-bold text-[12px]">
                {user?.organizationName || 'Select Merchant Org'}
              </span>
              <ChevronDown className={`h-3.5 w-3.5 text-slate-500 dark:text-[#8A8A8A] transition-transform duration-200 shrink-0 ${activeDropdown === 'org' ? 'rotate-180 text-[#E8B563]' : 'group-hover:text-slate-900 dark:group-hover:text-[#F5F0E8]'}`} />
            </button>

            {activeDropdown === 'org' && (
              <div className="absolute top-full left-0 mt-2 w-64 rounded-2xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#111111] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 backdrop-blur-xl">
                <div className="px-3 py-2 text-[10px] font-bold text-slate-500 dark:text-[#8A8A8A] uppercase tracking-wider">
                  Merchant Organizations
                </div>
                <div className="space-y-1">
                  {organizations.map((org) => {
                    const isSelected = org.id === activeOrgId;
                    return (
                      <button
                        key={org.id}
                        onClick={() => handleOrgSelect(org.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                          isSelected
                            ? 'bg-[#E8B563]/15 text-[#E8B563] font-bold border border-[#E8B563]/30 shadow-xs'
                            : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-800 dark:text-[#F5F0E8]'
                        }`}
                      >
                        <span className="truncate">{org.name}</span>
                        {isSelected && <Check className="h-4 w-4 text-[#E8B563] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Live Pill, Notifications & Compact User Avatar */}
        <div className="flex items-center gap-3 shrink-0">


          {/* Status Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10.5px] font-semibold font-mono tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>LIVE PIPELINE</span>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('notifications')}
              className={`relative p-2 rounded-xl border transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] ${
                activeDropdown === 'notifications'
                  ? 'border-[#E8B563] bg-[#E8B563]/15 text-[#E8B563] shadow-md shadow-[#E8B563]/10'
                  : 'border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-[#141414] hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-[#8A8A8A] hover:text-slate-900 dark:hover:text-[#F5F0E8]'
              }`}
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#E8B563] text-[#0A0A0A] text-[10px] font-bold flex items-center justify-center shadow-md animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {activeDropdown === 'notifications' && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#111111] shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 backdrop-blur-xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10 mb-3">
                  <span className="text-xs font-bold text-slate-900 dark:text-[#F5F0E8]">Notifications & Alerts</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[11px] text-[#E8B563] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <CheckCheck className="h-3.5 w-3.5" /> Mark all read
                    </button>
                  )}
                </div>
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-500 dark:text-[#8A8A8A]">No alerts right now</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 rounded-xl border text-xs transition-colors ${
                          n.isRead
                            ? 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 opacity-70'
                            : 'bg-[#E8B563]/10 border-[#E8B563]/30 font-medium'
                        }`}
                      >
                        <div className="font-bold text-slate-900 dark:text-[#F5F0E8]">{n.title}</div>
                        <div className="text-[11px] text-slate-500 dark:text-[#8A8A8A] mt-0.5">{n.message}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-[#141414] hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-[#8A8A8A] hover:text-[#E8B563] transition-all duration-200"
            title="Toggle Light/Dark Theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-[#E8B563]" /> : <Moon className="h-4 w-4 text-indigo-600" />}
          </button>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('profile')}
              className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border transition-all duration-200 hover:bg-slate-200/70 dark:hover:bg-white/10 ${
                activeDropdown === 'profile'
                  ? 'bg-slate-200/80 dark:bg-white/10 border-slate-300 dark:border-white/20'
                  : 'border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-[#141414]'
              }`}
            >
              <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-[#E8B563] to-[#D4A574] text-[#0A0A0A] font-extrabold text-xs flex items-center justify-center shadow-md shrink-0">
                {userInitials}
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-[#F5F0E8] hidden lg:block max-w-[130px] truncate whitespace-nowrap leading-none shrink-0">
                {user?.name || 'Merchant'}
              </span>
              <ChevronDown className={`h-3.5 w-3.5 text-slate-500 dark:text-[#8A8A8A] shrink-0 transition-transform duration-200 ${activeDropdown === 'profile' ? 'rotate-180 text-[#E8B563]' : ''}`} />
            </button>

            {activeDropdown === 'profile' && (
              <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#111111] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 backdrop-blur-xl">
                <div className="px-3 py-2 border-b border-slate-200 dark:border-white/10 mb-1">
                  <div className="text-xs font-bold text-slate-900 dark:text-[#F5F0E8]">{user?.name}</div>
                  <div className="text-[11px] text-slate-500 dark:text-[#8A8A8A] truncate">{user?.email}</div>
                </div>

                <Link
                  href="/settings"
                  onClick={() => closeAllDropdowns()}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-800 dark:text-[#F5F0E8] hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                >
                  <Settings className="h-4 w-4 text-slate-500 dark:text-[#8A8A8A]" />
                  <span>Settings</span>
                </Link>
                <button
                  onClick={() => {
                    closeAllDropdowns();
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Nav Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-[#141414] text-slate-800 dark:text-[#F5F0E8] lg:hidden hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Sub Tier: Widescreen Horizontal Navigation Bar */}
      <div className="hidden lg:block h-11 px-4 md:px-8 bg-slate-100/90 dark:bg-[#0D0D0D]/60 backdrop-blur-md transition-colors duration-300">
        <nav className="h-full max-w-[1800px] w-full mx-auto flex items-center gap-2 xl:gap-3 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeAllDropdowns}
                className={`group relative h-full flex items-center gap-2 px-3.5 text-xs font-bold transition-all duration-200 select-none whitespace-nowrap ${
                  isActive
                    ? 'text-[#E8B563]'
                    : 'text-slate-600 dark:text-[#8A8A8A] hover:text-slate-900 dark:hover:text-[#F5F0E8] hover:bg-slate-200/50 dark:hover:bg-white/[0.04]'
                }`}
              >
                <Icon
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isActive ? 'text-[#E8B563] scale-110' : 'text-slate-500 dark:text-[#8A8A8A] group-hover:text-[#E8B563] group-hover:scale-110'
                  }`}
                />
                <span className="tracking-tight">{item.name}</span>

                {/* Glowing bottom line active indicator */}
                {isActive ? (
                  <motion.span
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#E8B563] to-[#D4A574] rounded-t-full shadow-[0_-2px_10px_#E8B563]"
                  />
                ) : (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#E8B563] rounded-t-full opacity-0 group-hover:w-full group-hover:opacity-100 transition-all duration-200" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-[#0D0D0D] border-b border-slate-200 dark:border-white/10 p-4 space-y-2 lg:hidden shadow-2xl z-50">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    closeAllDropdowns();
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                    isActive ? 'bg-[#E8B563] text-[#0A0A0A]' : 'text-slate-600 dark:text-[#8A8A8A] hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
