import { colorInks } from '@manti-ui/tokens';

/**
 * Label-ink selection for a Radix solid step.
 *
 * Every color Oklava writes is a Radix step from `@manti-ui/tokens`, always a
 * `#rrggbb` literal, so the measurement here is plain arithmetic over hex: no
 * canvas, no DOM, and the same answer on a server render as in the browser.
 *
 * The rule is the one `packages/styles/scripts/lib/variant-ink.mjs` applies to
 * the shipped variants and presets: clear WCAG 2.1 AA (4.5:1) first, then keep
 * the candidate with the higher APCA Lc. So a theme built here gets the ink the
 * build would have generated for the same scale.
 */

type Rgb = [number, number, number];

/** `#rrggbb` (an alpha pair, if any, is ignored) to 0-255 channels. */
function hexToRgb(hex: string): Rgb {
  const n = parseInt(hex.trim().replace(/^#/, '').slice(0, 6), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** WCAG 2.1 relative luminance. */
function luminance([r, g, b]: Rgb): number {
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function wcag(a: Rgb, b: Rgb): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** APCA-W3 Lc magnitude (0.0.98G 4g constants), as colorjs.io computes it. */
function apca(text: Rgb, bg: Rgb): number {
  const y = ([r, g, b]: Rgb) => {
    let Y =
      0.2126729 * Math.pow(r / 255, 2.4) +
      0.7151522 * Math.pow(g / 255, 2.4) +
      0.072175 * Math.pow(b / 255, 2.4);
    if (Y < 0.022) Y += Math.pow(0.022 - Y, 1.414);
    return Y;
  };
  const Ytxt = y(text);
  const Ybg = y(bg);
  const sapc =
    Ybg > Ytxt
      ? (Math.pow(Ybg, 0.56) - Math.pow(Ytxt, 0.57)) * 1.14
      : (Math.pow(Ybg, 0.65) - Math.pow(Ytxt, 0.62)) * 1.14;
  if (Math.abs(sapc) < 0.1) return 0;
  return (Math.abs(sapc) - 0.027) * 100;
}

/**
 * The two inks a solid may carry: the tokens `variant-ink.mjs` chooses
 * between, each holding one Radix step in both schemes (`--manti-ink-*`).
 */
const INKS = [
  { css: 'var(--manti-text-on-accent)', rgb: hexToRgb(colorInks.light) },
  { css: 'var(--manti-text-on-bright)', rgb: hexToRgb(colorInks.dark) },
];

const AA = 4.5;

/**
 * The legible ink for one solid color. The build refuses a solid that no ink
 * clears AA on; a theme tool cannot refuse a pick, so it falls back to the
 * higher WCAG ratio there.
 */
function inkOn(solid: string): string {
  const bg = hexToRgb(solid);
  const scored = INKS.map((ink) => ({
    css: ink.css,
    ratio: wcag(ink.rgb, bg),
    lc: apca(ink.rgb, bg),
  }));
  const passing = scored.filter((s) => s.ratio >= AA);
  if (passing.length > 0) {
    return passing.reduce((a, b) => (b.lc > a.lc ? b : a)).css;
  }
  return scored.reduce((a, b) => (b.ratio > a.ratio ? b : a)).css;
}

/**
 * `--variant-on-solid` for a solid that is `light` in the light scheme and
 * `dark` in the dark one: a single ink when both schemes agree, otherwise a
 * `light-dark()` pair of the two.
 */
export function inkFor(light: string, dark: string): string {
  const onLight = inkOn(light);
  const onDark = inkOn(dark);
  return onLight === onDark ? onLight : `light-dark(${onLight}, ${onDark})`;
}
