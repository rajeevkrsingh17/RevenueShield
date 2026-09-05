'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/common/Logo';
import { useDropdown } from '@/components/providers/DropdownContext';
import {
  LayoutDashboard,
  TrendingUp,
  RefreshCw,
  Receipt,
  Cpu,
  Bot,
  BarChart3,
  FileCheck2,
  Bell,

  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface AppSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function AppSidebar({ collapsed, onToggleCollapse }: AppSidebarProps) {
  const pathname = usePathname();
  const { closeAllDropdowns } = useDropdown();

  const navItems = [
    { name: 'Overview', href: '/', icon: LayoutDashboard },
    { name: 'Revenue Intelligence', href: '/revenue-intelligence', icon: TrendingUp },
    { name: 'Payment Recovery', href: '/payment-recovery', icon: RefreshCw },
    { name: 'Transactions', href: '/transactions', icon: Receipt },
    { name: 'Simulator', href: '/simulator', icon: Cpu },
    { name: 'AI Copilot', href: '/copilot', icon: Bot },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },

    { name: 'Audit Log', href: '/audit-log', icon: FileCheck2 },
    { name: 'Alerts', href: '/alerts', icon: Bell },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 border-r bg-[#0E0E0E] border-white/10 flex flex-col justify-between ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div>
        <div className="h-16 px-4 flex items-center justify-between border-b border-white/10">
          <Link href="/" onClick={closeAllDropdowns} className="flex items-center overflow-hidden">
            {!collapsed ? (
              <Logo size="md" variant="gold" />
            ) : (
              <Logo size="sm" variant="gold" />
            )}
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeAllDropdowns}
                className={`group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#E8B563] text-[#0A0A0A] font-extrabold shadow-md shadow-[#E8B563]/20'
                    : 'text-[#8A8A8A] hover:text-[#F5F0E8] hover:bg-white/5'
                }`}
                title={collapsed ? item.name : undefined}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-[#0A0A0A]"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}

                <Icon className={`h-4 w-4 shrink-0 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
                {!collapsed && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Collapse Button */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={() => {
            closeAllDropdowns();
            onToggleCollapse();
          }}
          className="w-full flex items-center justify-center gap-2 p-2 rounded-xl text-[#8A8A8A] hover:text-[#F5F0E8] hover:bg-white/5 transition-colors text-xs font-medium"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span>Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
