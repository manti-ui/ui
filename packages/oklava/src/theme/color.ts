/**
 * Color helpers for the theme engine.
 *
 * `toRgb` parses with a canvas 2d context, which is what lets the panel accept
 * the `oklch()` strings the ColorPicker emits without shipping a color parser.
 * The context is created lazily, so importing this module on a server is inert.
 */

let parseCtx: CanvasRenderingContext2D | null | undefined;

function toRgb(color: string): [number, number, number] {
  const hex = /^#([0-9a-f]{6})$/i.exec(color.trim());
  if (hex) {
    const n = parseInt(hex[1], 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  if (typeof document === 'undefined') return [0, 0, 0];
  if (parseCtx === undefined) {
    parseCtx = document.createElement('canvas').getContext('2d');
  }
  if (!parseCtx) return [0, 0, 0];
  // Setting an invalid value is ignored, so seed a known one first; the canvas
  // then normalizes any valid CSS color to `#rrggbb` or `rgba(...)`.
  parseCtx.fillStyle = '#000';
  parseCtx.fillStyle = color;
  const normalized = parseCtx.fillStyle;
  if (normalized.startsWith('#')) return toRgb(normalized);
  const parts = normalized.match(/[\d.]+/g);
  return parts
    ? [Number(parts[0]), Number(parts[1]), Number(parts[2])]
    : [0, 0, 0];
}

/**
 * The two inks a solid may carry, with their measured sRGB relative luminance.
 * Same pair `scripts/gen-variant-ink.mjs` chooses between for the shipped
 * variants, so a studio theme picks its label ink by the same rule the library
 * does, never a bespoke literal.
 */
const INKS = [
  { css: 'var(--manti-text-on-accent)', luminance: 0.97 }, // oklch(0.99 …)
  { css: 'var(--manti-gray-12)', luminance: 0.0075 }, // oklch(0.196 …)
];

function relativeLuminance(color: string): number {
  const [r, g, b] = toRgb(color);
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrastRatio(a: number, b: number): number {
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Pick the legible label ink for a solid fill, by WCAG contrast rather than a
 * luminance midpoint. The naive `L > 0.5 ? dark : light` split is wrong for a
 * whole band of mid colors: a vivid sky blue sits at L≈0.33 yet reaches 7.6:1
 * against dark ink and only 2.8:1 against white.
 */
export function readableOn(color: string): string {
  const L = relativeLuminance(color);
  const best = INKS.reduce((a, b) =>
    contrastRatio(L, b.luminance) > contrastRatio(L, a.luminance) ? b : a,
  );
  return best.css;
}

/** Normalize whatever the color picker emits down to `#rrggbb`. */
export function toHex(color: string): string {
  const [r, g, b] = toRgb(color);
  const hex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${hex(r)}${hex(g)}${hex(b)}`;
}

/** `h` in degrees, `s`/`l` in percent. */
export function hslToHex(h: number, s: number, l: number): string {
  const lightness = l / 100;
  const a = (s / 100) * Math.min(lightness, 1 - lightness);
  const channel = (n: number) => {
    const k = (n + h / 30) % 12;
    const value = lightness - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(255 * value)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${channel(0)}${channel(8)}${channel(4)}`;
}
