'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Glass } from '@devvy-ui/react/glass';
import '@devvy-ui/styles/glass.css';

type Appearance = 'light' | 'dark' | 'system';
type Style = 'minimal' | 'modern' | 'glass';
export type FontChoice = 'system' | 'geist' | 'manrope' | 'geist-mono';
const ThemeContext = createContext<{
  theme: Appearance;
  style: Style;
  font: FontChoice;
  setFont: (font: FontChoice) => void;
  setTheme: (theme: Appearance) => void;
  setStyle: (style: Style) => void;
} | null>(null);

export function SiteTheme({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Appearance>('light');
  const [style, setStyle] = useState<Style>('minimal');
  const [font, setFont] = useState<FontChoice>('system');
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('devvy-site-theme-v1') ?? 'null');
      if (saved && ['light', 'dark', 'system'].includes(saved.theme)) setTheme(saved.theme);
      if (saved && ['minimal', 'modern', 'glass'].includes(saved.style)) setStyle(saved.style);
      if (saved && ['system', 'geist', 'manrope', 'geist-mono'].includes(saved.font))
        setFont(saved.font);
    } catch {
      /* Storage is optional; the SSR default remains usable. */
    }
    setReady(true);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.devvyTheme = theme;
    document.documentElement.dataset.devvyStyle = style;
    document.documentElement.dataset.devvyFont = font;
    if (ready) {
      try {
        localStorage.setItem('devvy-site-theme-v1', JSON.stringify({ theme, style, font }));
      } catch {
        /* Private browsing may deny storage. */
      }
    }
  }, [theme, style, font, ready]);
  return (
    <ThemeContext.Provider
      value={{
        theme,
        style,
        font,
        setFont,
        setTheme,
        setStyle: (next) => {
          setStyle(next);
          if (next === 'modern') setTheme('dark');
        },
      }}
    >
      <Glass enabled={style === 'glass'} quality="auto" className="site-theme-scope">
        {children}
      </Glass>
    </ThemeContext.Provider>
  );
}

export function useSiteTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('Theme controls require SiteTheme.');
  return value;
}
