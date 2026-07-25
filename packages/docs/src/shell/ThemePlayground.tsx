import { useEffect, useState } from 'react';
import { Button, ColorPicker, SegmentedControl } from '@manti-ui/react';

/**
 * Right-rail playground: pick a color for a variant, or a radius preset, and the
 * whole docs page re-skins live. Each picked base color is expanded into the full
 * `--variant-*` role vocabulary (solid/soft/border/text/ring, theme-aware via
 * `light-dark()` + `color-mix()`) and injected as an UNLAYERED override, which
 * beats the layered `@layer manti.tokens` defaults — the same escape hatch a
 * real consumer uses. Radius needs no injection at all: `data-radius` on the
 * root element is the shipped preset API. Choices persist in localStorage.
 */

type VariantKey = 'primary' | 'secondary' | 'tertiary' | 'success' | 'danger';

/** Mirrors `radiusModes` in `@manti-ui/tokens`. */
type RadiusMode = 'none' | 'sharp' | 'default' | 'round' | 'pill';

const RADIUS_MODES: { value: RadiusMode; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'sharp', label: 'Sharp' },
  { value: 'default', label: 'Base' },
  { value: 'round', label: 'Round' },
  { value: 'pill', label: 'Pill' },
];

const SWATCHES: { key: VariantKey; label: string; fallback: string }[] = [
  { key: 'primary', label: 'Primary', fallback: '#e2681c' },
  { key: 'secondary', label: 'Secondary', fallback: '#6b7280' },
  { key: 'tertiary', label: 'Tertiary', fallback: '#9ca3af' },
  { key: 'success', label: 'Success', fallback: '#16a34a' },
  { key: 'danger', label: 'Danger', fallback: '#dc2626' },
];

const DEFAULTS: Record<VariantKey, string> = {
  primary: '#e2681c',
  secondary: '#6b7280',
  tertiary: '#9ca3af',
  success: '#16a34a',
  danger: '#dc2626',
};

const STORAGE_KEY = 'manti-docs-palette';
const STYLE_EL_ID = 'manti-playground-theme';

// --- color parsing (browser only) ------------------------------------------
let parseCtx: CanvasRenderingContext2D | null | undefined;
function toRgb(color: string): [number, number, number] {
  if (parseCtx === undefined) {
    parseCtx = document.createElement('canvas').getContext('2d');
  }
  if (!parseCtx) return [0, 0, 0];
  // Setting an invalid value is ignored, so seed a known one first; the canvas
  // then normalizes any valid CSS color to `#rrggbb` or `rgba(...)`.
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

/** Pick a legible on-solid text color (near-white or near-black) by luminance. */
function readableOn(color: string): string {
  const [r, g, b] = toRgb(color);
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const L = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  return L > 0.5 ? '#16161a' : '#ffffff';
}

/** Expand one base color into the full `--variant-*` role vocabulary. */
function ramp(base: string): string {
  const mix = (pct: number, other: string) =>
    `color-mix(in oklab, ${base} ${pct}%, ${other})`;
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
  active: {
    primary: false,
    secondary: false,
    tertiary: false,
    success: false,
    danger: false,
  },
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
      colors: { ...DEFAULTS, ...saved.colors },
      active: { ...INITIAL.active, ...saved.active },
      // Older persisted payloads predate the radius picker.
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
    // `data-radius` is the shipped preset API — set the attribute and every
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
        <p className="docs-toc-label">Try your palette</p>
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
      <p className="docs-theme-playground-hint">
        Map your own colors onto Manti’s variants and preview the whole page
        live.
      </p>
      <ul className="docs-theme-swatches">
        {SWATCHES.map((s) => (
          <li key={s.key} className="docs-theme-swatch">
            <ColorPicker
              label={s.label}
              value={state.colors[s.key] ?? s.fallback}
              showValueText={false}
              onValueChange={(value) => setColor(s.key, value)}
            />
          </li>
        ))}
      </ul>

      <div className="docs-theme-radius">
        <p className="docs-toc-label">Radius</p>
        <p className="docs-theme-playground-hint">
          One factor rescales the ramp; roundness is an opt-in channel. Try{' '}
          <strong>Pill</strong> — controls turn into lozenges while checkboxes
          keep their square silhouette.
        </p>
        {/* The picker is itself a control-class component, so it re-rounds along
            with the page it is retuning. */}
        <SegmentedControl
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
