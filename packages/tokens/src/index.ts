/**
 * @manti-ui/tokens
 *
 * Framework-agnostic design token contract for Manti UI.
 *
 * The metaphor is mantı: a dish that appears in many regions and forms. The
 * palette pairs a cool neutral `gray` (Radix `slate`) with `orange`, `green`,
 * `amber`, `red`, and `blue` accents, all taken verbatim from the Radix Colors
 * 12-step scales (`@radix-ui/colors`) under plain, universally understood
 * color names.
 *
 * This module is the typed source of truth. Its primitive scales and scale
 * values are generated into the `--manti-*` custom properties of
 * `@manti-ui/styles` (`packages/styles/scripts/gen-tokens-css.mjs`, run via
 * `pnpm gen:tokens`); the semantic roles there pick a single step of each
 * scale.
 */
import {
  amber,
  amberDark,
  blackA,
  blue,
  blueDark,
  bronze,
  bronzeDark,
  brown,
  brownDark,
  crimson,
  crimsonDark,
  cyan,
  cyanDark,
  gold,
  goldDark,
  grass,
  grassDark,
  gray,
  grayA,
  grayDark,
  grayDarkA,
  green,
  greenDark,
  indigo,
  indigoDark,
  iris,
  irisDark,
  jade,
  jadeDark,
  lime,
  limeDark,
  mauve,
  mauveA,
  mauveDark,
  mauveDarkA,
  mint,
  mintDark,
  olive,
  oliveA,
  oliveDark,
  oliveDarkA,
  orange,
  orangeA,
  orangeDark,
  orangeDarkA,
  pink,
  pinkA,
  pinkDark,
  pinkDarkA,
  plum,
  plumDark,
  purple,
  purpleDark,
  red,
  redDark,
  ruby,
  rubyDark,
  sage,
  sageA,
  sageDark,
  sageDarkA,
  sand,
  sandA,
  sandDark,
  sandDarkA,
  sky,
  skyDark,
  slate,
  slateA,
  slateDark,
  slateDarkA,
  teal,
  tealDark,
  tomato,
  tomatoDark,
  violet,
  violetA,
  violetDark,
  violetDarkA,
  yellow,
  yellowDark,
} from '@radix-ui/colors';

/**
 * Scale step names. Radix numbers its steps `1…12`, and so does Manti: an
 * unbroken sequence makes "one step stronger" arithmetic instead of a lookup.
 * The Tailwind bridge (`packages/styles/src/tailwind-theme.css`) keeps the
 * 50…950 utility names and maps them onto these, so `bg-orange-500` keeps
 * resolving to Manti.
 *
 * Every step is theme-aware: `--manti-orange-3` is Radix `orange3` in light and
 * `orangeDark3` in dark, so a step means the same job in both schemes. 1–2
 * page/panel backgrounds, 3–5 component backgrounds, 6–8 borders and focus
 * rings, 9–10 the solid fills, 11–12 text.
 */
const SCALE_STEPS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

/** One step number of a 12-step scale. */
export type MantiScaleStep = (typeof SCALE_STEPS)[number];

/**
 * The palette-role contract shared by every Manti color scale.
 *
 * These names describe intent, not a component-specific implementation. The
 * semantic layer maps them to single steps; component CSS should consume
 * semantic roles or `--variant-*`, not raw scale steps. Keeping the map typed
 * makes the scale legible to generators, docs, and future lint rules.
 */
export const colorScaleRoles = {
  appBackground: [1, 2],
  componentBackground: { rest: 3, hover: 4, active: 5 },
  border: { subtle: 6, interactive: 7, strong: 8 },
  solid: { rest: 9, hover: 10 },
  text: { lowContrast: 11, highContrast: 12 },
} as const;

/** A scale's twelve steps, keyed `1…12`. */
export type MantiScaleSteps = Record<MantiScaleStep, string>;

/**
 * One Radix scale as Manti ships it: the light and the dark scale side by
 * side. `radix` names the scale in `@radix-ui/colors`, so a reader can find
 * the source of every value.
 */
export type MantiColorScale = {
  radix: string;
  light: MantiScaleSteps;
  dark: MantiScaleSteps;
};

/**
 * Re-key a Radix scale object (`{ slate1: …, slate12: … }`) onto `1…12`.
 * Radix keys alpha scales with an `A` before the step (`slateA3`), which the
 * prefix covers.
 */
function steps(source: Record<string, string>, prefix: string) {
  const out = {} as MantiScaleSteps;
  for (const step of SCALE_STEPS) {
    const value = source[`${prefix}${step}`];
    if (value === undefined)
      throw new Error(`@radix-ui/colors has no ${prefix}${step}`);
    out[step] = value;
  }
  return out;
}

function scale(
  radix: string,
  light: Record<string, string>,
  dark: Record<string, string>,
): MantiColorScale {
  return { radix, light: steps(light, radix), dark: steps(dark, radix) };
}

/**
 * The opaque color scales, taken verbatim from Radix Colors. The neutral is
 * Radix `slate`, the cool blue-gray closest to Manti's cool-dark signature.
 */
export const colorScales = {
  /** Cool neutral: every surface, text, and border color. */
  gray: scale('slate', slate, slateDark),
  /** Primary. Warm orange, the signature Manti UI accent. */
  orange: scale('orange', orange, orangeDark),
  /** Success. */
  green: scale('green', green, greenDark),
  /** Warning text. */
  amber: scale('amber', amber, amberDark),
  /** Danger. */
  red: scale('red', red, redDark),
  /** Info. */
  blue: scale('blue', blue, blueDark),
} as const satisfies Record<string, MantiColorScale>;

/**
 * The translucent Radix scales the semantic roles read, emitted as
 * `--manti-{name}-a{step}`. Only what a role consumes ships: `gray` (`slateA`)
 * for the panel hairline, `black` (`blackA`, one scale for both schemes) for
 * the modal overlay, and `violet`, `pink` and `orange` for the three ambient
 * glows behind the app.
 */
export const alphaScales = {
  gray: scale('slateA', slateA, slateDarkA),
  black: scale('blackA', blackA, blackA),
  violet: scale('violetA', violetA, violetDarkA),
  pink: scale('pinkA', pinkA, pinkDarkA),
  orange: scale('orangeA', orangeA, orangeDarkA),
} as const satisfies Record<string, MantiColorScale>;

/**
 * The two inks a solid fill may carry, each one Radix step held fixed across
 * schemes: the lightest light-scheme slate and the darkest dark-scheme slate.
 * A theme-aware step cannot do this job, because `--manti-gray-12` is dark in
 * light and light in dark, while a label on an orange fill needs the same ink
 * in both. Emitted as `--manti-ink-light` / `--manti-ink-dark`.
 */
export const colorInks = {
  light: slate.slate1,
  dark: slateDark.slate1,
} as const;

/**
 * The Radix scales whose step 9 is designed for dark foreground text. Radix:
 * "Most step 9 colors are designed for white foreground text. Sky, Mint, Lime,
 * Yellow, and Amber are designed for dark foreground text." Every other scale
 * carries the light ink on its solid, in both schemes.
 */
export const radixDarkInkScales = [
  'sky',
  'mint',
  'lime',
  'yellow',
  'amber',
] as const;

/**
 * Which of the {@link colorInks} a label on a Radix scale's step 9 takes,
 * following Radix's own rule rather than a measurement.
 */
export function radixInk(scale: string): 'light' | 'dark' {
  return (radixDarkInkScales as readonly string[]).includes(scale)
    ? 'dark'
    : 'light';
}

/**
 * Primitive color ramps as the CSS values `--manti-{hue}-{step}` carries, for
 * swatches and docs: `colorPrimitives.gray[1]` is
 * `light-dark(#fcfcfd, #111113)`, so a swatch painted with it follows the
 * color scheme. Read {@link colorScales} for the per-scheme values.
 */
export const colorPrimitives = Object.fromEntries(
  Object.entries(colorScales).map(([name, s]) => [
    name,
    Object.fromEntries(
      SCALE_STEPS.map((step) => [
        step,
        `light-dark(${s.light[step]}, ${s.dark[step]})`,
      ]),
    ),
  ]),
) as Record<keyof typeof colorScales, MantiScaleSteps>;

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
 *   and combobox triggers, number-input, toggle, segmented control. The
 *   `data-radius="pill"` preset raises it together with the round factor;
 *   raising the channel yourself still composes with *any* factor:
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
 * radius of everything inside it. `none` is the explicit square mode; `sharp`,
 * `default`, `round`, and `pill` are the four positive shape profiles. `pill`
 * intentionally shares the round factor but also raises the control-class
 * channel, so controls visibly become lozenges.
 *
 * Each generated mode re-declares the ramp against its local factor and assigns
 * every channel, so modes never leak into one another. `none` lowers both
 * `pill` and `full`, so squaring the system also squares the by-design-round
 * parts instead of leaving stray lozenges behind.
 */
export const radiusModes = {
  none: { factor: '0', full: '0px', pill: '0px', thumb: '0.5px' },
  sharp: { factor: '0.6', full: '9999px', pill: '0px', thumb: '9999px' },
  default: { factor: '1', full: '9999px', pill: '0px', thumb: '9999px' },
  round: { factor: '1.2', full: '9999px', pill: '0px', thumb: '9999px' },
  pill: { factor: '1.4', full: '9999px', pill: '9999px', thumb: '9999px' },
} as const;

/** The `data-radius` values Manti UI ships presets for. */
export type MantiRadiusMode = keyof typeof radiusModes;

/** The Radix accent scales Manti offers as a variant color, in Radix order. */
export const radixAccentScaleNames = [
  'tomato',
  'red',
  'ruby',
  'crimson',
  'pink',
  'plum',
  'purple',
  'violet',
  'iris',
  'indigo',
  'blue',
  'cyan',
  'teal',
  'jade',
  'green',
  'grass',
  'bronze',
  'gold',
  'brown',
  'orange',
  'amber',
  'yellow',
  'lime',
  'mint',
  'sky',
] as const;

/** The Radix gray scales Manti offers as a theme's neutral. */
export const radixGrayScaleNames = [
  'gray',
  'mauve',
  'slate',
  'sage',
  'olive',
  'sand',
] as const;

/** A Radix accent scale name: `'tomato' | 'red' | … | 'sky'`. */
export type MantiRadixAccentScale = (typeof radixAccentScaleNames)[number];

/** A Radix gray scale name: `'gray' | 'mauve' | 'slate' | 'sage' | 'olive' | 'sand'`. */
export type MantiRadixGrayScale = (typeof radixGrayScaleNames)[number];

/** Any Radix scale name Manti offers, accent or gray. */
export type MantiRadixScale = MantiRadixAccentScale | MantiRadixGrayScale;

/**
 * An accent in the catalog: its light and dark twelve steps, plus `gray`, the
 * Radix gray it pairs with naturally (Radix's own pairing guide).
 */
export type MantiRadixAccentEntry = MantiColorScale & {
  kind: 'accent';
  gray: MantiRadixGrayScale;
};

/**
 * A gray in the catalog: its light and dark twelve steps and its translucent
 * twin, which a theme on that neutral needs for the panel hairline. A gray
 * pairs with itself.
 */
export type MantiRadixGrayEntry = MantiColorScale & {
  kind: 'gray';
  gray: MantiRadixGrayScale;
  alpha: MantiColorScale;
};

/** One entry of {@link radixScales}. */
export type MantiRadixScaleEntry = MantiRadixAccentEntry | MantiRadixGrayEntry;

function accent(
  radix: MantiRadixAccentScale,
  light: Record<string, string>,
  dark: Record<string, string>,
  gray: MantiRadixGrayScale,
): MantiRadixAccentEntry {
  return { ...scale(radix, light, dark), kind: 'accent', gray };
}

function neutral(
  radix: MantiRadixGrayScale,
  light: Record<string, string>,
  dark: Record<string, string>,
  lightAlpha: Record<string, string>,
  darkAlpha: Record<string, string>,
): MantiRadixGrayEntry {
  return {
    ...scale(radix, light, dark),
    kind: 'gray',
    gray: radix,
    alpha: scale(`${radix}A`, lightAlpha, darkAlpha),
  };
}

/**
 * The Radix scale catalog: every scale a Manti theme may pick, keyed by its
 * Radix name. A theme names an accent per variant and a gray as its neutral,
 * and never a free color, so every theme stays on Radix steps whose contrast
 * Radix designed for.
 *
 * Theme Studio and Oklava read their pickers from here, and `presets` may name
 * only these keys, which the type checker enforces.
 */
export const radixScales: {
  readonly [K in MantiRadixAccentScale]: MantiRadixAccentEntry;
} & { readonly [K in MantiRadixGrayScale]: MantiRadixGrayEntry } = {
  tomato: accent('tomato', tomato, tomatoDark, 'mauve'),
  red: accent('red', red, redDark, 'mauve'),
  ruby: accent('ruby', ruby, rubyDark, 'mauve'),
  crimson: accent('crimson', crimson, crimsonDark, 'mauve'),
  pink: accent('pink', pink, pinkDark, 'mauve'),
  plum: accent('plum', plum, plumDark, 'mauve'),
  purple: accent('purple', purple, purpleDark, 'mauve'),
  violet: accent('violet', violet, violetDark, 'mauve'),
  iris: accent('iris', iris, irisDark, 'slate'),
  indigo: accent('indigo', indigo, indigoDark, 'slate'),
  blue: accent('blue', blue, blueDark, 'slate'),
  cyan: accent('cyan', cyan, cyanDark, 'slate'),
  teal: accent('teal', teal, tealDark, 'sage'),
  jade: accent('jade', jade, jadeDark, 'sage'),
  green: accent('green', green, greenDark, 'sage'),
  grass: accent('grass', grass, grassDark, 'olive'),
  bronze: accent('bronze', bronze, bronzeDark, 'sand'),
  gold: accent('gold', gold, goldDark, 'sand'),
  brown: accent('brown', brown, brownDark, 'sand'),
  orange: accent('orange', orange, orangeDark, 'sand'),
  amber: accent('amber', amber, amberDark, 'sand'),
  yellow: accent('yellow', yellow, yellowDark, 'sand'),
  lime: accent('lime', lime, limeDark, 'olive'),
  mint: accent('mint', mint, mintDark, 'sage'),
  sky: accent('sky', sky, skyDark, 'slate'),
  gray: neutral('gray', gray, grayDark, grayA, grayDarkA),
  mauve: neutral('mauve', mauve, mauveDark, mauveA, mauveDarkA),
  slate: neutral('slate', slate, slateDark, slateA, slateDarkA),
  sage: neutral('sage', sage, sageDark, sageA, sageDarkA),
  olive: neutral('olive', olive, oliveDark, oliveA, oliveDarkA),
  sand: neutral('sand', sand, sandDark, sandA, sandDarkA),
};

/**
 * A theme preset: one opinionated palette over the shipped defaults.
 *
 * A preset is color and nothing else, and every color it names is a key of
 * {@link radixScales}. `colors` names a scale per variant, which the generator expands into
 * the full `--variant-*` vocabulary from that scale's twelve steps, and
 * `neutral` names the Radix gray behind every surface, border and text role.
 * Shape, density, and type are deliberately left out: those are product
 * decisions that a palette must not silently make, so a preset can be swapped
 * at any point without moving a control's size or corner.
 */
export type MantiPresetDefinition = {
  label: string;
  description: string;
  /** The shipped theme. It needs no stylesheet, so none is generated. */
  default: boolean;
  colors: { primary: MantiRadixScale } & Partial<
    Record<'success' | 'info' | 'danger', MantiRadixScale>
  >;
  neutral: MantiRadixGrayScale;
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
    colors: { primary: 'orange' },
    neutral: 'slate',
  },
  violet: {
    label: 'Violet',
    description: 'Electric violet over a violet-leaning neutral.',
    default: false,
    colors: { primary: 'violet' },
    neutral: 'mauve',
  },
  ocean: {
    label: 'Ocean',
    description: 'Bright sky blue on a cold neutral.',
    default: false,
    // Info moves to cyan so it reads apart from the sky primary.
    colors: { primary: 'sky', info: 'cyan' },
    neutral: 'slate',
  },
  forest: {
    label: 'Forest',
    description: 'Deep green over a green-tinted neutral.',
    default: false,
    // Success moves to jade so it reads apart from the grass primary.
    colors: { primary: 'grass', success: 'jade' },
    neutral: 'sage',
  },
  rose: {
    label: 'Rose',
    description: 'Hot rose over a warm neutral.',
    default: false,
    // Danger moves to tomato so it reads apart from the ruby primary.
    colors: { primary: 'ruby', danger: 'tomato' },
    neutral: 'mauve',
  },
  graphite: {
    label: 'Graphite',
    description: 'Monochrome: a gray brand over a cool neutral.',
    default: false,
    colors: { primary: 'slate' },
    neutral: 'slate',
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
  11: '2.75rem',
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
  none: '1',
  tight: '1.15',
  snug: '1.3',
  normal: '1.5',
  /** Shared baseline for single-line controls; independently configurable. */
  control: '1.5',
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
    'status-padding-y',
    'status-padding-x',
    'status-gap',
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
  dialog: [
    'max-width',
    'radius',
    'padding-x',
    'padding-y',
    'gap',
    'z-index',
    'close-size',
  ],
  drawer: ['size', 'close-size'],
  editable: ['height'],
  field: ['height', 'padding-x', 'padding-y', 'font-size', 'addon-padding-x'],
  'file-upload': [
    'gap',
    'label-font-size',
    'dropzone-gap',
    'dropzone-padding',
    'dropzone-radius',
    'dropzone-font-size',
    'trigger-height',
    'trigger-padding-x',
    'trigger-radius',
    'trigger-font-size',
    'item-gap',
    'item-group-gap',
    'item-padding-x',
    'item-padding-y',
    'item-radius',
    'item-font-size',
    'item-size-font-size',
    'delete-trigger-size',
    'delete-trigger-radius',
  ],
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
  'number-input': ['height', 'stepper-width', 'radius'],
  pagination: ['size'],
  'pin-input': ['size'],
  popover: ['max-width', 'z-index'],
  progress: ['track-height', 'circle-size', 'circle-thickness'],
  'radio-group': [
    'gap',
    'horizontal-gap',
    'item-gap',
    'control-size',
    'dot-size',
    'label-font-size',
    'item-font-size',
  ],
  'rating-group': ['size'],
  'scroll-area': ['size'],
  'segmented-control': ['height', 'padding-x', 'radius'],
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
  tabs: [
    'gap',
    'list-gap',
    'track-padding',
    'track-radius',
    'track-radius-vertical',
    'trigger-gap',
    'trigger-padding-y',
    'trigger-padding-x',
    'trigger-font-size',
    'trigger-radius',
    'indicator-size',
    'content-radius',
  ],
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
  'toggle-group': ['height', 'padding-x', 'radius'],
  tooltip: ['max-width', 'z-index'],
  tour: ['width', 'overlay-extent'],
  'tree-view': [
    'gap',
    'tree-gap',
    'label-font-size',
    'item-gap',
    'item-padding-y',
    'item-padding-x',
    'item-radius',
    'item-font-size',
    'branch-indent',
    'leaf-indent',
  ],
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
  color: {
    primitives: colorPrimitives,
    scales: colorScales,
    alphaScales,
    inks: colorInks,
    scaleRoles: colorScaleRoles,
  },
  variants,
  componentTokens,
  radius,
  radiusFactor,
  radiusChannel,
  radiusModes,
  presets,
  radixScales,
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
