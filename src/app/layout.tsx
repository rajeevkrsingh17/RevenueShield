import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { AuthProvider } from '@/components/providers/AuthContext';
import { DropdownProvider } from '@/components/providers/DropdownContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'RevenueShield — Razorpay AI Payment Failure Recovery & Leakage Intelligence',
  description: 'Production-grade payment failure recovery and revenue intelligence platform for Razorpay merchants.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-indigo-500/20 selection:text-indigo-500">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AuthProvider>
            <DropdownProvider>
              {children}
            </DropdownProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
