import {
  DEFAULT_THEME,
  PRESETS,
  VARIANTS,
  configForPreset,
  fontStack,
  googleFamily,
  googleFontHref,
  isNeutralName,
  isScaleName,
  type PresetId,
  type ScaleName,
  type ThemeConfig,
  type VariantKey,
} from './config.js';

/**
 * Everything that touches the document: the two singleton elements the theme
 * rides on, the preset attribute, and storage.
 *
 * Nothing here runs at import time. A consumer's server render imports the
 * package and gets no DOM access at all; the panel wires this up on mount.
 */

const STYLE_EL_ID = 'manti-oklava-theme';
const FONT_EL_ID = 'manti-oklava-font';

/** The default `storageKey`. */
export const DEFAULT_STORAGE_KEY = 'manti-oklava';

export const isBrowser = typeof document !== 'undefined';

/** Validate anything that arrives from storage or a pasted JSON theme. */
export function coerce(raw: unknown): ThemeConfig {
  const saved = (raw ?? {}) as Partial<ThemeConfig>;
  const colors: Partial<Record<VariantKey, ScaleName>> = {};
  const preset = PRESETS.some((item) => item.id === saved.preset)
    ? (saved.preset as PresetId)
    : DEFAULT_THEME.preset;
  // Only Radix scale names survive. A theme stored before the panel picked
  // scales carries hex colors and a neutral hue; those have no Radix twin to
  // map onto, so they fall back to the preset rather than painting a guess.
  for (const variant of VARIANTS) {
    const value: unknown = saved.colors?.[variant.key];
    if (isScaleName(value)) colors[variant.key] = value;
  }
  const numberOr = (value: unknown, fallback: number) =>
    typeof value === 'number' && Number.isFinite(value) ? value : fallback;
  return {
    preset,
    colors,
    neutral: isNeutralName(saved.neutral)
      ? saved.neutral
      : configForPreset(preset).neutral,
    radiusFactor: numberOr(saved.radiusFactor, DEFAULT_THEME.radiusFactor),
    font:
      typeof saved.font === 'string' && fontStack(saved.font)
        ? saved.font
        : DEFAULT_THEME.font,
    textBase: numberOr(saved.textBase, DEFAULT_THEME.textBase),
    density: numberOr(saved.density, DEFAULT_THEME.density),
    focusWidth: numberOr(saved.focusWidth, DEFAULT_THEME.focusWidth),
  };
}

export function load(key: string): ThemeConfig {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return coerce(JSON.parse(raw));
  } catch {
    /* storage unavailable */
  }
  return DEFAULT_THEME;
}

export function save(key: string, config: ThemeConfig): void {
  try {
    localStorage.setItem(key, JSON.stringify(config));
  } catch {
    /* storage unavailable */
  }
}

export function clear(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    /* storage unavailable */
  }
}

/** Select the package-provided base theme on the document root. */
export function applyPresetTheme(preset: PresetId): void {
  if (preset === DEFAULT_THEME.preset) {
    delete document.documentElement.dataset.mantiTheme;
  } else {
    document.documentElement.dataset.mantiTheme = preset;
  }
}

/**
 * Point the singleton webfont `<link>` at the chosen family, or remove it when
 * the theme is back on a built-in stack. A `<link>` rather than an `@import`:
 * the browser starts the download while the rest of the page keeps parsing, and
 * swapping the href re-uses the same element instead of stacking up one
 * stylesheet per family the visitor tries.
 */
export function applyFontLink(font: string): void {
  const family = googleFamily(font);
  let el = document.getElementById(FONT_EL_ID) as HTMLLinkElement | null;
  if (!family) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement('link');
    el.id = FONT_EL_ID;
    el.rel = 'stylesheet';
    document.head.appendChild(el);
  }
  const href = googleFontHref(family);
  if (el.href !== href) el.href = href;
}

/**
 * Update the singleton override `<style>`. Deliberately unlayered: that is what
 * lets it beat `@layer manti.tokens` without `!important`.
 */
export function applyCss(css: string): void {
  let el = document.getElementById(STYLE_EL_ID) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement('style');
    el.id = STYLE_EL_ID;
    document.head.appendChild(el);
  }
  el.textContent = css;
}

/**
 * The focus ring width the host app ships, read once before Oklava has written
 * any override.
 *
 * Every knob restyles the panel too, which is the point: the panel is the
 * preview. Focus width is the one setting where that backfires, because `0`
 * strips the panel's own focus rings and makes the devtool unusable by
 * keyboard. The panel re-declares this value on itself.
 */
let hostFocusRingWidth: string | null = null;

export function readHostFocusRingWidth(): string {
  if (hostFocusRingWidth === null) {
    hostFocusRingWidth =
      getComputedStyle(document.documentElement)
        .getPropertyValue('--manti-focus-ring-width')
        .trim() || '3px';
  }
  return hostFocusRingWidth;
}

/**
 * Whether `@manti-ui/styles/themes.css` (or a single preset stylesheet) is
 * loaded, i.e. whether `data-manti-theme` means anything in this document.
 *
 * A preset normally arrives as a stylesheet the app imports. Oklava cannot
 * assume that import exists, and a preset chip that silently does nothing is
 * the worst possible first impression, so when the scopes are absent the store
 * folds the preset's own palette into the override it already writes.
 *
 * Answered once: stylesheets do not come and go during a session, and walking
 * every rule on every paint would be wasteful.
 */
let presetStylesLoaded: boolean | null = null;

export function hasPresetStyles(): boolean {
  if (presetStylesLoaded !== null) return presetStylesLoaded;
  presetStylesLoaded = false;
  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList;
    try {
      rules = sheet.cssRules;
    } catch {
      // A cross-origin stylesheet. Unreadable, so it cannot be ruled in.
      continue;
    }
    if (containsPresetScope(rules)) {
      presetStylesLoaded = true;
      break;
    }
  }
  return presetStylesLoaded;
}

function containsPresetScope(rules: CSSRuleList): boolean {
  for (const rule of Array.from(rules)) {
    if (
      rule instanceof CSSStyleRule &&
      rule.selectorText.includes('data-manti-theme')
    ) {
      return true;
    }
    // The preset scopes ship inside `@layer manti.theme`.
    const nested = (rule as CSSGroupingRule).cssRules;
    if (nested && containsPresetScope(nested)) return true;
  }
  return false;
}
