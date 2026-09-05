'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';

export type DropdownType = 'org' | 'notifications' | 'profile' | null;

interface DropdownContextType {
  activeDropdown: DropdownType;
  setActiveDropdown: (type: DropdownType) => void;
  closeAllDropdowns: () => void;
}

const DropdownContext = createContext<DropdownContextType | undefined>(undefined);

export function DropdownProvider({ children }: { children: React.ReactNode }) {
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null);
  const pathname = usePathname();

  const closeAllDropdowns = useCallback(() => {
    setActiveDropdown(null);
  }, []);

  // Close ALL dropdowns automatically on route change
  useEffect(() => {
    setActiveDropdown(null);
  }, [pathname]);

  return (
    <DropdownContext.Provider value={{ activeDropdown, setActiveDropdown, closeAllDropdowns }}>
      {children}
    </DropdownContext.Provider>
  );
}

export function useDropdown() {
  const context = useContext(DropdownContext);
  if (!context) throw new Error('useDropdown must be used within DropdownProvider');
  return context;
}
