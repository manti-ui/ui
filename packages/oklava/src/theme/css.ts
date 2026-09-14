import { readableOn, toHex } from './color';
import {
  BASE_CONTROL_HEIGHT_REM,
  BASE_SPACE_REM,
  DEFAULT_THEME,
  VARIANTS,
  configForPreset,
  fontStack,
  googleFamily,
  googleFontHref,
  type ThemeConfig,
  type VariantKey,
} from './config';

/**
 * The CSS the panel writes, and the copyable stylesheet it hands back.
 *
 * `buildThemeCss` diffs the config against the preset it is based on and emits
 * only what differs, so an untouched preset produces an empty string. The result
 * is injected UNLAYERED, which is how it beats `@layer manti.tokens` with no
 * `!important` anywhere. That is also the escape hatch a real consumer uses, so
 * the CSS shown in the export dialog is byte-for-byte the CSS the page is
 * running.
 */

/** Trim float noise: 0.30000000000000004 -> 0.3. */
export function num(value: number): string {
  return String(Math.round(value * 1000) / 1000);
}

/** Expand one base color into the full `--variant-*` role vocabulary. */
function variantBlock(key: VariantKey, base: string): string {
  const mix = (pct: number, other: string) =>
    `color-mix(in oklab, ${base} ${pct}%, ${other})`;
  const ld = (light: string, dark: string) => `light-dark(${light}, ${dark})`;
  const decls: [string, string][] = [
    ['--variant-solid', base],
    ['--variant-solid-hover', ld(mix(88, 'white'), mix(88, 'black'))],
    ['--variant-solid-active', ld(mix(78, 'white'), mix(78, 'black'))],
    ['--variant-on-solid', readableOn(base)],
    [
      '--variant-soft-bg',
      ld(mix(14, 'white'), mix(22, 'var(--manti-gray-12)')),
    ],
    [
      '--variant-soft-bg-hover',
      ld(mix(22, 'white'), mix(32, 'var(--manti-gray-12)')),
    ],
    ['--variant-soft-text', ld(mix(75, 'black'), mix(42, 'white'))],
    ['--variant-border', ld(mix(32, 'white'), mix(42, 'var(--manti-gray-11)'))],
    ['--variant-text', ld(mix(78, 'black'), mix(45, 'white'))],
    ['--variant-ring', base],
  ];
  const body = decls.map(([prop, value]) => `  ${prop}: ${value};`).join('\n');
  return `[data-variant='${key}'] {\n${body}\n}`;
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

  if (config.neutralHue !== d.neutralHue) {
    root.push(
      '  /* The single neutral hue: retints every gray, surface and border. */',
      `  --manti-cool-hue: ${num(config.neutralHue)};`,
    );
  }
  // A handful of roles are branded but NOT variant-driven, so `[data-variant]`
  // never reaches them: Progress spends its `data-variant` slot on
  // linear/circular and pins `--manti-accent-fill` instead, and `::selection`
  // reads its own pair. Retint them from the primary color, or a themed app
  // keeps a stray orange progress bar and text selection.
  const primary = config.colors.primary;
  if (primary && primary !== d.colors.primary) {
    const accent = toHex(primary);
    root.push(
      '  /* Branded roles that no [data-variant] block can reach: the Progress',
      '     fill (its data-variant carries linear/circular) and ::selection. */',
      `  --manti-accent-fill: ${accent};`,
      `  --manti-selection-bg: ${accent};`,
      `  --manti-selection-text: ${readableOn(accent)};`,
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
    const color = config.colors[variant.key];
    if (color && color !== d.colors[variant.key]) {
      blocks.push(variantBlock(variant.key, toHex(color)));
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
