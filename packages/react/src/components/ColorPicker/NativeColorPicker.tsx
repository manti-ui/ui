import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import {
  COLOR_PICKER_FORMATS,
  formatColorValue,
  formatOklchValue,
  getOklchAreaPosition,
  getOklchGradients,
  oklchColorSpace,
  parseColorValue,
  setOklchAreaPosition,
  setOklchChannel,
  popover,
  type ColorPickerFormat,
  type OklchColor,
} from '@manti-ui/folds';
import { normalizeProps, useMachine } from '@zag-js/react';

import { Portal } from '../../internal/Portal';
import { useFocusVisible } from '../../internal/focusVisible';
import { cx } from '../../internal/props';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { Tabs } from '../Tabs/Tabs';

import type { ColorPickerProps } from './ColorPicker';

type DragTarget = 'area' | 'hue' | 'alpha';
type SliderChannel = 'hue' | 'alpha';

const DEFAULT_FORMATS: readonly ColorPickerFormat[] = [
  'oklch',
  'hex',
  'rgba',
  'hsla',
  'hsba',
];

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

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

type EyeDropperConstructor = new () => {
  open: () => Promise<{ sRGBHex: string }>;
};

/**
 * Color picker path for a native color space. The popover shell still uses
 * Zag's focus, dismiss, and positioning behavior, while the value and channel
 * interactions stay in the selected Manti color space.
 */
export function NativeColorPicker({
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
  const rootId = id ?? autoId;
  const labelId = `${rootId}-label`;
  const hiddenInputId = `${rootId}-hidden-input`;
  const [uncontrolledFormat, setUncontrolledFormat] =
    useState<ColorPickerFormat>(format ?? defaultFormat ?? 'oklch');
  const selectedFormat = format ?? uncontrolledFormat;
  const copyFormats = formats ?? DEFAULT_FORMATS;
  const copyFormatTabs = (
    copyFormats.includes(selectedFormat)
      ? copyFormats
      : [selectedFormat, ...copyFormats]
  ).map((copyFormat) => ({
    value: copyFormat,
    label: copyFormat.toUpperCase(),
    content: null,
  }));

  const initialColor = useMemo(() => {
    try {
      return parseColorValue(value ?? defaultValue);
    } catch {
      return parseColorValue('#7c3aed');
    }
  }, [defaultValue, value]);
  const [color, setColor] = useState<OklchColor>(initialColor);
  const [draft, setDraft] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const dragTarget = useRef<DragTarget | null>(null);

  useEffect(() => {
    if (value == null) return;
    try {
      setColor(parseColorValue(value));
    } catch {
      /* Keep the last valid controlled value while the input is incomplete. */
    }
  }, [value]);

  const service = useMachine(popover.machine, {
    id: rootId,
    positioning: { placement },
    closeOnInteractOutside: true,
    closeOnEscape: true,
    autoFocus: true,
  });
  const api = popover.connect(service, normalizeProps);
  const focusVisibleProps = useFocusVisible<HTMLButtonElement>();

  const formatted = formatColorValue(color, selectedFormat);
  const swatchColor = formatOklchValue(color);
  const gradients = getOklchGradients(color);
  const areaPosition = getOklchAreaPosition(color);

  const commitColor = (next: OklchColor) => {
    setColor(next);
    onValueChange?.(formatColorValue(next, selectedFormat));
  };

  const pointPercent = (
    event: ReactPointerEvent<HTMLDivElement>,
  ): { x: number; y: number } => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: rect.width ? clamp((event.clientX - rect.left) / rect.width, 0, 1) : 0,
      y: rect.height
        ? clamp((event.clientY - rect.top) / rect.height, 0, 1)
        : 0,
    };
  };

  const updateArea = (event: ReactPointerEvent<HTMLDivElement>) => {
    commitColor(setOklchAreaPosition(color, pointPercent(event)));
  };

  const updateChannel = (
    event: ReactPointerEvent<HTMLDivElement>,
    channel: SliderChannel,
  ) => {
    const { x } = pointPercent(event);
    const range = oklchColorSpace.getChannelRange(channel);
    commitColor(
      setOklchChannel(
        color,
        channel,
        range.minValue + (range.maxValue - range.minValue) * x,
      ),
    );
  };

  const beginDrag = (
    event: ReactPointerEvent<HTMLDivElement>,
    target: DragTarget,
  ) => {
    if (disabled || event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    dragTarget.current = target;
    if (target === 'area') updateArea(event);
    else updateChannel(event, target);
  };

  const moveDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragTarget.current === 'area') updateArea(event);
    else if (dragTarget.current) updateChannel(event, dragTarget.current);
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    dragTarget.current = null;
  };

  const updateAreaFromKey = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const amount = event.shiftKey ? 0.05 : 0.001;
    let next: OklchColor;
    switch (event.key) {
      case 'ArrowRight':
        next = setOklchChannel(color, 'chroma', color.chroma + amount);
        break;
      case 'ArrowLeft':
        next = setOklchChannel(color, 'chroma', color.chroma - amount);
        break;
      case 'ArrowUp':
        next = setOklchChannel(color, 'lightness', color.lightness + amount);
        break;
      case 'ArrowDown':
        next = setOklchChannel(color, 'lightness', color.lightness - amount);
        break;
      case 'PageUp':
        next = setOklchChannel(color, 'chroma', color.chroma + 0.05);
        break;
      case 'PageDown':
        next = setOklchChannel(color, 'chroma', color.chroma - 0.05);
        break;
      default:
        return;
    }
    event.preventDefault();
    commitColor(next);
  };

  const updateChannelFromKey = (
    event: React.KeyboardEvent<HTMLDivElement>,
    channel: SliderChannel,
  ) => {
    const range = oklchColorSpace.getChannelRange(channel);
    let nextValue: number | undefined;
    if (event.key === 'Home') nextValue = range.minValue;
    else if (event.key === 'End') nextValue = range.maxValue;
    else {
      const amount = event.shiftKey ? range.pageSize : range.step;
      if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
        nextValue = color[channel] + amount;
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
        nextValue = color[channel] - amount;
      }
    }
    if (nextValue == null) return;
    event.preventDefault();
    commitColor(setOklchChannel(color, channel, nextValue));
  };

  const commitValue = (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    try {
      commitColor(parseColorValue(text));
    } catch {
      /* Invalid and half-typed values remain in the draft. */
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
        /* Clipboard unavailable. */
      },
    );
  };

  const pickFromEyeDropper = async () => {
    const EyeDropper = (
      window as Window & { EyeDropper?: EyeDropperConstructor }
    ).EyeDropper;
    if (!EyeDropper) return;
    try {
      const result = await new EyeDropper().open();
      commitColor(parseColorValue(result.sRGBHex));
    } catch {
      /* The user cancelled the eyedropper. */
    }
  };

  const renderSlider = (channel: SliderChannel) => {
    const range = oklchColorSpace.getChannelRange(channel);
    const channelValue = color[channel];
    const offset =
      (channelValue - range.minValue) / (range.maxValue - range.minValue);
    const background = channel === 'hue' ? gradients.hue : gradients.alpha;

    return (
      <div
        key={channel}
        data-scope="color-picker"
        data-part="channel-slider"
        data-channel={channel}
        data-orientation="horizontal"
        role="presentation"
        onPointerDown={(event) => beginDrag(event, channel)}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {channel === 'alpha' && (
          <div
            data-scope="color-picker"
            data-part="transparency-grid"
            aria-hidden="true"
            style={{
              backgroundColor: 'var(--manti-surface)',
              backgroundImage:
                'conic-gradient(var(--manti-border) 0 25%, transparent 0 50%, var(--manti-border) 0 75%, transparent 0)',
              backgroundSize:
                'var(--manti-size-item-gap, var(--manti-space-3)) var(--manti-size-item-gap, var(--manti-space-3))',
              pointerEvents: 'none',
            }}
          />
        )}
        <div
          data-scope="color-picker"
          data-part="channel-slider-track"
          data-channel={channel}
          data-orientation="horizontal"
          aria-hidden="true"
          style={{ backgroundImage: background, pointerEvents: 'none' }}
        />
        <div
          data-scope="color-picker"
          data-part="channel-slider-thumb"
          data-channel={channel}
          data-orientation="horizontal"
          role="slider"
          tabIndex={disabled ? undefined : 0}
          aria-label={channel}
          aria-orientation="horizontal"
          aria-valuemin={range.minValue}
          aria-valuemax={range.maxValue}
          aria-valuenow={channelValue}
          aria-valuetext={`${channel} ${channelValue}`}
          onKeyDown={(event) => updateChannelFromKey(event, channel)}
          style={{
            left: `${offset * 100}%`,
            top: '50%',
            background: swatchColor,
          }}
        />
      </div>
    );
  };

  return (
    <div
      data-scope="color-picker"
      data-part="root"
      data-variant="primary"
      data-size={size}
      data-format={selectedFormat}
      className={cx(className)}
    >
      {label != null && (
        <label
          id={labelId}
          htmlFor={hiddenInputId}
          data-scope="color-picker"
          data-part="label"
        >
          {label}
        </label>
      )}
      <div data-scope="color-picker" data-part="control">
        <button
          {...api.getTriggerProps()}
          {...focusVisibleProps}
          data-scope="color-picker"
          data-part="trigger"
          aria-label={`Select color. Current color is ${formatted}`}
          disabled={disabled}
          data-value-text={showValueText}
        >
          <span data-part="value-swatch" style={{ background: swatchColor }} />
          {showValueText && (
            <span data-scope="color-picker" data-part="value-text">
              {formatted}
            </span>
          )}
        </button>
      </div>
      <Portal>
        <div
          {...api.getPositionerProps()}
          data-scope="color-picker"
          data-part="positioner"
          data-size={size}
        >
          <div
            {...api.getContentProps()}
            data-scope="color-picker"
            data-part="content"
            aria-label="Color picker"
          >
            <div
              data-scope="color-picker"
              data-part="area"
              onPointerDown={(event) => beginDrag(event, 'area')}
              onPointerMove={moveDrag}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              style={{ backgroundImage: gradients.area }}
            >
              <div
                data-scope="color-picker"
                data-part="area-background"
                aria-hidden="true"
                style={{
                  backgroundImage: gradients.areaBackground,
                  pointerEvents: 'none',
                }}
              />
              <div
                data-scope="color-picker"
                data-part="area-thumb"
                role="slider"
                tabIndex={disabled ? undefined : 0}
                aria-label="chroma and lightness"
                aria-roledescription="2d slider"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={areaPosition.x * 100}
                aria-valuetext={`chroma ${color.chroma}, lightness ${color.lightness}`}
                onKeyDown={updateAreaFromKey}
                style={{
                  left: `${areaPosition.x * 100}%`,
                  top: `${areaPosition.y * 100}%`,
                  background: swatchColor,
                }}
              />
            </div>
            <div data-part="sliders">
              {renderSlider('hue')}
              {renderSlider('alpha')}
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
                aria-label="Pick color from screen"
                onClick={() => void pickFromEyeDropper()}
              >
                {eyeDropperIcon}
              </Button>
            </div>
            <div data-part="value-field">
              <Input
                size="sm"
                aria-label="Color value"
                placeholder="oklch() · #hex · rgb() · hsl()"
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
      <input
        id={hiddenInputId}
        type="hidden"
        name={name}
        value={formatted}
        readOnly
        data-scope="color-picker"
        data-part="hidden-input"
      />
    </div>
  );
}
