'use client';

import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { usePetStore } from '@/stores/usePetStore';
import { getTheme, applyThemeToCSSVars, DEFAULT_THEME } from './themes';
import type { PetTheme } from '@/types';

const ThemeContext = createContext<PetTheme>(DEFAULT_THEME);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const pet = usePetStore((s) => s.pet);
  const theme = pet ? getTheme(pet.species) : DEFAULT_THEME;

  useEffect(() => {
    const vars = applyThemeToCSSVars(theme);
    const root = document.documentElement;

    Object.entries(vars).forEach(([key, val]) => {
      root.style.setProperty(key, val);
    });

    // Also set data attribute for species-specific CSS selectors
    root.setAttribute('data-pet-species', theme.species);
    root.setAttribute('data-theme', theme.species);
  }, [theme]);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): PetTheme {
  return useContext(ThemeContext);
}
