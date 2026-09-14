import { useCallback, useSyncExternalStore } from 'react';

import {
  DEFAULT_STORAGE_KEY,
  applyCss,
  applyFontLink,
  applyPresetTheme,
  clear,
  hasPresetStyles,
  isBrowser,
  load,
  save,
} from './apply';
import { DEFAULT_THEME, type ThemeConfig, type VariantKey } from './config';
import { buildThemeCss, isDefaultTheme } from './css';

/**
 * The live theme.
 *
 * Module state rather than context: a devtool is one per document, and keeping
 * the store outside React lets the panel paint a stored theme in its very first
 * effect. Initialisation is explicit (`initTheme`), so importing this package
 * does nothing until `<Oklava />` mounts, which keeps `sideEffects: false`
 * honest and keeps a server render inert.
 */

let current: ThemeConfig = DEFAULT_THEME;
let storageKey: string | false = DEFAULT_STORAGE_KEY;
let started = false;
const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getTheme(): ThemeConfig {
  return current;
}

function paint(next: ThemeConfig): void {
  applyPresetTheme(next.preset);
  applyFontLink(next.font);
  // With the preset stylesheets loaded, the attribute above carries the
  // palette and the override only has to carry what the panel changed on top.
  // Without them, the preset's palette has nowhere else to come from, so it is
  // folded into the same override.
  applyCss(
    hasPresetStyles()
      ? buildThemeCss(next)
      : buildThemeCss(next, DEFAULT_THEME),
  );
}

export function setTheme(next: ThemeConfig): void {
  current = next;
  if (isBrowser) {
    paint(next);
    if (storageKey) save(storageKey, next);
  }
  for (const listener of listeners) listener();
}

/**
 * Restore the stored theme and paint it. Idempotent, so a remount does not
 * discard the running theme.
 */
export function initTheme(key: string | false = DEFAULT_STORAGE_KEY): void {
  storageKey = key;
  if (!isBrowser || started) return;
  started = true;
  if (key) {
    const stored = load(key);
    if (stored !== DEFAULT_THEME) {
      current = stored;
      paint(stored);
    }
  }
}

export interface UseOklavaTheme {
  config: ThemeConfig;
  /** Replace the whole theme. */
  set: (next: ThemeConfig) => void;
  /** Merge a partial change (colors are merged key by key). */
  patch: (partial: Partial<ThemeConfig>) => void;
  /** Set, or clear with `null`, one variant's base color. */
  setColor: (key: VariantKey, value: string | null) => void;
  /** Drop every override and forget the stored theme. */
  reset: () => void;
  /** True while the app is running its shipped theme. */
  isDefault: boolean;
}

export function useOklavaTheme(): UseOklavaTheme {
  const config = useSyncExternalStore(subscribe, getTheme, () => DEFAULT_THEME);

  const patch = useCallback((partial: Partial<ThemeConfig>) => {
    setTheme({
      ...getTheme(),
      ...partial,
      colors: { ...getTheme().colors, ...partial.colors },
    });
  }, []);

  const setColor = useCallback((key: VariantKey, value: string | null) => {
    const colors = { ...getTheme().colors };
    if (value) colors[key] = value;
    else delete colors[key];
    setTheme({ ...getTheme(), colors });
  }, []);

  const reset = useCallback(() => {
    if (storageKey) clear(storageKey);
    setTheme(DEFAULT_THEME);
  }, []);

  return {
    config,
    set: setTheme,
    patch,
    setColor,
    reset,
    isDefault: isDefaultTheme(config),
  };
}
