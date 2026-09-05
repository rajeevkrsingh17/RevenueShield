'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastProps) {
  return (
    <div className="fixed top-20 right-6 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className={`pointer-events-auto p-4 rounded-xl border shadow-xl flex items-start justify-between gap-3 text-xs bg-card ${
              toast.type === 'success'
                ? 'border-l-4 border-l-emerald-500 border-border'
                : toast.type === 'error'
                ? 'border-l-4 border-l-rose-500 border-border'
                : 'border-l-4 border-l-indigo-500 border-border'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {toast.type === 'success' && <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />}
              {toast.type === 'error' && <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />}
              {toast.type === 'info' && <Info className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />}

              <div className="space-y-0.5">
                <div className="font-bold text-foreground">{toast.title}</div>
                {toast.message && <div className="text-[11px] text-muted-foreground leading-tight">{toast.message}</div>}
              </div>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="text-muted-foreground hover:text-foreground p-0.5 rounded-lg hover:bg-muted transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
