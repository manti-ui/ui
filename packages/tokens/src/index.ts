/**
 * @manti-ui/tokens
 *
 * Framework-agnostic design token contract for Manti UI.
 *
 * The metaphor is mantı: a dish that appears in many regions and forms. The
 * palette pairs a cool neutral `gray` (the panel-signature hue, 280) with warm
 * `orange`, `green`, `amber`, `red`, and `blue` accents — all expressed as
 * perceptually-smooth OKLCH ramps under plain, universally understood color
 * names.
 *
 * This module is the typed source of truth. Its primitive ramps and scale
 * values are generated into the `--manti-*` custom properties of
 * `@manti-ui/styles` (`packages/styles/scripts/gen-tokens-css.mjs`, run via
 * `pnpm gen:tokens`); the theme-aware roles there layer light/dark resolution on
 * top with the CSS `light-dark()` function.
 */

/**
 * Ramp generation.
 *
 * Each primitive ramp is produced from a compact spec instead of 36 hand-tuned
 * numbers. The per-stop *lightness* is the perceptual backbone and stays
 * explicit; *hue* drifts linearly across the ramp; *chroma* follows a smooth
 * "bell" — edges plus a mid peak shaped by a rise/fall bias.
 *
 * The backbones started as a fit to the original hand-tuned 11-stop ramps, then
 * were resampled to 12 stops with monotone cubic (PCHIP) interpolation: the
 * endpoints and the shape of each curve are preserved, the steps are re-spaced,
 * and monotonicity is guaranteed so no stop can come out lighter than the one
 * before it. Hue and chroma need no re-fit — they are expressed as endpoints
 * plus a peak *position*, so they re-space themselves with the backbone.
 */
/**
 * Ramp stop names, lightest → darkest. A plain 1…12 index rather than the
 * Tailwind-style 50…950 weights: the stops are perceptual positions on an OKLCH
 * lightness backbone, not font-weight-like magnitudes, and an unbroken sequence
 * makes "one stop darker" arithmetic instead of a lookup. The Tailwind bridge
 * (`packages/styles/src/tailwind-theme.css`) keeps the 50…950 utility names and
 * maps them onto these, so `bg-orange-500` is unaffected.
 *
 * Twelve stops, which is what the semantic roles want: 1–2 page/panel
 * backgrounds, 3–5 component backgrounds, 6–8 borders and separators, 9–10 the
 * solid fills, 11–12 text. Eleven forced borders and solids to share a stop.
 */
const RAMP_STOPS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

/**
 * The palette-role contract shared by every Manti color ramp.
 *
 * These names describe intent, not a component-specific implementation. The
 * semantic layer maps them to theme-aware values; component CSS should consume
 * semantic roles or `--variant-*`, not raw ramp stops. Keeping the map typed
 * makes the scale legible to generators, docs, and future lint rules.
 */
export const colorScaleRoles = {
  appBackground: [1, 2],
  componentBackground: { rest: 3, hover: 4, active: 5 },
  border: { subtle: 6, interactive: 7, strong: 8 },
  solid: { rest: 9, hover: 10 },
  text: { lowContrast: 11, highContrast: 12 },
} as const;

type RampSpec = {
  /** Per-stop lightness, lightest → darkest (the backbone). */
  lightness: number[];
  /** Hue at the lightest / darkest stop; drifts linearly between. */
  hueStart: number;
  hueEnd: number;
  /** Chroma bell: value at the edges, the peak, and which stop carries it. */
  chromaStart: number;
  chromaPeak: number;
  chromaEnd: number;
  peakIndex: number;
  /** Shape of the bell's climb / descent (0 = S-curve, 1 = ease-out). */
  chromaRiseBias: number;
  chromaFallBias: number;
};

const cosEase = (t: number) => (1 - Math.cos(Math.PI * t)) / 2;
const outEase = (t: number) => Math.sin((t * Math.PI) / 2);
const easeBias = (t: number, b: number) =>
  (1 - b) * cosEase(t) + b * outEase(t);
const round = (n: number, p: number) => Number(n.toFixed(p));

/** Expand a {@link RampSpec} into `{ 1: 'oklch(…)', …, 12: 'oklch(…)' }`. */
function rampFrom(spec: RampSpec): Record<number, string> {
  const n = spec.lightness.length;
  const out: Record<number, string> = {};
  spec.lightness.forEach((l, i) => {
    const h = round(
      spec.hueStart + (spec.hueEnd - spec.hueStart) * (i / (n - 1)),
      1,
    );
    const c =
      i <= spec.peakIndex
        ? spec.chromaStart +
          (spec.chromaPeak - spec.chromaStart) *
            easeBias(i / spec.peakIndex, spec.chromaRiseBias)
        : spec.chromaPeak +
          (spec.chromaEnd - spec.chromaPeak) *
            easeBias(
              (i - spec.peakIndex) / (n - 1 - spec.peakIndex),
              spec.chromaFallBias,
            );
    out[RAMP_STOPS[i]] = `oklch(${round(l, 3)} ${round(c, 3)} ${h})`;
  });
  return out;
}

/** Primitive color ramps, generated from specs (see {@link rampFrom}). */
export const colorPrimitives = {
  /**
   * Cool neutral — the panel-signature hue (280), the single backbone of every
   * surface, text, and border color. The hue is centralized on `--manti-cool-hue`
   * in the CSS (the token generator rewrites these stops to
   * `oklch(l c var(--manti-cool-hue))`), so the whole neutral re-tints from one
   * custom property. Chroma stays near-zero (a faint cool cast, no color).
   */
  gray: rampFrom({
    lightness: [
      0.985, 0.97, 0.941, 0.903, 0.83, 0.727, 0.618, 0.517, 0.424, 0.336, 0.261,
      0.196,
    ],
    hueStart: 280,
    hueEnd: 280,
    chromaStart: 0.004,
    chromaPeak: 0.013,
    chromaEnd: 0.008,
    peakIndex: 6,
    chromaRiseBias: 0.5,
    chromaFallBias: 0.4,
  }),
  /** Primary. Warm orange — the signature Manti UI accent. */
  orange: rampFrom({
    lightness: [
      0.972, 0.943, 0.899, 0.84, 0.772, 0.708, 0.648, 0.579, 0.495, 0.415,
      0.342, 0.262,
    ],
    hueStart: 50,
    hueEnd: 33,
    chromaStart: 0.018,
    chromaPeak: 0.172,
    chromaEnd: 0.064,
    peakIndex: 7,
    chromaRiseBias: 0.5,
    chromaFallBias: 0,
  }),
  /** Success. Fresh green. */
  green: rampFrom({
    lightness: [
      0.972, 0.943, 0.9, 0.84, 0.769, 0.701, 0.63, 0.546, 0.461, 0.383, 0.313,
      0.238,
    ],
    hueStart: 150,
    hueEnd: 160,
    chromaStart: 0.022,
    chromaPeak: 0.128,
    chromaEnd: 0.044,
    peakIndex: 6,
    chromaRiseBias: 0.5,
    chromaFallBias: 0.2,
  }),
  /** Secondary. Golden amber — the same ramp warning semantics draw on. */
  amber: rampFrom({
    lightness: [
      0.978, 0.955, 0.917, 0.873, 0.83, 0.785, 0.728, 0.641, 0.536, 0.446,
      0.374, 0.286,
    ],
    hueStart: 85,
    hueEnd: 60,
    chromaStart: 0.022,
    chromaPeak: 0.15,
    chromaEnd: 0.054,
    peakIndex: 6,
    chromaRiseBias: 0.5,
    chromaFallBias: 0.2,
  }),
  /** Danger. Hot red. */
  red: rampFrom({
    lightness: [
      0.971, 0.94, 0.893, 0.831, 0.756, 0.685, 0.622, 0.557, 0.479, 0.407,
      0.345, 0.262,
    ],
    hueStart: 25,
    hueEnd: 26,
    chromaStart: 0.018,
    chromaPeak: 0.21,
    chromaEnd: 0.085,
    peakIndex: 7,
    chromaRiseBias: 0.3,
    chromaFallBias: -0.15,
  }),
  /** Info. Smooth, calm blue. */
  blue: rampFrom({
    lightness: [
      0.974, 0.944, 0.9, 0.841, 0.763, 0.686, 0.612, 0.535, 0.459, 0.389, 0.329,
      0.252,
    ],
    hueStart: 235,
    hueEnd: 249,
    chromaStart: 0.014,
    chromaPeak: 0.14,
    chromaEnd: 0.056,
    peakIndex: 7,
    chromaRiseBias: 0.5,
    chromaFallBias: 0.1,
  }),
};

/**
 * Color variants available to variant-driven components (button, badge,
 * alert, ...). `primary/secondary/tertiary` are an emphasis ladder (orange
 * solid → neutral soft → neutral ghost), `success/info/danger` are semantic
 * hues, and `outline` is a neutral bordered treatment.
 */
export const variants = [
  'primary',
  'secondary',
  'success',
  'info',
  'tertiary',
  'danger',
  'outline',
] as const;

/** The variants Manti UI ships `--variant-*` values for out of the box. */
export type MantiBuiltinVariant = (typeof variants)[number];

/**
 * Variant accepted by variant-driven components. Beyond the built-ins, any
 * string is allowed so applications can register custom variants in plain
 * CSS — declare a `[data-variant='brand']` block that defines the full
 * `--variant-*` vocabulary, then pass `variant="brand"`. The intersection
 * keeps built-in autocomplete.
 */
export type MantiVariant = MantiBuiltinVariant | (string & {});

/**
 * Corner radii. Generous and pillowy, echoing the folded mantı silhouette.
 *
 * These are the *resolved* values at `radiusFactor` 1 (source of truth for
 * types, docs, and the Tailwind bridge). In the generated CSS every step except
 * `full` is emitted as `calc(<step> * var(--manti-radius-factor))`. Shipped
 * `[data-radius]` presets re-declare those steps in their own scope, so the
 * local factor rescales the whole subtree — see `radiusFactor` below.
 *
 * The ramp is a scale of *sizes*, not of *shapes*: `full` is the always-pill
 * primitive for parts that are round by design (switch track, slider, spinner,
 * avatar, radio, badge). Roundness that a theme may switch on belongs to the
 * `radiusChannel` vocabulary instead, never to a ramp step — that separation is
 * what keeps a small control (checkbox) from ever collapsing into a circle no
 * matter how round the theme gets.
 */
export const radius = {
  xs: '4px',
  sm: '8px',
  md: '14px',
  lg: '18px',
  xl: '20px',
  '2xl': '26px',
  full: '9999px',
} as const;

/**
 * The multiplier every ramp step is scaled by. Override
 * `--manti-radius-factor` at the same scope that declares the ramp (normally
 * `:root`) to retune the whole system. For a nested subtree, use
 * `[data-radius]` (see `radiusModes`): its generated preset re-declares every
 * ramp step against the local factor so inherited, already-computed values do
 * not leak in from an ancestor.
 */
export const radiusFactor = '1';

/**
 * Roundness channels — the opt-in half of the radius model.
 *
 * A component consumes a channel with `max(<ramp step>, var(--manti-radius-*))`,
 * which is a no-op while the channel sits at its default and turns the part
 * pill-shaped once a theme raises it. Because opting in is explicit, a part that
 * must stay square-ish (checkbox, and any small indicator) simply never
 * references a channel and is structurally incapable of going round.
 *
 * - `pill`  — control-class parts that *may* become pill: button, input, select
 *   and combobox triggers, number-input, toggle, segmented control. No preset
 *   raises it, deliberately: pill controls are a strong stylistic choice, and
 *   binding them to a preset would also bind them to that preset's factor.
 *   Raising the channel yourself composes with *any* factor:
 *   `:root { --manti-radius-pill: 9999px }`.
 * - `thumb` — draggable handles (switch thumb, slider thumb), round by default
 *   because a square handle reads as broken at every size but `none`.
 */
export const radiusChannel = {
  pill: '0px',
  thumb: '9999px',
} as const;

/**
 * `[data-radius]` presets — set the attribute on any container to retune the
 * radius of everything inside it. One mode per distinct factor; a mode that only
 * differed from its neighbour by a channel would be a picker row most pages
 * cannot show a difference for.
 *
 * Each generated mode re-declares the ramp against its local factor and assigns
 * every channel, so modes never leak into one another. A mode still *lowers*
 * `pill` even though none raises it, so a consumer who opted into pill controls
 * globally can square a subtree with `data-radius="none"`. `none` is likewise
 * the only mode that lowers `full`, so squaring the system also squares the
 * by-design-round parts instead of leaving stray lozenges behind.
 */
export const radiusModes = {
  none: { factor: '0', full: '0px', pill: '0px', thumb: '0.5px' },
  sharp: { factor: '0.6', full: '9999px', pill: '0px', thumb: '9999px' },
  default: { factor: '1', full: '9999px', pill: '0px', thumb: '9999px' },
  round: { factor: '1.4', full: '9999px', pill: '0px', thumb: '9999px' },
} as const;

/** The `data-radius` values Manti UI ships presets for. */
export type MantiRadiusMode = keyof typeof radiusModes;

/**
 * A theme preset — one opinionated starting point over the shipped defaults.
 *
 * `colors` names a base color per variant; the generator expands each into the
 * full `--variant-*` vocabulary. `density` scales the spacing unit and the
 * control heights.
 */
export type MantiPresetDefinition = {
  label: string;
  description: string;
  /** The shipped theme. It needs no stylesheet, so none is generated. */
  default: boolean;
  colors: Partial<Record<'primary' | 'success' | 'info' | 'danger', string>>;
  coolHue: number;
  radiusFactor: string;
  density: number;
};

/**
 * The presets the Theme Studio offers, shipped as importable stylesheets:
 * `@manti-ui/styles/themes/<id>.css` (whole app) or the `data-manti-theme`
 * scopes in `@manti-ui/styles/themes.css` (one section).
 *
 * `packages/styles/scripts/gen-preset-css.mjs` generates both from this map,
 * so a preset can never drift from the CSS that ships it.
 */
export const presets = {
  manti: {
    label: 'Manti',
    description: 'The shipped default — warm orange over a cool neutral.',
    default: true,
    colors: {},
    coolHue: 280,
    radiusFactor: '1',
    density: 1,
  },
  violet: {
    label: 'Violet',
    description: 'Electric violet with generous corners.',
    default: false,
    colors: { primary: '#7c3aed' },
    coolHue: 300,
    radiusFactor: '1.2',
    density: 1,
  },
  ocean: {
    label: 'Ocean',
    description: 'Bright sky blue on a cold neutral, rounded.',
    default: false,
    // Info is a stop darker than the studio swatch: no ink clears AA on
    // #0284c7 (4.45:1), and the preset gate refuses to ship that.
    colors: { primary: '#0ea5e9', info: '#0369a1' },
    coolHue: 235,
    radiusFactor: '1.4',
    density: 1,
  },
  forest: {
    label: 'Forest',
    description: 'Deep green with tight, sober corners.',
    default: false,
    colors: { primary: '#15803d', success: '#16a34a' },
    coolHue: 150,
    radiusFactor: '0.6',
    density: 1,
  },
  rose: {
    label: 'Rose',
    description: 'Hot rose over a warm neutral, rounded.',
    default: false,
    colors: { primary: '#e11d48', danger: '#be123c' },
    coolHue: 350,
    radiusFactor: '1.4',
    density: 1,
  },
  graphite: {
    label: 'Graphite',
    description: 'Monochrome, square, and compact.',
    default: false,
    colors: { primary: '#4b5563' },
    coolHue: 250,
    radiusFactor: '0',
    density: 0.9,
  },
} as const satisfies Record<string, MantiPresetDefinition>;

/** The `presets` keys — `'manti' | 'violet' | …`. */
export type MantiPresetId = keyof typeof presets;

/**
 * Control heights — the shared vertical sizing of form controls (button, input,
 * select, number-input, combobox). A Tier-2 semantic scale so a consumer can
 * resize every control at once; components default their `--manti-*-height`
 * component token to it. Compact outliers (e.g. toggle-group) keep their own
 * values.
 */
export const controlHeight = {
  sm: '1.8rem',
  md: '2.2rem',
  lg: '2.7rem',
} as const;

/**
 * Spacing scale on a 4px grid.
 *
 * These are the *resolved* values (source of truth for types, docs, and the
 * Tailwind bridge). In the generated CSS the scale is anchored on
 * `--manti-space-1` (the 0.25rem grid unit): every other stop is emitted as
 * `calc(var(--manti-space-1) * n)`, so overriding that one custom property
 * rescales the entire scale. See `packages/styles/scripts/gen-tokens-css.mjs`.
 */
export const space = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
} as const;

/**
 * Type scale.
 *
 * These are the *resolved* values (source of truth for types, docs, and the
 * Tailwind bridge). In the generated CSS the scale is anchored on
 * `--manti-text-base` (the body size): every other stop is emitted as
 * `calc(var(--manti-text-base) * ratio)`, so overriding that one custom
 * property rescales the whole type scale proportionally. The ratios are derived
 * from these values at generation time, so the two can never drift.
 */
export const fontSize = {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem',
  '5xl': '3rem',
} as const;

export const lineHeight = {
  tight: '1.15',
  snug: '1.3',
  normal: '1.5',
  relaxed: '1.7',
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const fontFamily = {
  sans: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  mono: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace",
} as const;

/**
 * Optical letter-spacing.
 *
 * Type needs different tracking at different sizes: large display sizes read as
 * loose unless they are pulled in, and small all-caps-ish labels read as cramped
 * unless they are pushed out. Emitted verbatim in `em`, so every stop scales
 * with whatever font size it lands on.
 */
export const letterSpacing = {
  tighter: '-0.02em',
  tight: '-0.01em',
  normal: '0em',
  wide: '0.02em',
  wider: '0.04em',
  widest: '0.06em',
} as const;

/** Smooth motion. The brand promise lives here. */
export const duration = {
  fast: '120ms',
  base: '200ms',
  slow: '320ms',
  /** Headroom for expressive (full) motion — springs need time to settle. */
  slower: '440ms',
} as const;

export const easing = {
  /** Calm, confident ease-out. The default Manti UI curve. */
  smooth: 'cubic-bezier(0.32, 0.72, 0, 1)',
  /** Symmetric ease for reversible state changes. */
  soft: 'cubic-bezier(0.4, 0, 0.2, 1)',
  /**
   * Gentle spring with a soft overshoot. Authored with `linear()`.
   * Expressive (`data-motion="full"`) motion only.
   */
  spring:
    'linear(0, 0.006 1.1%, 0.025 2.3%, 0.097 4.7%, 0.207 7.3%, 0.835 18.5%, 1.018 22.6%, 1.078 25.5%, 1.094 28.8%, 1.054 36%, 1.007 44.8%, 0.991 53.3%, 1.001 73.2%, 1)',
  /**
   * Snappy bounce with a pronounced overshoot. Authored with `linear()`.
   * Expressive (`data-motion="full"`) motion only.
   */
  bounce:
    'linear(0, 0.218 6.2%, 0.652 13.5%, 1.062 21.6%, 1.166 26%, 1.184 30.6%, 1.13 36.1%, 1.04 44.6%, 0.996 52.8%, 0.998 70%, 1)',
} as const;

export const breakpoint = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
} as const;

export const zIndex = {
  base: '0',
  raised: '10',
  overlay: '1000',
  popover: '1100',
  toast: '1200',
  modal: '1300',
} as const;

/**
 * Component tokens (Tier 3).
 *
 * Public, semver-stable CSS custom properties scoped to a single component, each
 * defaulting to a Tier-2 semantic token. They are the sanctioned per-component
 * override surface: redefine `--manti-button-radius` to restyle every button
 * without forking the component or touching its internals.
 *
 * Curation rule — only *independent* dimensions are exposed. *Derived* values
 * (computed via `calc()` from these) stay private `--_*` knobs inside the
 * component CSS, so a consumer can never put a component into a geometrically
 * inconsistent state. Color is already handled by the `--variant-*` tier, so
 * this tier stays mostly structural (radius, spacing, sizing, typography).
 *
 * Values live hand-authored in each component's CSS (like the semantic roles),
 * because they are CSS expressions (`var(...)`, literals) a plain TS value cannot
 * express. This contract is the typed *registry* of which tokens exist — the
 * source of truth for docs, autocomplete, and the semver surface. The property
 * name for an entry is `--manti-${component}-${property}`.
 */
export const componentTokens = {
  accordion: ['radius', 'padding-x', 'padding-y', 'gap'],
  alert: [
    'radius',
    'padding-x',
    'padding-y',
    'gap',
    'icon-size',
    'dismiss-size',
    'font-size',
  ],
  avatar: ['size', 'radius'],
  badge: ['radius', 'font-size', 'padding-y', 'padding-x', 'gap', 'dot-size'],
  blockquote: ['accent-width', 'padding-x', 'font-size'],
  button: [
    'radius',
    'height',
    'padding-x',
    'font-size',
    'gap',
    'cursor',
    'bg-hover',
    'bg-active',
  ],
  calendar: ['day-min-height', 'day-padding', 'radius'],
  card: ['radius', 'padding-x', 'padding-y'],
  carousel: [
    'slide-gap',
    'gap',
    'radius',
    'trigger-size',
    'indicator-size',
    'viewport-height',
  ],
  checkbox: ['size', 'radius', 'gap', 'font-size', 'indicator-size'],
  clipboard: [
    'height',
    'radius',
    'padding-x',
    'gap',
    'font-size',
    'trigger-width',
  ],
  collapsible: ['radius', 'padding-x', 'padding-y', 'gap', 'icon-size'],
  code: ['radius', 'padding-x', 'padding-y', 'font-size'],
  'color-picker': [
    'height',
    'padding-x',
    'swatch-size',
    'panel-width',
    'area-height',
  ],
  combobox: [
    'height',
    'padding-x',
    'icon-size',
    'content-max-height',
    'content-padding',
    'content-gap',
    'item-padding-y',
    'item-padding-x',
    'item-gap',
    'item-radius',
    'item-font-size',
  ],
  'data-table': [
    'radius',
    'cell-padding-x',
    'cell-padding-y',
    'font-size',
    'header-font-size',
  ],
  'date-picker': [
    'height',
    'padding-x',
    'content-padding',
    'cell-size',
    'nav-size',
  ],
  dialog: ['max-width', 'radius', 'padding-x', 'padding-y', 'gap', 'z-index'],
  drawer: ['size'],
  editable: ['height'],
  field: ['height', 'padding-x', 'padding-y', 'font-size', 'addon-padding-x'],
  'floating-panel': ['min-width', 'min-height'],
  heading: ['font-size', 'line-height', 'weight', 'tracking'],
  'hover-card': ['max-width'],
  kbd: ['radius', 'padding-x', 'padding-y', 'font-size', 'border-width'],
  listbox: [
    'min-width',
    'max-height',
    'padding',
    'gap',
    'item-padding-y',
    'item-padding-x',
    'item-gap',
    'item-radius',
    'item-font-size',
  ],
  marquee: ['gap', 'duration'],
  menu: [
    'min-width',
    'max-width',
    'padding',
    'gap',
    'item-padding-y',
    'item-padding-x',
    'item-gap',
    'item-radius',
    'item-font-size',
    'submenu-min-width',
    'submenu-indicator-size',
    'submenu-offset',
    'motion-offset',
    'z-index',
  ],
  'navigation-menu': ['content-min-width'],
  'number-input': ['height', 'stepper-width'],
  pagination: ['size'],
  'pin-input': ['size'],
  popover: ['max-width', 'z-index'],
  progress: ['track-height', 'circle-size', 'circle-thickness'],
  'rating-group': ['size'],
  'scroll-area': ['size'],
  'segmented-control': ['height', 'padding-x'],
  select: [
    'height',
    'padding-x',
    'font-size',
    'icon-size',
    'content-max-height',
    'content-padding',
    'content-gap',
    'item-padding-y',
    'item-padding-x',
    'item-gap',
    'item-radius',
    'item-font-size',
  ],
  'signature-pad': ['height'],
  slider: ['thumb-size', 'track-size', 'length', 'marker-size'],
  spinner: ['size', 'thickness'],
  splitter: ['handle-size', 'line-size', 'line-size-active'],
  steps: ['indicator-size'],
  switch: ['track-width', 'track-height', 'track-padding'],
  'tags-input': ['height'],
  text: ['font-size', 'line-height', 'weight', 'tracking'],
  'time-picker': [
    'height',
    'padding-x',
    'column-height',
    'content-padding',
    'cell-min-width',
    'cell-padding-y',
    'cell-padding-x',
    'cell-radius',
    'cell-font-size',
  ],
  toast: ['width', 'radius'],
  toggle: ['size'],
  'toggle-group': ['height', 'padding-x'],
  tooltip: ['max-width', 'z-index'],
  tour: ['width', 'overlay-extent'],
} as const;

export type MantiComponentTokens = typeof componentTokens;

/** The component a component token belongs to (`'button' | 'switch' | …`). */
export type MantiComponentTokenScope = keyof MantiComponentTokens;

/**
 * Every public component-token custom-property name as a string-literal union,
 * e.g. `--manti-button-radius` | `--manti-switch-track-width`. Keeps autocomplete
 * for the override surface while still accepting any string elsewhere.
 */
export type MantiComponentToken = {
  [C in MantiComponentTokenScope]: `--manti-${C & string}-${MantiComponentTokens[C][number] & string}`;
}[MantiComponentTokenScope];

/** The complete Manti UI token contract. */
export const mantiTokens = {
  packageName: '@manti-ui/tokens',
  status: 'designed',
  color: { primitives: colorPrimitives, scaleRoles: colorScaleRoles },
  variants,
  componentTokens,
  radius,
  radiusFactor,
  radiusChannel,
  radiusModes,
  presets,
  controlHeight,
  space,
  fontSize,
  lineHeight,
  fontWeight,
  fontFamily,
  letterSpacing,
  duration,
  easing,
  breakpoint,
  zIndex,
} as const;

export type MantiTokens = typeof mantiTokens;

/** @deprecated Use {@link mantiTokens}. Retained for the infrastructure phase. */
export const mantiTokenContract = mantiTokens;
export type MantiTokenContract = MantiTokens;
