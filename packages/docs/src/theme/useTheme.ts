import { useCallback, useSyncExternalStore } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'manti-theme';

function currentTheme(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

/**
 * Watch `data-theme` itself rather than mirroring it into React state. The attribute is
 * the source of truth — the inline script in index.html sets it before first paint and
 * Manti's CSS reads it — so a component holding its own copy only ever learns about its
 * *own* writes. With more than one consumer, that means toggling in the header leaves
 * every other reader stale.
 */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
  return () => observer.disconnect();
}

/**
 * Drives the Manti theme the same way `.storybook/preview.tsx` does — by setting
 * `data-theme` on `<html>`. Every consumer sees the same value, whoever set it.
 */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, currentTheme);

  const setTheme = useCallback((next: Theme) => {
    // Nothing to set in React: the attribute write is what notifies every subscriber.
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage may be unavailable; the DOM attribute is the source of truth */
    }
  }, []);

  const toggle = useCallback(() => {
    setTheme(currentTheme() === 'dark' ? 'light' : 'dark');
  }, [setTheme]);

  return { theme, setTheme, toggle };
}
