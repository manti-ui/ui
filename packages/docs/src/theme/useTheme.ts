import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'manti-theme';

function currentTheme(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

/**
 * Drives the Manti theme the same way `.storybook/preview.tsx` does — by setting
 * `data-theme` on `<html>`. The initial value is applied before paint by the
 * inline script in index.html; this hook keeps React state in sync and persists.
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(currentTheme);

  const setTheme = useCallback((next: Theme) => {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage may be unavailable; the DOM attribute is the source of truth */
    }
    setThemeState(next);
  }, []);

  const toggle = useCallback(() => {
    setTheme(currentTheme() === 'dark' ? 'light' : 'dark');
  }, [setTheme]);

  // Reconcile once on mount in case the pre-paint script and React disagree.
  useEffect(() => {
    setThemeState(currentTheme());
  }, []);

  return { theme, setTheme, toggle };
}
