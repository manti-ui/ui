/**
 * @manti-ui/tokens
 *
 * Framework-agnostic design token contract for Manti UI.
 *
 * The metaphor is mantı: a dish that appears in many regions and forms. The
 * palette is warm-tinted — a neutral `gray` plus `orange`, `green`, `amber`,
 * `red`, and `blue` — expressed as perceptually-smooth OKLCH ramps under plain,
 * universally understood color names.
 *
 * This module is the typed source of truth. Its primitive ramps and scale
 * values are generated into the `--manti-*` custom properties of
 * `@manti-ui/styles` (`packages/styles/scripts/gen-tokens-css.mjs`, run via
 * `pnpm gen:tokens`); the theme-aware roles there layer light/dark resolution on
 * top with the CSS `light-dark()` function.
 */

/** Primitive color ramps. Fixed values, identical in light and dark themes. */
export const colorPrimitives = {
  /** Warm neutral. The backbone of every surface and text color. */
  gray: {
    50: 'oklch(0.985 0.004 80)',
    100: 'oklch(0.968 0.006 80)',
    200: 'oklch(0.934 0.008 78)',
    300: 'oklch(0.888 0.01 76)',
    400: 'oklch(0.79 0.012 74)',
    500: 'oklch(0.672 0.013 72)',
    600: 'oklch(0.556 0.013 70)',
    700: 'oklch(0.452 0.012 68)',
    800: 'oklch(0.352 0.011 66)',
    900: 'oklch(0.268 0.01 64)',
    950: 'oklch(0.196 0.008 62)',
  },
  /** Primary. Warm orange — the signature Manti UI accent. */
  orange: {
    50: 'oklch(0.972 0.018 50)',
    100: 'oklch(0.94 0.04 48)',
    200: 'oklch(0.888 0.072 46)',
    300: 'oklch(0.82 0.11 44)',
    400: 'oklch(0.745 0.15 42)',
    500: 'oklch(0.678 0.17 40)',
    600: 'oklch(0.61 0.172 38)',
    700: 'oklch(0.52 0.15 36)',
    800: 'oklch(0.43 0.122 35)',
    900: 'oklch(0.35 0.092 34)',
    950: 'oklch(0.262 0.064 33)',
  },
  /** Success. Fresh green. */
  green: {
    50: 'oklch(0.972 0.022 150)',
    100: 'oklch(0.94 0.044 151)',
    200: 'oklch(0.89 0.072 152)',
    300: 'oklch(0.82 0.1 153)',
    400: 'oklch(0.74 0.12 154)',
    500: 'oklch(0.668 0.128 155)',
    600: 'oklch(0.58 0.12 156)',
    700: 'oklch(0.486 0.1 157)',
    800: 'oklch(0.398 0.08 158)',
    900: 'oklch(0.32 0.062 159)',
    950: 'oklch(0.238 0.044 160)',
  },
  /** Warning. Golden amber. */
  amber: {
    50: 'oklch(0.978 0.022 85)',
    100: 'oklch(0.952 0.046 83)',
    200: 'oklch(0.908 0.082 80)',
    300: 'oklch(0.86 0.116 77)',
    400: 'oklch(0.812 0.14 74)',
    500: 'oklch(0.76 0.15 71)',
    600: 'oklch(0.68 0.146 68)',
    700: 'oklch(0.566 0.12 66)',
    800: 'oklch(0.462 0.096 64)',
    900: 'oklch(0.382 0.074 62)',
    950: 'oklch(0.286 0.054 60)',
  },
  /** Danger. Hot red. */
  red: {
    50: 'oklch(0.971 0.018 25)',
    100: 'oklch(0.936 0.04 24)',
    200: 'oklch(0.882 0.074 23)',
    300: 'oklch(0.81 0.116 23)',
    400: 'oklch(0.726 0.17 24)',
    500: 'oklch(0.652 0.205 26)',
    600: 'oklch(0.586 0.21 27)',
    700: 'oklch(0.502 0.186 27)',
    800: 'oklch(0.42 0.15 27)',
    900: 'oklch(0.352 0.115 27)',
    950: 'oklch(0.262 0.078 26)',
  },
  /** Info. Smooth, calm blue. */
  blue: {
    50: 'oklch(0.974 0.014 235)',
    100: 'oklch(0.94 0.03 236)',
    200: 'oklch(0.89 0.054 237)',
    300: 'oklch(0.82 0.08 238)',
    400: 'oklch(0.73 0.108 240)',
    500: 'oklch(0.65 0.13 242)',
    600: 'oklch(0.566 0.14 244)',
    700: 'oklch(0.482 0.128 246)',
    800: 'oklch(0.402 0.104 247)',
    900: 'oklch(0.336 0.08 248)',
    950: 'oklch(0.252 0.056 249)',
  },
} as const;

/** Semantic tones available to tonal components (button, badge, alert, ...). */
export const tones = [
  'primary',
  'neutral',
  'success',
  'warning',
  'danger',
  'info',
] as const;

/** The tones Manti UI ships `--tone-*` values for out of the box. */
export type MantiBuiltinTone = (typeof tones)[number];

/**
 * Tone accepted by tonal components. Beyond the built-ins, any string is
 * allowed so applications can register custom tones in plain CSS — declare a
 * `[data-tone='brand']` block that defines the full `--tone-*` vocabulary,
 * then pass `tone="brand"`. The intersection keeps built-in autocomplete.
 */
export type MantiTone = MantiBuiltinTone | (string & {});

/** Corner radii. Generous and pillowy, echoing the folded mantı silhouette. */
export const radius = {
  xs: '4px',
  sm: '6px',
  md: '10px',
  lg: '14px',
  xl: '20px',
  '2xl': '28px',
  full: '9999px',
} as const;

/**
 * Control heights — the shared vertical sizing of form controls (button, input,
 * select, number-input, combobox). A Tier-2 semantic scale so a consumer can
 * resize every control at once; components default their `--manti-*-height`
 * component token to it. Compact outliers (e.g. toggle-group) keep their own
 * values.
 */
export const controlHeight = {
  sm: '2rem',
  md: '2.5rem',
  lg: '3rem',
} as const;

/** Spacing scale on a 4px grid. */
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

/** Type scale. */
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

/** Soft, warm-tinted elevation. */
export const shadow = {
  sm: '0 1px 2px -1px oklch(0.2 0.02 60 / 0.12)',
  md: '0 6px 16px -6px oklch(0.2 0.02 60 / 0.18)',
  lg: '0 18px 40px -12px oklch(0.2 0.02 60 / 0.22)',
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
 * inconsistent state. Color is already handled by the tonal `--tone-*` tier, so
 * this tier stays mostly structural (radius, spacing, sizing, typography).
 *
 * Values live hand-authored in each component's CSS (like the semantic roles),
 * because they are CSS expressions (`var(...)`, literals) a plain TS value cannot
 * express. This contract is the typed *registry* of which tokens exist — the
 * source of truth for docs, autocomplete, and the semver surface. The property
 * name for an entry is `--manti-${component}-${property}`.
 */
export const componentTokens = {
  button: ['radius', 'height', 'padding-x', 'font-size', 'gap'],
  switch: ['track-width', 'track-height', 'track-padding'],
  avatar: ['size'],
  badge: ['font-size', 'padding-x', 'padding-y'],
  carousel: ['viewport-height', 'slide-gap'],
  checkbox: ['size'],
  clipboard: ['height'],
  'color-picker': ['height', 'panel-width', 'area-height'],
  combobox: ['height', 'content-max-height'],
  'date-picker': ['height'],
  dialog: ['max-width'],
  drawer: ['size'],
  editable: ['height'],
  field: ['height', 'padding-x'],
  'floating-panel': ['min-width', 'min-height'],
  'hover-card': ['max-width'],
  listbox: ['min-width', 'max-height'],
  marquee: ['duration', 'gap'],
  menu: ['min-width', 'max-width'],
  'navigation-menu': ['content-min-width'],
  'number-input': ['height', 'stepper-width'],
  pagination: ['size'],
  'pin-input': ['size'],
  popover: ['max-width'],
  progress: ['track-height', 'circle-size'],
  'rating-group': ['size'],
  'scroll-area': ['size'],
  'segmented-control': ['height', 'padding-x'],
  select: ['height', 'content-max-height'],
  'signature-pad': ['height'],
  slider: ['thumb-size', 'track-size', 'length'],
  spinner: ['size', 'thickness'],
  steps: ['indicator-size'],
  'tags-input': ['height'],
  'time-picker': ['height', 'column-height', 'cell-min-width'],
  toast: ['width'],
  toggle: ['size'],
  'toggle-group': ['height', 'padding-x'],
  tooltip: ['max-width'],
  tour: ['width'],
  timer: ['item-min-width'],
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
  color: { primitives: colorPrimitives },
  tones,
  componentTokens,
  radius,
  controlHeight,
  space,
  fontSize,
  lineHeight,
  fontWeight,
  fontFamily,
  shadow,
  duration,
  easing,
  breakpoint,
  zIndex,
} as const;

export type MantiTokens = typeof mantiTokens;

/** @deprecated Use {@link mantiTokens}. Retained for the infrastructure phase. */
export const mantiTokenContract = mantiTokens;
export type MantiTokenContract = MantiTokens;
