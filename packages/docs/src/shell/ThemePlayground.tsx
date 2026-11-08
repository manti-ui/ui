import { useEffect, useState } from 'react';
import {
  COLOR_SCALES,
  DEFAULT_THEME,
  NEUTRAL_SCALES,
  buildThemeCss,
  scaleLabel,
  scaleOf,
  type NeutralName,
  type ScaleName,
} from '@manti-ui/oklava';
import { Button, SegmentedControl, Select, Text } from '@manti-ui/react';

/**
 * Right-rail playground: pick a Radix scale for the primary variant, a Radix
 * gray for the neutral, or a radius preset, and the whole docs page re-skins
 * live. Scale names are the only color choice: the CSS is the same expansion
 * the Oklava panel writes (`buildThemeCss` from `@manti-ui/oklava`), so every
 * color it injects is a `light-dark()` pair of Radix steps, and `violet` on
 * `mauve` here is the shipped Violet preset. It is injected UNLAYERED, which
 * beats the layered `@layer manti.tokens` defaults, the same escape hatch a
 * real consumer uses. Radius needs no injection at all: `data-radius` on the
 * root element is the shipped preset API. Choices persist in localStorage.
 *
 * This is the quick pass over the two choices most themes start from; the
 * Theme Studio card below it is the full instrument (every variant,
 * typography, and a copyable stylesheet).
 */

/** Mirrors `radiusModes` in `@manti-ui/tokens`. */
type RadiusMode = 'none' | 'sharp' | 'default' | 'round' | 'pill';

const RADIUS_MODES: { value: RadiusMode; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'sharp', label: 'Sharp' },
  { value: 'default', label: 'Base' },
  { value: 'round', label: 'Round' },
  { value: 'pill', label: 'Pill' },
];

const PRIMARY_ITEMS = COLOR_SCALES.map((name) => ({
  value: name,
  label: scaleLabel(name),
}));

const NEUTRAL_ITEMS = NEUTRAL_SCALES.map((name) => ({
  value: name,
  label: scaleLabel(name),
}));

/** What the shipped theme runs, i.e. each picker's starting selection. */
const SHIPPED_PRIMARY = scaleOf(DEFAULT_THEME, 'primary');
const SHIPPED_NEUTRAL = DEFAULT_THEME.neutral;

const STORAGE_KEY = 'manti-docs-palette';
const STYLE_EL_ID = 'manti-playground-theme';

type State = {
  /** `null` keeps the shipped scale. */
  primary: ScaleName | null;
  neutral: NeutralName | null;
  radius: RadiusMode;
};

const INITIAL: State = { primary: null, neutral: null, radius: 'default' };

const isRadiusMode = (value: unknown): value is RadiusMode =>
  RADIUS_MODES.some((m) => m.value === value);

const isScale = (value: unknown): value is ScaleName =>
  (COLOR_SCALES as readonly unknown[]).includes(value);

const isNeutral = (value: unknown): value is NeutralName =>
  (NEUTRAL_SCALES as readonly unknown[]).includes(value);

/** The theme as CSS: only what differs from the shipped one. */
function buildCss(state: State): string {
  return buildThemeCss(
    {
      ...DEFAULT_THEME,
      colors: state.primary ? { primary: state.primary } : {},
      neutral: state.neutral ?? SHIPPED_NEUTRAL,
    },
    DEFAULT_THEME,
  );
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

function load(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL;
    const saved = JSON.parse(raw) as Partial<Record<keyof State, unknown>>;
    // A payload from before the playground picked Radix scales carries hex
    // colors instead; those have no scale to map onto, so they are dropped.
    return {
      primary: isScale(saved.primary) ? saved.primary : null,
      neutral: isNeutral(saved.neutral) ? saved.neutral : null,
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
    applyCss(buildCss(state));
    // `data-radius` is the shipped preset API: set the attribute and every
    // component inside re-rounds itself; no override stylesheet involved.
    //
    // Only once a visitor has picked a mode, though. Each mode re-declares
    // every ramp step against its own factor, deliberately so an inherited root
    // value cannot bypass a subtree preset, so stamping `default` on every load
    // would pin the radius and leave the Oklava panel's radius control with
    // nothing to do.
    if (state.radius === 'default') {
      delete document.documentElement.dataset.radius;
    } else {
      document.documentElement.dataset.radius = state.radius;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable */
    }
  }, [state]);

  const anyActive =
    state.primary !== null ||
    state.neutral !== null ||
    state.radius !== 'default';

  const setPrimary = ([value]: string[]) =>
    setState((prev) => ({
      ...prev,
      primary: isScale(value) && value !== SHIPPED_PRIMARY ? value : null,
    }));

  const setNeutral = ([value]: string[]) =>
    setState((prev) => ({
      ...prev,
      neutral: isNeutral(value) && value !== SHIPPED_NEUTRAL ? value : null,
    }));

  const setRadius = (value: string) =>
    setState((prev) =>
      isRadiusMode(value) ? { ...prev, radius: value } : prev,
    );

  const reset = () => setState(INITIAL);

  return (
    <section className="docs-theme-playground" aria-label="Palette playground">
      <div className="docs-theme-playground-header">
        <Text className="docs-toc-label">Make it yours</Text>
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
      <Text className="docs-theme-group-label">Basic</Text>
      <div className="docs-theme-scales">
        {/* Radix scale names are the only choice: a free color would bring
            back the hand-tuned contrast the Radix catalog exists to remove. */}
        <Select
          label="Primary"
          size="sm"
          items={PRIMARY_ITEMS}
          value={[state.primary ?? SHIPPED_PRIMARY]}
          onValueChange={setPrimary}
        />
        <Select
          label="Neutral"
          size="sm"
          items={NEUTRAL_ITEMS}
          value={[state.neutral ?? SHIPPED_NEUTRAL]}
          onValueChange={setNeutral}
        />
      </div>

      <div className="docs-theme-radius">
        {/* A row of the Basic group, so it is labelled like the scale rows
            above it rather than as a group of its own. */}
        <Text className="docs-theme-radius-label">Radius</Text>
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
