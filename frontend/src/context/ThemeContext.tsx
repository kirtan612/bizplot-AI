import React, { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react';

export type ThemeMode = 'light' | 'dark';

export interface ThemeTokens {
  mode: ThemeMode;
  page: string;
  card: string;
  dark: string;
  darkText: string;
  heroFrom: string;
  heroTo: string;
  accent: string;
  accentSoft: string;
  text: string;
  textSub: string;
  textFaint: string;
  border: string;
  track: string;
  ok: string;
  warn: string;
}

export const themes: Record<ThemeMode, ThemeTokens> = {
  light: {
    mode: 'light',
    page: '#F5F3F9',
    card: '#FFFFFF',
    dark: '#1C1A22',
    darkText: '#F3F1F7',
    heroFrom: '#EFE7FB',
    heroTo: '#FBF8FE',
    accent: '#9B7EDE',
    accentSoft: '#F1EBFB',
    text: '#1C1A22',
    textSub: '#6F6C79',
    textFaint: '#A7A3B0',
    border: '#EAE6F1',
    track: '#EFECF6',
    ok: '#1E8F72',
    warn: '#B4791F',
  },
  dark: {
    mode: 'dark',
    page: '#131118',
    card: '#1D1A24',
    dark: '#000000',
    darkText: '#F3F1F7',
    heroFrom: '#241E36',
    heroTo: '#1B1826',
    accent: '#B8A0F0',
    accentSoft: '#28223A',
    text: '#F3F1F7',
    textSub: '#9D99A8',
    textFaint: '#615D6C',
    border: '#2B2734',
    track: '#252030',
    ok: '#3BAF8F',
    warn: '#E0A84B',
  },
};

interface ThemeContextValue {
  theme: ThemeMode;
  tokens: ThemeTokens;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('bizpilot_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    localStorage.setItem('bizpilot_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  const tokens = useMemo(() => themes[theme], [theme]);

  return (
    <ThemeContext.Provider value={{ theme, tokens, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
