import {
  radixScales,
  type MantiColorScale,
  type MantiScaleStep,
} from '@manti-ui/tokens';

import { inkFor } from './color.js';
import {
  BASE_CONTROL_HEIGHT_REM,
  BASE_SPACE_REM,
  DEFAULT_THEME,
  VARIANTS,
  configForPreset,
  fontStack,
  googleFamily,
  googleFontHref,
  type ScaleName,
  type ThemeConfig,
  type VariantKey,
} from './config.js';

/**
 * The CSS the panel writes, and the copyable stylesheet it hands back.
 *
 * `buildThemeCss` diffs the config against the preset it is based on and emits
 * only what differs, so an untouched preset produces an empty string. The result
 * is injected UNLAYERED, which is how it beats `@layer manti.tokens` with no
 * `!important` anywhere. That is also the escape hatch a real consumer uses, so
 * the CSS shown in the export dialog is byte-for-byte the CSS the page is
 * running.
 *
 * Every color it writes is a Radix step as a `light-dark()` pair, expanded with
 * the step mapping `packages/styles/scripts/gen-preset-css.mjs` uses for the
 * shipped presets. So a theme picked here declares what the matching preset
 * stylesheet declares: `violet` on `mauve` is the Violet preset.
 */

/** Trim float noise: 0.30000000000000004 -> 0.3. */
export function num(value: number): string {
  return String(Math.round(value * 1000) / 1000);
}

const ld = (light: string, dark: string) => `light-dark(${light}, ${dark})`;

/** One step of a Radix scale as a theme-aware value: its light and dark twin. */
const step = (scale: MantiColorScale, n: MantiScaleStep) =>
  ld(scale.light[n], scale.dark[n]);

/** The twelve step numbers, read off the catalog rather than restated. */
const STEPS = Object.keys(radixScales.slate.light).map(
  Number,
) as MantiScaleStep[];

/**
 * One Radix scale expanded into the full `--variant-*` vocabulary: solid 9 →
 * hover 10, soft 3 → 4 → 5, soft text 11, border 7, text 11, ring 8. The press
 * darkens the hover toward the scheme's text color, the direction that gains
 * contrast in each theme, exactly as the shipped primary does.
 */
function variantBlock(key: VariantKey, name: ScaleName): string {
  const scale = radixScales[name];
  const decls: [string, string][] = [
    ['--variant-solid', step(scale, 9)],
    ['--variant-solid-hover', step(scale, 10)],
    [
      '--variant-solid-active',
      `color-mix(in oklab, ${step(scale, 10)} 88%, var(--manti-gray-12))`,
    ],
    ['--variant-on-solid', inkFor(name)],
    ['--variant-soft-bg', step(scale, 3)],
    ['--variant-soft-bg-hover', step(scale, 4)],
    ['--variant-soft-bg-active', step(scale, 5)],
    ['--variant-soft-text', step(scale, 11)],
    ['--variant-border', step(scale, 7)],
    ['--variant-text', step(scale, 11)],
    ['--variant-ring', step(scale, 8)],
  ];
  const body = decls.map(([prop, value]) => `  ${prop}: ${value};`).join('\n');
  return `[data-variant='${key}'] {\n${body}\n}`;
}

/**
 * The scale a variant runs under `base` when the config names none: the base's
 * own pick, else the shipped one. The neutral rungs ship no scale of their own,
 * so any pick for them is an override.
 */
function baseScale(base: ThemeConfig, key: VariantKey): ScaleName | null {
  return (
    base.colors[key] ??
    VARIANTS.find((item) => item.key === key)?.fallback ??
    null
  );
}

/**
 * The whole theme as CSS. Returns `''` when nothing is overridden, which is
 * what both the live `<style>` and the export dialog key off.
 *
 * `base` is what the config is diffed against, and defaults to the preset the
 * config names, because the preset's own palette normally arrives through
 * `@manti-ui/styles/themes.css`. Pass `DEFAULT_THEME` to fold that palette into
 * the output instead, for a host app that has not imported the preset
 * stylesheet.
 */
export function buildThemeCss(
  config: ThemeConfig,
  base: ThemeConfig = configForPreset(config.preset),
): string {
  const d = base;
  const root: string[] = [];

  if (config.neutral !== d.neutral) {
    // The neutral is an anchor: every surface, border and text role reads a
    // `--manti-gray-*` step, so re-declaring the steps retints all of them.
    const gray = radixScales[config.neutral];
    root.push(
      ...STEPS.map((n) => `  --manti-gray-${n}: ${step(gray, n)};`),
      ...STEPS.map((n) => `  --manti-gray-a${n}: ${step(gray.alpha, n)};`),
    );
  }
  // Two branded roles are NOT variant-driven, so `[data-variant]` never
  // reaches them: Progress spends its `data-variant` slot on linear/circular
  // and reads `--manti-accent-fill` instead, and `::selection` reads its own
  // background. Retint them from the primary scale, on the steps the shipped
  // roles read (fill 9, selection 5), or a themed app keeps a stray orange
  // progress bar and text selection.
  const primary = config.colors.primary;
  if (primary && primary !== baseScale(d, 'primary')) {
    const scale = radixScales[primary];
    root.push(
      `  --manti-accent-fill: ${step(scale, 9)};`,
      `  --manti-selection-bg: ${step(scale, 5)};`,
    );
  }
  if (config.radiusFactor !== d.radiusFactor) {
    root.push(
      '  /* Rescales the whole radius ramp (xs…2xl derive from this factor). */',
      `  --manti-radius-factor: ${num(config.radiusFactor)};`,
    );
  }
  if (config.density !== d.density) {
    root.push(
      '  /* Density: every space token derives from space-1. */',
      `  --manti-space-1: ${num(BASE_SPACE_REM * config.density)}rem;`,
      `  --manti-control-height-sm: ${num(BASE_CONTROL_HEIGHT_REM.sm * config.density)}rem;`,
      `  --manti-control-height-md: ${num(BASE_CONTROL_HEIGHT_REM.md * config.density)}rem;`,
      `  --manti-control-height-lg: ${num(BASE_CONTROL_HEIGHT_REM.lg * config.density)}rem;`,
    );
  }
  const stack = fontStack(config.font);
  if (stack && config.font !== d.font) {
    root.push(`  --manti-font-sans: ${stack};`);
  }
  if (config.textBase !== d.textBase) {
    root.push(
      '  /* Type scale root: xs…5xl are calc() multiples of this. */',
      `  --manti-text-base: ${num(config.textBase)}rem;`,
    );
  }
  if (config.focusWidth !== d.focusWidth) {
    root.push(`  --manti-focus-ring-width: ${num(config.focusWidth)}px;`);
  }

  const blocks: string[] = [];
  if (root.length > 0) blocks.push(`:root {\n${root.join('\n')}\n}`);
  for (const variant of VARIANTS) {
    const name = config.colors[variant.key];
    if (name && name !== baseScale(d, variant.key)) {
      blocks.push(variantBlock(variant.key, name));
    }
  }
  return blocks.join('\n\n');
}

const CSS_HEADER = `/**
 * Manti UI theme, generated in the Theme Studio (https://studio.manti.design).
 *
 * Import this file AFTER \`@manti-ui/styles/index.css\` and keep it out of a
 * cascade layer: unlayered declarations beat Manti's \`@layer manti.tokens\`
 * defaults, so these overrides win without a single \`!important\`.
 * A selected Manti preset is imported from \`@manti-ui/styles\` below.
 *
 *   import '@manti-ui/styles/index.css';
 *   import './manti-theme.css';
 *
 * Every value below is a public token. Colors stay theme-aware through
 * \`light-dark()\`, so one declaration covers both light and dark.
 */`;

function presetStylesheetImport(config: ThemeConfig): string {
  return config.preset === DEFAULT_THEME.preset
    ? ''
    : `@import '@manti-ui/styles/themes/${config.preset}.css';`;
}

/**
 * The imports the exported stylesheet opens with: the preset, and the webfont
 * when the theme picked one. `@import` has to precede every rule, so these are
 * assembled ahead of the token blocks (a comment header is allowed before them).
 */
export function stylesheetImports(config: ThemeConfig): string {
  const family = googleFamily(config.font);
  return [
    presetStylesheetImport(config),
    family ? `@import url('${googleFontHref(family)}');` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

/** The copyable stylesheet: the running CSS plus a how-to-use header. */
export function buildThemeStylesheet(config: ThemeConfig): string {
  const css = buildThemeCss(config);
  const body =
    [stylesheetImports(config), css].filter(Boolean).join('\n\n') ||
    '/* Nothing overridden yet: this is the shipped Manti theme. */';
  return `${CSS_HEADER}\n\n${body}\n`;
}

/** True when nothing is overridden, i.e. the app runs its shipped theme. */
export function isDefaultTheme(config: ThemeConfig): boolean {
  return config.preset === DEFAULT_THEME.preset && buildThemeCss(config) === '';
}
