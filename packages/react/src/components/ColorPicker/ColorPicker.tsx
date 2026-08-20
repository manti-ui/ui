import { useId, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { colorPicker } from '@manti-ui/folds';
import type { ColorSpaceId } from '@manti-ui/folds';
import { normalizeProps, useMachine } from '@zag-js/react';

import { Portal } from '../../internal/Portal';
import { useFocusVisible } from '../../internal/focusVisible';
import { cx } from '../../internal/props';
import type { Placement } from '../../internal/floating';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { Tabs } from '../Tabs/Tabs';

import {
  COLOR_PICKER_FORMATS,
  formatHexColor,
  formatOklchColor,
  parseOklchColor,
  type ColorPickerFormat,
  type RgbColor,
} from './color-utils';
import { NativeColorPicker } from './NativeColorPicker';

export type { ColorPickerFormat } from './color-utils';
export type { ColorSpaceId } from '@manti-ui/folds';

export interface ColorPickerProps {
  /** Optional field label. */
  label?: ReactNode;
  /** Trigger size, shared with every other sized control. */
  size?: 'sm' | 'md' | 'lg';
  /** Controlled value as a CSS color string. */
  value?: string;
  /** Initial value for uncontrolled usage. */
  defaultValue?: string;
  /**
   * Format used for the trigger, editable field, and value-change callback.
   * Defaults to `rgba`.
   */
  format?: ColorPickerFormat;
  /** Initial output format when `format` is uncontrolled. */
  defaultFormat?: ColorPickerFormat;
  /** Color space used by the interactive palette. */
  colorSpace?: ColorSpaceId;
  /** Formats shown in the copy tabs. The selected format is shown by default. */
  formats?: readonly ColorPickerFormat[];
  /** Called whenever the selected format changes. */
  onFormatChange?: (format: ColorPickerFormat) => void;
  /** Called whenever the value changes; emits the selected format. */
  onValueChange?: (value: string) => void;
  /**
   * Show the formatted value text (e.g. `rgba(124, 58, 237, 1)`) next to the
   * swatch in the trigger. Set to `false` to show only the color swatch.
   * Defaults to `true`.
   */
  showValueText?: boolean;
  /** Placement of the panel relative to the control. */
  placement?: Placement;
  disabled?: boolean;
  /** Form field name. */
  name?: string;
  id?: string;
  className?: string;
}

const DEFAULT_FORMAT: ColorPickerFormat = 'rgba';
const DEFAULT_COPY_FORMATS: readonly ColorPickerFormat[] = [
  'hex',
  'rgba',
  'hsla',
];

type MachineColorFormat = 'rgba' | 'hsla' | 'hsba';

const toMachineFormat = (format: ColorPickerFormat): MachineColorFormat =>
  format === 'hsla' || format === 'hsba' ? format : 'rgba';

type ZagColor = ReturnType<typeof colorPicker.parse>;

const toRgbColor = (color: ZagColor): RgbColor => {
  const rgba = color.toFormat('rgba');
  return {
    red: rgba.getChannelValue('red'),
    green: rgba.getChannelValue('green'),
    blue: rgba.getChannelValue('blue'),
    alpha: rgba.getChannelValue('alpha'),
  };
};

const toZagColor = (color: RgbColor): ZagColor => {
  let result = colorPicker.parse('rgba(0, 0, 0, 1)');
  result = result.withChannelValue('red', color.red) as ZagColor;
  result = result.withChannelValue('green', color.green) as ZagColor;
  result = result.withChannelValue('blue', color.blue) as ZagColor;
  return result.withChannelValue('alpha', color.alpha) as ZagColor;
};

const formatColor = (color: ZagColor, format: ColorPickerFormat) => {
  switch (format) {
    case 'hex':
      return formatHexColor(toRgbColor(color));
    case 'oklch':
      return formatOklchColor(toRgbColor(color));
    case 'rgba':
    case 'hsla':
    case 'hsba':
      return color.toString(format);
  }
};

const numberToken = '[+-]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)';
const hexPattern = /^#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i;
const rgbPattern = new RegExp(
  `^rgba?\\(\\s*${numberToken}\\s*,\\s*${numberToken}\\s*,\\s*${numberToken}(?:\\s*,\\s*${numberToken})?\\s*\\)$`,
  'i',
);
const hslPattern = new RegExp(
  `^hsla?\\(\\s*${numberToken}\\s*,\\s*${numberToken}%\\s*,\\s*${numberToken}%(?:\\s*,\\s*${numberToken})?\\s*\\)$`,
  'i',
);
const hsbPattern = new RegExp(
  `^hsba?\\(\\s*${numberToken}\\s*,\\s*${numberToken}%\\s*,\\s*${numberToken}%(?:\\s*,\\s*${numberToken})?\\s*\\)$`,
  'i',
);

const isZagColorSyntax = (value: string) =>
  hexPattern.test(value) ||
  rgbPattern.test(value) ||
  hslPattern.test(value) ||
  hsbPattern.test(value) ||
  /^[a-z]+$/i.test(value);

const assertFiniteColor = (color: ZagColor) => {
  if (Object.values(color.toJSON()).some((value) => !Number.isFinite(value))) {
    throw new Error('Invalid color value');
  }
  return color;
};

/** Parse every public input format while rejecting incomplete CSS strings. */
const parseColor = (value: string): ZagColor => {
  const text = value.trim();
  const oklch = parseOklchColor(text);
  if (oklch) return toZagColor(oklch);
  if (!isZagColorSyntax(text)) throw new Error('Invalid color value');
  return assertFiniteColor(colorPicker.parse(text));
};

/** The tabs only drive the format selection — the editable value field below
 * the row shows the value, so the tab panels stay empty (hidden via CSS). */
const eyeDropperIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m2 22 1-1h3l9-9" />
      <path d="M3 21v-3l9-9" />
      <path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z" />
    </g>
  </svg>
);

const svgIconProps = {
  width: 15,
  height: 15,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const;

const copyIcon = (
  <svg {...svgIconProps}>
    <rect x="9" y="9" width="12" height="12" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const checkIcon = (
  <svg {...svgIconProps}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

/** The legacy path backed by the Zag.js color-picker machine. */
function LegacyColorPicker({
  label,
  size = 'md',
  value,
  defaultValue = '#7c3aed',
  format,
  defaultFormat,
  formats,
  onFormatChange,
  onValueChange,
  showValueText = true,
  placement = 'bottom-start',
  disabled,
  name,
  id,
  className,
}: ColorPickerProps) {
  const autoId = useId();
  const [uncontrolledFormat, setUncontrolledFormat] =
    useState<ColorPickerFormat>(format ?? defaultFormat ?? DEFAULT_FORMAT);
  const selectedFormat = format ?? uncontrolledFormat;
  const machineFormat = toMachineFormat(selectedFormat);
  const parsedValue = useMemo(() => {
    if (!value?.trim()) return undefined;
    try {
      return parseColor(value);
    } catch {
      return undefined;
    }
  }, [value]);
  const parsedDefault = useMemo(() => {
    try {
      return parseColor(defaultValue);
    } catch {
      return colorPicker.parse('#7c3aed');
    }
  }, [defaultValue]);
  const service = useMachine(colorPicker.machine, {
    id: id ?? autoId,
    value: parsedValue,
    defaultValue: parsedDefault,
    format: machineFormat,
    disabled,
    name,
    positioning: { placement },
    onValueChange: onValueChange
      ? (details) => onValueChange(formatColor(details.value, selectedFormat))
      : undefined,
  });
  const api = colorPicker.connect(service, normalizeProps);
  const focusVisibleProps = useFocusVisible<HTMLButtonElement>();

  // Editable value field. `draft` is null unless the input is being edited, so
  // the field otherwise mirrors the live color (drag the area, move a slider).
  const [draft, setDraft] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const formatted = formatColor(api.value, selectedFormat);
  const swatchColor = formatColor(api.value, 'rgba');
  const copyFormats = formats ?? DEFAULT_COPY_FORMATS;
  const copyFormatTabs = (
    copyFormats.includes(selectedFormat)
      ? copyFormats
      : [selectedFormat, ...copyFormats]
  ).map((copyFormat) => ({
    value: copyFormat,
    label: copyFormat.toUpperCase(),
    content: null,
  }));

  // Apply a typed/pasted CSS color of any supported format. Invalid and
  // half-typed values stay in the draft and never change the live color.
  const commitValue = (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    try {
      api.setValue(parseColor(text));
    } catch {
      /* not a valid color yet — keep the draft, don't touch the color */
    }
  };

  const handleFormatChange = (next: string) => {
    if (!(COLOR_PICKER_FORMATS as readonly string[]).includes(next)) return;
    const nextFormat = next as ColorPickerFormat;
    setUncontrolledFormat(nextFormat);
    onFormatChange?.(nextFormat);
  };

  const copyValue = () => {
    void navigator.clipboard?.writeText(formatted).then(
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1200);
      },
      () => {
        /* clipboard unavailable */
      },
    );
  };

  return (
    <div
      {...api.getRootProps()}
      data-variant="primary"
      data-size={size}
      data-format={selectedFormat}
      className={cx(className)}
    >
      {label != null && <label {...api.getLabelProps()}>{label}</label>}
      <div {...api.getControlProps()}>
        <button
          {...api.getTriggerProps()}
          {...focusVisibleProps}
          aria-label={`Select color. Current color is ${formatted}`}
          data-value-text={showValueText}
        >
          <span data-part="value-swatch" style={{ background: swatchColor }} />
          {showValueText && (
            <span {...api.getValueTextProps()}>{formatted}</span>
          )}
        </button>
      </div>
      <Portal>
        {/* The panel is portalled out of the root, so the size cannot inherit:
            re-stamp it and the panel's type follows the trigger. */}
        <div {...api.getPositionerProps()} data-size={size}>
          <div {...api.getContentProps()}>
            <div {...api.getAreaProps()}>
              <div {...api.getAreaBackgroundProps()} />
              <div {...api.getAreaThumbProps()} />
            </div>
            <div data-part="sliders">
              <div {...api.getChannelSliderProps({ channel: 'hue' })}>
                <div {...api.getChannelSliderTrackProps({ channel: 'hue' })} />
                <div {...api.getChannelSliderThumbProps({ channel: 'hue' })} />
              </div>
              <div {...api.getChannelSliderProps({ channel: 'alpha' })}>
                <div {...api.getTransparencyGridProps()} />
                <div
                  {...api.getChannelSliderTrackProps({ channel: 'alpha' })}
                />
                <div
                  {...api.getChannelSliderThumbProps({ channel: 'alpha' })}
                />
              </div>
            </div>
            <div data-part="copy-row">
              <Tabs
                variant="soft"
                size="sm"
                items={copyFormatTabs}
                value={selectedFormat}
                onValueChange={handleFormatChange}
              />
              <Button
                variant="outline"
                size="sm"
                iconOnly
                {...api.getEyeDropperTriggerProps()}
              >
                {eyeDropperIcon}
              </Button>
            </div>
            <div data-part="value-field">
              <Input
                size="sm"
                aria-label="Color value"
                placeholder="#hex · rgb() · hsl() · oklch()"
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                value={draft ?? formatted}
                onChange={(event) => {
                  setDraft(event.target.value);
                  commitValue(event.target.value);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') event.currentTarget.blur();
                }}
                onBlur={() => setDraft(null)}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                iconOnly
                aria-label="Copy color value"
                title={copied ? 'Copied' : 'Copy'}
                onClick={copyValue}
              >
                {copied ? checkIcon : copyIcon}
              </Button>
            </div>
          </div>
        </div>
      </Portal>
      <input {...api.getHiddenInputProps()} />
    </div>
  );
}

/**
 * ColorPicker selects a native color-space implementation when requested. The
 * OKLCH path keeps palette interaction in OKLCH; legacy formats retain the
 * original Zag behavior for backwards compatibility.
 */
export function ColorPicker(props: ColorPickerProps) {
  if (props.colorSpace === 'oklch' || props.format === 'oklch') {
    return <NativeColorPicker {...props} />;
  }
  return <LegacyColorPicker {...props} />;
}
