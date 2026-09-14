import { useMemo, useState, type ReactNode } from 'react';
import {
  Button,
  ColorPicker,
  Combobox,
  Heading,
  SegmentedControl,
  Slider,
  Text,
  Tooltip,
} from '@manti-ui/react';

import { toHex } from './theme/color';
import {
  ACCENT_COLORS,
  DENSITIES,
  FOCUS_WIDTHS,
  FONT_STACKS,
  NEUTRAL_HUES,
  PRESETS,
  RADIUS_STEPS,
  TEXT_SIZES,
  VARIANTS,
  applyPreset,
  configForPreset,
  googleFamily,
  googleFontKey,
  type ThemeConfig,
  type VariantKey,
} from './theme/config';
import { buildThemeCss } from './theme/css';
import { useGoogleFonts } from './theme/googleFonts';
import { useOklavaTheme } from './theme/store';

/**
 * The control rail: every knob writes a token override through the
 * `useOklavaTheme` store, and the host app re-skins live.
 *
 * The rail is built from *named stops*, not free ranges. A theme is a set of
 * decisions the system already has opinions about, so picking "Large" corners
 * or a "Sage" neutral is both quicker and far more predictable than hunting for
 * a position on a 0-to-360 slider. The stops live beside the config they write,
 * so the presets and "Surprise me" land on them too.
 *
 * The controls are themselves Manti components, so the rail is also a preview:
 * pick round corners and the rail rounds with everything else.
 */

export type ColorScheme = 'light' | 'dark';

export interface ThemePanelProps {
  /** Light/dark value. Omit to let Oklava read `data-theme` on `<html>`. */
  colorScheme?: ColorScheme;
  /** Called when the Appearance control changes. */
  onColorSchemeChange?: (scheme: ColorScheme) => void;
  /** Offer the Google Fonts catalogue. */
  googleFonts?: boolean;
  /** Rendered under the rail, where the shell puts its own actions. */
  footer?: ReactNode;
}

interface FieldProps {
  label: ReactNode;
  value?: ReactNode;
  hint?: ReactNode;
  children: ReactNode;
}

function Field({ label, value, hint, children }: FieldProps) {
  return (
    <div className="oklava-field">
      <div className="oklava-field-head">
        <Text as="span" size="sm/medium" className="oklava-field-label">
          {label}
        </Text>
        {value !== undefined && (
          <Text
            as="span"
            size="xs"
            emphasis="subtle"
            className="oklava-field-value"
          >
            {value}
          </Text>
        )}
      </div>
      {children}
      {hint && (
        <Text size="xs" emphasis="subtle" className="oklava-hint">
          {hint}
        </Text>
      )}
    </div>
  );
}

/** One numeric knob as a row of named stops. */
function Choice({
  label,
  value,
  options,
  onChange,
  hint,
}: {
  label: string;
  value: number;
  options: { label: string; value: number }[];
  onChange: (value: number) => void;
  hint?: ReactNode;
}) {
  return (
    <Field label={label} hint={hint}>
      <SegmentedControl
        size="sm"
        variant="primary"
        value={String(value)}
        items={options.map((option) => ({
          value: String(option.value),
          label: option.label,
        }))}
        onValueChange={(next) => onChange(Number(next))}
      />
    </Field>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="oklava-group">
      <div className="oklava-group-head">
        <Heading level={2} size="sm/semibold">
          {title}
        </Heading>
        {description && (
          <Text size="xs" emphasis="subtle">
            {description}
          </Text>
        )}
      </div>
      {children}
    </section>
  );
}

/**
 * The rail speaks one color space. The picker ships tabs for hex, rgba, hsla and
 * hsba as well; every knob here writes an oklch token, so the extra tabs only
 * offer a format the export will not use, and five of them overflow a 20rem
 * rail. Pinning `format` too keeps the value text and the change callback in
 * the same space as the tab.
 */
const OKLCH_ONLY = ['oklch'] as const;

const ClearIcon = (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

/** A preset chip previews its palette with three dots of the target color. */
function presetDots(config: ThemeConfig) {
  const primary = config.colors.primary;
  return (
    <span className="oklava-preset-dots" aria-hidden="true">
      <i style={{ background: primary ?? 'var(--manti-orange-7)' }} />
      <i style={{ background: `oklch(0.62 0.012 ${config.neutralHue})` }} />
      <i
        style={{
          background: `oklch(0.34 0.01 ${config.neutralHue})`,
          borderRadius: `calc(var(--manti-radius-xs) * ${config.radiusFactor || 0.01})`,
        }}
      />
    </span>
  );
}

export function ThemePanel({
  colorScheme,
  onColorSchemeChange,
  googleFonts = true,
  footer,
}: ThemePanelProps) {
  const { config, set, patch, setColor } = useOklavaTheme();
  const baseConfig = configForPreset(config.preset);
  // A chip reads as selected while the palette on the page is still the one it
  // installs. The other knobs are not part of that comparison: a preset never
  // touches them, so tuning the radius must not un-select the palette.
  const activePreset = PRESETS.find(
    (preset) =>
      preset.id === config.preset &&
      buildThemeCss(applyPreset(preset, config)) === buildThemeCss(config),
  );
  // Which variant the color grid writes to. A panel-local choice, not part of
  // the theme: it never reaches the exported CSS.
  const [editing, setEditing] = useState<VariantKey>('primary');
  const editingMeta =
    VARIANTS.find((item) => item.key === editing) ?? VARIANTS[0];
  // Built-in stacks first, then the catalogue. The list is rebuilt only when the
  // catalogue chunk lands.
  const all = useGoogleFonts(googleFonts);
  const fontItems = useMemo(() => {
    // Interim cap. Combobox renders every match, so handing it the whole
    // catalogue freezes the page on open; `maxVisibleItems` lands with
    // manti-ui/ui#110, and this slice comes out with it. The catalogue is
    // sorted by popularity, so the head is the useful part meanwhile.
    const catalogue = all.slice(0, 200);
    const items = [
      ...FONT_STACKS.map((font) => ({ value: font.value, label: font.label })),
      ...catalogue.map((font) => ({
        value: googleFontKey(font.name),
        label: font.name,
      })),
    ];
    // A stored family has to be in the list before the catalogue chunk lands,
    // or the field reads as empty on a cold load.
    const family = googleFamily(config.font);
    if (family && !items.some((item) => item.value === config.font)) {
      items.splice(FONT_STACKS.length, 0, {
        value: config.font,
        label: family,
      });
    }
    return items;
  }, [all, config.font]);
  // What the app is actually running for a variant: an override, else the
  // preset's own color, else the shipped default. Without the last fallback the
  // default theme shows a grid with nothing selected.
  const colorOf = (key: VariantKey) =>
    config.colors[key] ??
    baseConfig.colors[key] ??
    (VARIANTS.find((item) => item.key === key)?.fallback as string);

  return (
    <div className="oklava-controls">
      <Section
        title="Presets"
        description="A palette: colors and the neutral hue. Shape, type and density stay where you left them."
      >
        <div className="oklava-presets">
          {PRESETS.map((preset) => {
            const previewConfig = applyPreset(preset, config);
            return (
              <button
                key={preset.id}
                type="button"
                className="oklava-preset"
                aria-pressed={activePreset?.id === preset.id}
                onClick={() => set(previewConfig)}
              >
                {presetDots(previewConfig)}
                <span>{preset.label}</span>
              </button>
            );
          })}
        </div>
      </Section>

      <Section
        title="Colors"
        description="Each base color is expanded into the full --variant-* vocabulary."
      >
        {/* One grid, one variant at a time: the chips retarget the grid rather
            than putting the same decision behind a second set of pickers. */}
        <div
          className="oklava-variants"
          role="radiogroup"
          aria-label="Variant to edit"
        >
          {VARIANTS.map((variant) => (
            <button
              key={variant.key}
              type="button"
              role="radio"
              className="oklava-variant"
              aria-checked={variant.key === editing}
              onClick={() => setEditing(variant.key)}
            >
              <i style={{ background: colorOf(variant.key) }} aria-hidden />
              <span>{variant.label}</span>
            </button>
          ))}
        </div>

        <div
          className="oklava-dots"
          role="radiogroup"
          aria-label={`${editingMeta.label} color`}
        >
          {ACCENT_COLORS.map((option) => (
            <Tooltip
              key={option.value}
              content={`${option.label} · ${option.value}`}
              placement="top"
            >
              <button
                type="button"
                role="radio"
                className="oklava-dot"
                aria-checked={toHex(colorOf(editing)) === option.value}
                aria-label={option.label}
                style={{ background: option.value }}
                onClick={() => setColor(editing, option.value)}
              />
            </Tooltip>
          ))}
        </div>
        <div className="oklava-dots-footer">
          <ColorPicker
            label={`Custom ${editingMeta.label.toLowerCase()}`}
            value={colorOf(editing)}
            colorSpace="oklch"
            format="oklch"
            formats={OKLCH_ONLY}
            showValueText={false}
            onValueChange={(value) => setColor(editing, value)}
          />
          <Text
            as="span"
            size="xs"
            emphasis="subtle"
            className="oklava-swatch-value"
          >
            {config.colors[editing] ? toHex(config.colors[editing]) : 'default'}
          </Text>
          <Button
            variant="tertiary"
            size="sm"
            iconOnly
            aria-label={`Reset the ${editingMeta.label} color`}
            title={`Reset the ${editingMeta.label} color`}
            disabled={!config.colors[editing]}
            onClick={() => setColor(editing, null)}
          >
            {ClearIcon}
          </Button>
        </div>
        <Text size="xs" emphasis="subtle" className="oklava-hint">
          {editingMeta.hint}.
        </Text>
      </Section>

      <Section
        title="Neutral"
        description="One hue drives every gray, surface, border and text role."
      >
        <div className="oklava-dots" role="radiogroup" aria-label="Neutral hue">
          {NEUTRAL_HUES.map((option) => (
            <Tooltip
              key={option.value}
              content={`${option.label} · ${option.value}°`}
              placement="top"
            >
              <button
                type="button"
                role="radio"
                className="oklava-dot"
                aria-checked={config.neutralHue === option.value}
                aria-label={`${option.label}, ${option.value} degrees`}
                style={{ background: `oklch(0.62 0.013 ${option.value})` }}
                onClick={() => patch({ neutralHue: option.value })}
              />
            </Tooltip>
          ))}
        </div>
        {/* The dots pick a named neutral; this trims the same value by the
            degree, for a tint that sits between two of them. Both write
            `--manti-cool-hue`, so a dot lights up again whenever the slider
            lands back on one. */}
        <Field label="Hue" value={`${Math.round(config.neutralHue)}°`}>
          <Slider
            label="Neutral hue"
            variant="primary"
            value={config.neutralHue}
            min={0}
            max={360}
            step={1}
            onValueChange={([next]) => patch({ neutralHue: next })}
          />
        </Field>
        {colorScheme && (
          <Field label="Appearance">
            <SegmentedControl
              size="sm"
              value={colorScheme}
              items={[
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
              ]}
              onValueChange={(value) =>
                onColorSchemeChange?.(value === 'light' ? 'light' : 'dark')
              }
            />
          </Field>
        )}
      </Section>

      <Section title="Radius" description="Roundness across the whole system.">
        <div className="oklava-tiles" role="radiogroup" aria-label="Radius">
          {RADIUS_STEPS.map((step) => (
            <button
              key={step.value}
              type="button"
              role="radio"
              className="oklava-tile"
              aria-checked={config.radiusFactor === step.value}
              onClick={() => patch({ radiusFactor: step.value })}
            >
              {/* The art is a corner sample, not a themed part: its radius has
                  to track the stop it offers rather than the factor the page is
                  currently running. */}
              <span
                className="oklava-tile-art"
                style={{
                  borderTopLeftRadius: `calc(var(--manti-space-3) * ${step.value})`,
                }}
                aria-hidden="true"
              />
              <span className="oklava-tile-label">{step.label}</span>
            </button>
          ))}
        </div>
      </Section>

      <Section
        title="Typography"
        description="Every other size derives from the base."
      >
        <Field label="Sans font">
          {/* A combobox, not a select: the catalogue is ~1900 families, so the
              only workable way in is typing a few letters. The built-in stacks
              stay at the top, they are the ones that need no network. */}
          <Combobox
            size="md"
            items={fontItems}
            placeholder={googleFonts ? 'Search Google Fonts' : 'Search fonts'}
            value={[config.font]}
            onValueChange={([font]) => patch({ font: font ?? 'inter' })}
          />
        </Field>
        <Choice
          label="Base text size"
          value={config.textBase}
          options={TEXT_SIZES}
          onChange={(textBase) => patch({ textBase })}
          hint="In px at the browser's default root size."
        />
      </Section>

      <Section title="Density" description="Spacing and control heights.">
        <Choice
          label="Scaling"
          value={config.density}
          options={DENSITIES}
          onChange={(density) => patch({ density })}
        />
        <Choice
          label="Focus ring"
          value={config.focusWidth}
          options={FOCUS_WIDTHS}
          onChange={(focusWidth) => patch({ focusWidth })}
          hint="Width in px. Tab through the app to see it."
        />
      </Section>

      {footer}
    </div>
  );
}
