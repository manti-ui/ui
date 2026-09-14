import { presets as SHIPPED_PRESETS } from '@manti-ui/tokens';

import { hslToHex } from './color';

/**
 * The theme contract: everything Oklava can tune, plus the named stops the
 * panel offers for each knob.
 *
 * Every knob is expressed as a *token override*. Nothing here writes to the
 * document; `apply.ts` owns that, and `css.ts` turns a config into CSS. This
 * module is the leaf of that trio: it imports neither, so the vocabulary can be
 * read anywhere, a server render included.
 */

export type VariantKey =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'success'
  | 'info'
  | 'danger';

/** The ids `@manti-ui/tokens` ships a preset for. */
export type PresetId = keyof typeof SHIPPED_PRESETS;

export interface ThemeConfig {
  /** The base theme supplied by `@manti-ui/styles`. */
  preset: PresetId;
  /** Base color per variant. A missing key means "keep the preset default". */
  colors: Partial<Record<VariantKey, string>>;
  /** `--manti-cool-hue`: the single neutral hue driving every gray/surface. */
  neutralHue: number;
  /** `--manti-radius-factor`: rescales the whole radius ramp. */
  radiusFactor: number;
  /** Key into `FONT_STACKS`. */
  font: string;
  /** `--manti-text-base` in rem; every other size derives from it. */
  textBase: number;
  /** Multiplier applied to `--manti-space-1` and the control heights. */
  density: number;
  /** `--manti-focus-ring-width` in px. */
  focusWidth: number;
}

export interface VariantMeta {
  key: VariantKey;
  label: string;
  /** The stop the shipped theme resolves to, i.e. the picker's starting swatch. */
  fallback: string;
  hint: string;
}

/** The variants the studio exposes. `outline` shares tertiary's neutral ramp. */
export const VARIANTS: VariantMeta[] = [
  {
    key: 'primary',
    label: 'Primary',
    fallback: '#e2681c',
    hint: 'Solid actions, active states, focus rings',
  },
  {
    key: 'secondary',
    label: 'Secondary',
    fallback: '#6b7280',
    hint: 'Soft, second-rank actions',
  },
  {
    key: 'tertiary',
    label: 'Tertiary',
    fallback: '#9ca3af',
    hint: 'Ghost controls and quiet chrome',
  },
  {
    key: 'success',
    label: 'Success',
    fallback: '#16a34a',
    hint: 'Confirmations',
  },
  { key: 'info', label: 'Info', fallback: '#2563eb', hint: 'Neutral notices' },
  {
    key: 'danger',
    label: 'Danger',
    fallback: '#dc2626',
    hint: 'Destructive actions and errors',
  },
];

export interface FontStack {
  value: string;
  label: string;
  stack: string;
}

export const FONT_STACKS: FontStack[] = [
  {
    value: 'inter',
    label: 'Inter (default)',
    stack:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  {
    value: 'system',
    label: 'System UI',
    stack:
      "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  {
    value: 'grotesk',
    label: 'Neo-grotesque',
    stack:
      "'Helvetica Neue', Helvetica, Arial, ui-sans-serif, system-ui, sans-serif",
  },
  {
    value: 'serif',
    label: 'Serif',
    stack: "Georgia, 'Iowan Old Style', 'Times New Roman', ui-serif, serif",
  },
  {
    value: 'mono',
    label: 'Monospace',
    stack:
      "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace",
  },
];

/**
 * Google Fonts.
 *
 * A picked family is stored as `gf:<family>`, which keeps `ThemeConfig.font` a
 * single string: a share link, the JSON export and `localStorage` all carry the
 * choice with nothing else to look up. The catalogue in `src/data` is only for
 * *browsing*; everything below works from the family name alone.
 */
const GOOGLE_PREFIX = 'gf:';

/** The family behind a `gf:` key, or `null` for one of the built-in stacks. */
export function googleFamily(font: string): string | null {
  if (!font.startsWith(GOOGLE_PREFIX)) return null;
  const family = font.slice(GOOGLE_PREFIX.length).trim();
  return family || null;
}

/** The `font` key for a Google family. */
export function googleFontKey(family: string): string {
  return `${GOOGLE_PREFIX}${family}`;
}

/**
 * The stylesheet that loads a family. The CSS2 endpoint ignores weights a
 * family does not ship (it answers 200 with whatever exists), so one fixed
 * request covers the four weights Manti's type scale uses.
 */
export function googleFontHref(family: string): string {
  const name = family.trim().replace(/\s+/g, '+');
  return `https://fonts.googleapis.com/css2?family=${name}:wght@400;500;600;700&display=swap`;
}

/** The `--manti-font-sans` value for a `font` key, or `null` if unknown. */
export function fontStack(font: string): string | null {
  const family = googleFamily(font);
  if (family) {
    // The generic tail is what paints until the webfont arrives, and what an
    // offline reader keeps.
    return `'${family}', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif`;
  }
  return FONT_STACKS.find((item) => item.value === font)?.stack ?? null;
}

/** How the rail and the agent prompt name the current font. */
export function fontLabel(font: string): string {
  return (
    googleFamily(font) ??
    FONT_STACKS.find((item) => item.value === font)?.label ??
    font
  );
}

export const DEFAULT_THEME: ThemeConfig = {
  preset: 'manti',
  colors: {},
  neutralHue: 280,
  radiusFactor: 1,
  font: 'inter',
  textBase: 1,
  density: 1,
  focusWidth: 3,
};

/**
 * The rail's vocabularies.
 *
 * Every structural knob is a short list of named stops rather than a free
 * range. A visitor picks "Large" and knows what they will get; a slider asks
 * them to guess which of 40 positions is the one the system was designed
 * around. The stops are also what "Surprise me" and the preset chips land on,
 * so the controls always show a selection rather than an orphaned value.
 */

/** Base colors the accent grid offers, in hue order. */
export const ACCENT_COLORS: { label: string; value: string }[] = [
  { label: 'Manti', value: '#e2681c' },
  { label: 'Orange', value: '#ea580c' },
  { label: 'Amber', value: '#d97706' },
  { label: 'Yellow', value: '#ca8a04' },
  { label: 'Lime', value: '#65a30d' },
  { label: 'Green', value: '#16a34a' },
  { label: 'Emerald', value: '#059669' },
  { label: 'Teal', value: '#0d9488' },
  { label: 'Cyan', value: '#0891b2' },
  { label: 'Sky', value: '#0ea5e9' },
  { label: 'Blue', value: '#2563eb' },
  { label: 'Indigo', value: '#4f46e5' },
  { label: 'Violet', value: '#7c3aed' },
  { label: 'Purple', value: '#9333ea' },
  { label: 'Fuchsia', value: '#c026d3' },
  { label: 'Pink', value: '#db2777' },
  { label: 'Rose', value: '#e11d48' },
  { label: 'Red', value: '#dc2626' },
  { label: 'Brown', value: '#92400e' },
  { label: 'Stone', value: '#78716c' },
  { label: 'Slate', value: '#475569' },
  { label: 'Graphite', value: '#4b5563' },
];

/**
 * Neutral hues, named. Every shipped preset's `coolHue` is one of these, so
 * adopting a palette always leaves this row with a stop selected.
 */
export const NEUTRAL_HUES: { label: string; value: number }[] = [
  { label: 'Sand', value: 70 },
  { label: 'Olive', value: 120 },
  { label: 'Sage', value: 150 },
  { label: 'Ocean', value: 235 },
  { label: 'Steel', value: 250 },
  { label: 'Gray', value: 280 },
  { label: 'Mauve', value: 300 },
  { label: 'Rose', value: 350 },
];

/** Radius factors, from square to fully round. */
export const RADIUS_STEPS: { label: string; value: number }[] = [
  { label: 'None', value: 0 },
  { label: 'Small', value: 0.6 },
  { label: 'Medium', value: 1 },
  { label: 'Large', value: 1.4 },
  { label: 'Full', value: 2 },
];

/** Base text sizes, labelled in px at the browser default root size. */
export const TEXT_SIZES: { label: string; value: number }[] = [
  { label: '14', value: 0.875 },
  { label: '15', value: 0.9375 },
  { label: '16', value: 1 },
  { label: '17', value: 1.0625 },
  { label: '18', value: 1.125 },
];

/** Density multipliers, labelled as percentages. */
export const DENSITIES: { label: string; value: number }[] = [
  { label: '90%', value: 0.9 },
  { label: '95%', value: 0.95 },
  { label: '100%', value: 1 },
  { label: '105%', value: 1.05 },
  { label: '110%', value: 1.1 },
];

/** Focus ring widths in px. */
export const FOCUS_WIDTHS: { label: string; value: number }[] = [
  { label: '0', value: 0 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '5', value: 5 },
];

/** Default scale values used when generating custom density overrides. */
export const BASE_SPACE_REM = 0.25;
export const BASE_CONTROL_HEIGHT_REM = { sm: 1.8, md: 2.2, lg: 2.7 };

export interface ThemePreset {
  id: PresetId;
  label: string;
  /** The base color per variant. */
  colors: Partial<Record<VariantKey, string>>;
  /** `--manti-cool-hue`: the neutral tint the palette comes with. */
  neutralHue: number;
}

/**
 * The presets, read straight off the `presets` map in `@manti-ui/tokens`.
 *
 * The same map generates the stylesheets in `@manti-ui/styles/themes`, so the
 * chips in the rail, the CSS this page runs, and the file a visitor imports can
 * never disagree about what Ocean is. Nothing is re-declared here.
 *
 * A preset is a palette: base colors plus the neutral hue, and nothing else.
 * Shape, type and density belong to the knobs below and survive a palette swap.
 */
export const PRESETS: ThemePreset[] = Object.entries(SHIPPED_PRESETS).map(
  ([id, preset]) => ({
    id: id as PresetId,
    label: preset.label,
    colors: { ...preset.colors },
    neutralHue: preset.coolHue,
  }),
);

/** Swap `base`'s palette for the preset's, leaving every other knob alone. */
export function applyPreset(
  preset: ThemePreset,
  base: ThemeConfig = DEFAULT_THEME,
): ThemeConfig {
  return {
    ...base,
    preset: preset.id,
    colors: { ...preset.colors },
    neutralHue: preset.neutralHue,
  };
}

/** Resolve the control values associated with a package-provided preset. */
export function configForPreset(id: PresetId): ThemeConfig {
  const preset = PRESETS.find((item) => item.id === id) ?? PRESETS[0];
  return applyPreset(preset);
}

// --- color helpers (browser only) -------------------------------------------

/** A playful-but-usable random theme for the "Surprise me" action. */
export function randomTheme(): ThemeConfig {
  const pick = <T>(list: T[]): T =>
    list[Math.floor(Math.random() * list.length)];
  const hue = Math.round(Math.random() * 360);
  // The neutral lands on the named stop furthest from the accent, so the two
  // never sit on top of each other and the rail still shows a selected chip.
  const opposite = (hue + 180) % 360;
  const neutral = NEUTRAL_HUES.reduce((a, b) => {
    const d = (x: number) =>
      Math.min(Math.abs(x - opposite), 360 - Math.abs(x - opposite));
    return d(b.value) < d(a.value) ? b : a;
  });
  return {
    ...DEFAULT_THEME,
    colors: {
      primary: hslToHex(hue, 62 + Math.random() * 26, 44 + Math.random() * 12),
    },
    neutralHue: neutral.value,
    radiusFactor: pick(RADIUS_STEPS).value,
  };
}

// --- CSS generation ---------------------------------------------------------
