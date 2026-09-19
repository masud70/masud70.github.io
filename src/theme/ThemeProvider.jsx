import { createContext, useContext, useEffect, useState } from 'react';

/**
 * Four palettes. `swatch` values are only used to render the picker chips —
 * the actual colors live in index.css under [data-theme='...'].
 */
export const PALETTES = [
  {
    id: 'parchment',
    name: 'Parchment',
    hint: 'Warm off-white · deep teal',
    swatch: { bg: '#FDFCF9', ink: '#1A1A18', accent: '#0F766E' },
  },
  {
    id: 'slate',
    name: 'Slate',
    hint: 'Cool neutral · indigo',
    swatch: { bg: '#F8FAFC', ink: '#0F172A', accent: '#4F46E5' },
  },
  {
    id: 'sage',
    name: 'Sage',
    hint: 'Cream · forest green',
    swatch: { bg: '#FAF9F5', ink: '#14231E', accent: '#3D744A' },
  },
  {
    id: 'midnight',
    name: 'Midnight',
    hint: 'Dark navy · emerald',
    swatch: { bg: '#0A1020', ink: '#F4F7FB', accent: '#10B981' },
  },
];

// Change this one line to set which palette loads for first-time visitors.
export const DEFAULT_PALETTE = 'parchment';

const STORAGE_KEY = 'portfolio-theme';
const ThemeContext = createContext(null);

function isValid(id) {
  return PALETTES.some((p) => p.id === id);
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_PALETTE;
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved && isValid(saved)) return saved;
    } catch {
      /* storage blocked — fall through to default */
    }
    return DEFAULT_PALETTE;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* non-fatal: theme still applies for this session */
    }
  }, [theme]);

  const setTheme = (id) => {
    if (isValid(id)) setThemeState(id);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, palettes: PALETTES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
