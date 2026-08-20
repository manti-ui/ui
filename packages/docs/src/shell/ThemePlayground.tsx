import { useEffect, useState } from 'react';
import { oklchToRgb, parseOklchValue } from '@manti-ui/folds';
import { Button, ColorPicker, SegmentedControl } from '@manti-ui/react';
import { colorPrimitives } from '@manti-ui/tokens';

/**
 * Right-rail playground: pick a color for a variant, or a radius preset, and the
 * whole docs page re-skins live. Each picked base color is expanded into the full
 * `--variant-*` role vocabulary (solid/soft/border/text/ring, theme-aware via
 * `light-dark()` + `color-mix()`) and injected as an UNLAYERED override, which
 * beats the layered `@layer manti.tokens` defaults, the same escape hatch a real
 * consumer uses. Radius needs no injection at all: `data-radius` on the root
 * element is the shipped preset API. Choices persist in localStorage.
 *
 * This is the quick pass over the two colors most themes start from; the Theme
 * Studio card below it is the full instrument (every variant, typography, and a
 * copyable stylesheet).
 */

type VariantKey = 'primary' | 'secondary';

/** Mirrors `radiusModes` in `@manti-ui/tokens`. */
type RadiusMode = 'none' | 'sharp' | 'default' | 'round' | 'pill';

const RADIUS_MODES: { value: RadiusMode; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'sharp', label: 'Sharp' },
  { value: 'default', label: 'Base' },
  { value: 'round', label: 'Round' },
  { value: 'pill', label: 'Pill' },
];

const SWATCHES: { key: VariantKey; label: string }[] = [
  { key: 'primary', label: 'Primary' },
  { key: 'secondary', label: 'Secondary' },
];

const DEFAULTS: Record<VariantKey, string> = {
  primary: colorPrimitives.orange[7],
  secondary: colorPrimitives.gray[7],
};

const STORAGE_KEY = 'manti-docs-palette';
const STYLE_EL_ID = 'manti-playground-theme';

// --- color parsing (browser only) ------------------------------------------
let parseCtx: CanvasRenderingContext2D | null | undefined;
function toRgb(color: string): [number, number, number] {
  // Chromium preserves modern CSS colors in CSSOM (`oklch(...)`) instead of
  // serializing them to rgb(). Never treat the OKLCH channels as RGB bytes;
  // convert the value through the same native color-space model as the picker.
  const oklch = parseOklchValue(color);
  if (oklch) {
    const rgb = oklchToRgb(oklch);
    return [rgb.red, rgb.green, rgb.blue];
  }

  if (parseCtx === undefined) {
    parseCtx = document.createElement('canvas').getContext('2d');
  }
  if (!parseCtx) return [0, 0, 0];
  // For legacy CSS color formats, setting an invalid value is ignored, so seed
  // a known one first; the canvas then normalizes them to `#rrggbb` or
  // `rgba(...)`.
  parseCtx.fillStyle = '#000';
  parseCtx.fillStyle = color;
  const normalized = parseCtx.fillStyle;
  if (normalized.startsWith('#')) {
    const n = parseInt(normalized.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const parts = normalized.match(/[\d.]+/g);
  return parts
    ? [Number(parts[0]), Number(parts[1]), Number(parts[2])]
    : [0, 0, 0];
}

// --- ink selection (mirrors scripts/gen-variant-ink.mjs in @manti-ui/styles) -
// The build picks each shipped variant's `--variant-on-solid` by measurement:
// the same two ink tokens as candidates, WCAG AA (4.5:1) as the floor, APCA Lc
// as the tiebreak above it. A playground color must get the same ink the build
// would generate for it, or the default and the first user tweak disagree.

type Rgb = [number, number, number];

const INK_TOKENS = ['var(--manti-text-on-accent)', 'var(--manti-gray-12)'];
const AA = 4.5;

let inkProbe: HTMLSpanElement | undefined;
function resolveRgb(cssColor: string): Rgb {
  if (!inkProbe) {
    inkProbe = document.createElement('span');
    inkProbe.style.display = 'none';
    document.body.append(inkProbe);
  }
  inkProbe.style.color = cssColor;
  return toRgb(getComputedStyle(inkProbe).color);
}

function luminance([r, g, b]: Rgb): number {
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function wcag(a: Rgb, b: Rgb): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** APCA-W3 Lc magnitude (0.0.98G 4g constants), matching colorjs.io's APCA. */
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
 * Pick `--variant-on-solid` for a custom solid. The build refuses a solid that
 * no ink clears AA on; the playground cannot reject input, so it falls back to
 * the higher WCAG ratio there.
 */
function readableOn(color: string): string {
  const bg = toRgb(color);
  const scored = INK_TOKENS.map((token) => {
    const ink = resolveRgb(token);
    return { token, ratio: wcag(ink, bg), lc: apca(ink, bg) };
  });
  const passing = scored.filter((s) => s.ratio >= AA);
  const pool = passing.length ? passing : scored;
  return pool.reduce((a, b) =>
    (passing.length ? b.lc > a.lc : b.ratio > a.ratio) ? b : a,
  ).token;
}

/** Expand one base color into the full `--variant-*` role vocabulary. */
function ramp(base: string): string {
  const mix = (pct: number, other: string) =>
    `color-mix(in oklch, ${base} ${pct}%, ${other})`;
  const ld = (light: string, dark: string) => `light-dark(${light}, ${dark})`;
  return [
    `--variant-solid:${base}`,
    `--variant-solid-hover:${ld(mix(88, 'white'), mix(88, 'black'))}`,
    `--variant-solid-active:${ld(mix(78, 'white'), mix(78, 'black'))}`,
    `--variant-on-solid:${readableOn(base)}`,
    `--variant-soft-bg:${ld(mix(14, 'white'), mix(22, 'var(--manti-gray-12)'))}`,
    `--variant-soft-bg-hover:${ld(mix(22, 'white'), mix(32, 'var(--manti-gray-12)'))}`,
    `--variant-soft-text:${ld(mix(75, 'black'), mix(42, 'white'))}`,
    `--variant-border:${ld(mix(32, 'white'), mix(42, 'var(--manti-gray-11)'))}`,
    `--variant-text:${ld(mix(78, 'black'), mix(45, 'white'))}`,
    `--variant-ring:${base}`,
  ].join(';');
}

function buildCss(
  colors: Record<VariantKey, string>,
  active: Record<VariantKey, boolean>,
): string {
  return SWATCHES.filter((s) => active[s.key])
    .map((s) => `[data-variant='${s.key}']{${ramp(colors[s.key])}}`)
    .join('\n');
}

/** Update the singleton override <style> in <head> (kept out of the React tree
 * so the theme survives even if this panel unmounts on a TOC-less page). */
function applyCss(css: string): void {
  let el = document.getElementById(STYLE_EL_ID) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement('style');
    el.id = STYLE_EL_ID;
    document.head.appendChild(el);
  }
  el.textContent = css;
}

type State = {
  colors: Record<VariantKey, string>;
  active: Record<VariantKey, boolean>;
  radius: RadiusMode;
};

const INITIAL: State = {
  colors: { ...DEFAULTS },
  active: { primary: false, secondary: false },
  radius: 'default',
};

const isRadiusMode = (value: unknown): value is RadiusMode =>
  RADIUS_MODES.some((m) => m.value === value);

function load(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL;
    const saved = JSON.parse(raw) as Partial<State>;
    return {
      // Payloads persisted by earlier passes may carry variants this panel no
      // longer offers; only the keys in DEFAULTS are ever read back.
      colors: { ...DEFAULTS, ...saved.colors },
      active: { ...INITIAL.active, ...saved.active },
      radius: isRadiusMode(saved.radius) ? saved.radius : INITIAL.radius,
    };
  } catch {
    return INITIAL;
  }
}

export function ThemePlayground() {
  const [state, setState] = useState<State>(INITIAL);

  // Restore once on mount (browser only).
  useEffect(() => {
    setState(load());
  }, []);

  // Apply + persist on every change.
  useEffect(() => {
    applyCss(buildCss(state.colors, state.active));
    // `data-radius` is the shipped preset API: set the attribute and every
    // component inside re-rounds itself; no override stylesheet involved.
    document.documentElement.dataset.radius = state.radius;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable */
    }
  }, [state]);

  const anyActive =
    SWATCHES.some((s) => state.active[s.key]) || state.radius !== 'default';

  const setColor = (key: VariantKey, value: string) =>
    setState((prev) => ({
      ...prev,
      colors: { ...prev.colors, [key]: value },
      active: { ...prev.active, [key]: true },
    }));

  const setRadius = (value: string) =>
    setState((prev) =>
      isRadiusMode(value) ? { ...prev, radius: value } : prev,
    );

  const reset = () => setState(INITIAL);

  return (
    <section className="docs-theme-playground" aria-label="Palette playground">
      <div className="docs-theme-playground-header">
        <p className="docs-toc-label">Make it yours</p>
        <Button
          variant="tertiary"
          size="sm"
          iconOnly
          aria-label="Reset palette and radius"
          title="Reset palette and radius"
          onClick={reset}
          disabled={!anyActive}
        >
          <ResetIcon />
        </Button>
      </div>
      <p className="docs-theme-group-label">Basic</p>
      <ul className="docs-theme-swatches">
        {SWATCHES.map((s) => (
          <li key={s.key} className="docs-theme-swatch">
            <ColorPicker
              label={s.label}
              value={state.colors[s.key]}
              colorSpace="oklch"
              format="oklch"
              formats={['oklch']}
              showValueText={false}
              onValueChange={(value) => setColor(s.key, value)}
            />
          </li>
        ))}
      </ul>

      <div className="docs-theme-radius">
        {/* A row of the Basic group, so it is labelled like the color rows
            above it rather than as a group of its own. */}
        <p className="docs-theme-radius-label">Radius</p>
        {/* The picker is itself a control-class component, so it re-rounds along
            with the page it is retuning. */}
        <SegmentedControl
          // Keep the picker compact and leave enough headroom for `round` to
          // remain visibly different from the fully rounded `pill` profile.
          size="sm"
          value={state.radius}
          items={RADIUS_MODES}
          onValueChange={setRadius}
        />
      </div>
    </section>
  );
}

function ResetIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}
