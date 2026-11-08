import {
  type MantiRadixGrayScale,
  type MantiRadixScale,
  presets as SHIPPED_PRESETS,
  radixAccentScaleNames,
  radixGrayScaleNames,
  radixScales,
} from '@manti-ui/tokens';

/**
 * The theme contract: everything Oklava can tune, plus the named stops the
 * panel offers for each knob.
 *
 * Every knob is expressed as a *token override*. Nothing here writes to the
 * document; `apply.ts` owns that, and `css.ts` turns a config into CSS. This
 * module is the leaf of that trio: it imports neither, so the vocabulary can be
 * read anywhere, a server render included.
 *
 * Colors are Radix scale *names*, never free colors: a variant names one scale
 * of the `radixScales` catalog in `@manti-ui/tokens`, and the neutral names one
 * of its grays. A name expands into Radix steps and nothing else, so every
 * theme built here keeps the contrast Radix designed its scales for.
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

/** A scale a variant may name: any Radix accent, or a Radix gray. */
export type ScaleName = MantiRadixScale;

/** A scale the neutral may name: one of the Radix grays. */
export type NeutralName = MantiRadixGrayScale;

export interface ThemeConfig {
  /** The base theme supplied by `@manti-ui/styles`. */
  preset: PresetId;
  /** Radix scale per variant. A missing key means "keep the preset default". */
  colors: Partial<Record<VariantKey, ScaleName>>;
  /** The Radix gray behind every `--manti-gray-*` step, surface and border. */
  neutral: NeutralName;
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
  /**
   * The scale the shipped theme builds this variant from, i.e. the picker's
   * starting selection. `null` for the neutral rungs: `secondary` and
   * `tertiary` ship as a treatment of the theme's neutral, not as a scale of
   * their own, so they start on whichever gray the neutral names.
   */
  fallback: ScaleName | null;
  hint: string;
}

/** The variants the studio exposes. `outline` shares tertiary's neutral ramp. */
export const VARIANTS: VariantMeta[] = [
  {
    key: 'primary',
    label: 'Primary',
    fallback: 'orange',
    hint: 'Solid actions, active states, focus rings',
  },
  {
    key: 'secondary',
    label: 'Secondary',
    fallback: null,
    hint: 'Soft, second-rank actions',
  },
  {
    key: 'tertiary',
    label: 'Tertiary',
    fallback: null,
    hint: 'Ghost controls and quiet chrome',
  },
  {
    key: 'success',
    label: 'Success',
    fallback: 'green',
    hint: 'Confirmations',
  },
  { key: 'info', label: 'Info', fallback: 'blue', hint: 'Neutral notices' },
  {
    key: 'danger',
    label: 'Danger',
    fallback: 'red',
    hint: 'Destructive actions and errors',
  },
];

/** True for a name the `radixScales` catalog carries. */
export function isScaleName(value: unknown): value is ScaleName {
  return typeof value === 'string' && Object.hasOwn(radixScales, value);
}

/** True for the name of one of the catalog's grays. */
export function isNeutralName(value: unknown): value is NeutralName {
  return (radixGrayScaleNames as readonly unknown[]).includes(value);
}

/** How the rail and the agent prompt name a scale: `violet` reads `Violet`. */
export function scaleLabel(name: ScaleName): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

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
  neutral: SHIPPED_PRESETS.manti.neutral,
  radiusFactor: 1,
  font: 'inter',
  textBase: 1,
  density: 1,
  focusWidth: 3,
};

/**
 * The rail's vocabularies.
 *
 * Every knob is a short list of named stops rather than a free range. A
 * visitor picks "Large" and knows what they will get; a slider asks them to
 * guess which of 40 positions is the one the system was designed around. The
 * stops are also what "Surprise me" and the preset chips land on, so the
 * controls always show a selection rather than an orphaned value.
 */

/**
 * The scales a variant may name, in Radix order: every accent, then the grays,
 * which a monochrome brand (the Graphite preset) uses as its primary.
 */
export const COLOR_SCALES: readonly ScaleName[] = [
  ...radixAccentScaleNames,
  ...radixGrayScaleNames,
];

/** The grays the neutral may name, in Radix order. */
export const NEUTRAL_SCALES: readonly NeutralName[] = radixGrayScaleNames;

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
  /** The Radix scale per variant the preset names. */
  colors: Partial<Record<VariantKey, ScaleName>>;
  /** The Radix gray the palette comes with. */
  neutral: NeutralName;
}

/**
 * The presets, read straight off the `presets` map in `@manti-ui/tokens`.
 *
 * The same map generates the stylesheets in `@manti-ui/styles/themes`, so the
 * chips in the rail, the CSS this page runs, and the file a visitor imports can
 * never disagree about what Ocean is. Nothing is re-declared here.
 *
 * A preset is a palette: Radix scales plus the neutral gray, and nothing else.
 * Shape, type and density belong to the knobs above and survive a palette swap.
 */
export const PRESETS: ThemePreset[] = Object.entries(SHIPPED_PRESETS).map(
  ([id, preset]) => ({
    id: id as PresetId,
    label: preset.label,
    colors: preset.default ? {} : { ...preset.colors },
    neutral: preset.neutral,
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
    neutral: preset.neutral,
  };
}

/** Resolve the control values associated with a package-provided preset. */
export function configForPreset(id: PresetId): ThemeConfig {
  const preset = PRESETS.find((item) => item.id === id) ?? PRESETS[0];
  return applyPreset(preset);
}

/**
 * The scale a variant is built from under `config`: its own pick, else the
 * shipped fallback, else (for the neutral rungs) the theme's neutral. The rail
 * shows this as selected, and `css.ts` diffs on it.
 */
export function scaleOf(config: ThemeConfig, key: VariantKey): ScaleName {
  return (
    config.colors[key] ??
    VARIANTS.find((item) => item.key === key)?.fallback ??
    config.neutral
  );
}

/** A playful-but-usable random theme for the "Surprise me" action. */
export function randomTheme(): ThemeConfig {
  const pick = <T>(list: readonly T[]): T =>
    list[Math.floor(Math.random() * list.length)];
  const primary = pick(radixAccentScaleNames);
  return {
    ...DEFAULT_THEME,
    colors: { primary },
    // The gray Radix pairs with this accent, so the neutral always suits it.
    neutral: radixScales[primary].gray,
    radiusFactor: pick(RADIUS_STEPS).value,
  };
}
