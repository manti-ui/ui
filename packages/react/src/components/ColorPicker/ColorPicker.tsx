import { useId, useMemo } from 'react';
import type { ReactNode } from 'react';
import { colorPicker } from '@manti-ui/folds';
import { normalizeProps, Portal, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props';
import type { Placement } from '../../internal/floating';

export interface ColorPickerProps {
  /** Optional field label. */
  label?: ReactNode;
  /** Controlled value as a CSS color string. */
  value?: string;
  /** Initial value for uncontrolled usage. */
  defaultValue?: string;
  /** Called whenever the value changes; emits a CSS color string. */
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

/** A color picker backed by the Zag.js color-picker machine. */
export function ColorPicker({
  label,
  value,
  defaultValue = '#7c3aed',
  onValueChange,
  showValueText = true,
  placement = 'bottom-start',
  disabled,
  name,
  id,
  className,
}: ColorPickerProps) {
  const autoId = useId();
  const parsedValue = useMemo(
    () => (value ? colorPicker.parse(value) : undefined),
    [value],
  );
  const parsedDefault = useMemo(
    () => colorPicker.parse(defaultValue),
    [defaultValue],
  );
  const service = useMachine(colorPicker.machine, {
    id: id ?? autoId,
    value: parsedValue,
    defaultValue: parsedDefault,
    disabled,
    name,
    positioning: { placement },
    onValueChange: onValueChange
      ? (details) => onValueChange(details.valueAsString)
      : undefined,
  });
  const api = colorPicker.connect(service, normalizeProps);

  return (
    <div {...api.getRootProps()} className={cx(className)}>
      {label != null && <label {...api.getLabelProps()}>{label}</label>}
      <div {...api.getControlProps()}>
        <button {...api.getTriggerProps()} data-value-text={showValueText}>
          <span
            data-part="value-swatch"
            style={{ background: api.valueAsString }}
          />
          {showValueText && (
            <span {...api.getValueTextProps()}>{api.valueAsString}</span>
          )}
        </button>
      </div>
      <Portal>
        <div {...api.getPositionerProps()}>
          <div {...api.getContentProps()}>
            <div {...api.getAreaProps()}>
              <div {...api.getAreaBackgroundProps()} />
              <div {...api.getAreaThumbProps()} />
            </div>
            <div {...api.getChannelSliderProps({ channel: 'hue' })}>
              <div {...api.getChannelSliderTrackProps({ channel: 'hue' })} />
              <div {...api.getChannelSliderThumbProps({ channel: 'hue' })} />
            </div>
            <div {...api.getChannelSliderProps({ channel: 'alpha' })}>
              <div {...api.getTransparencyGridProps()} />
              <div {...api.getChannelSliderTrackProps({ channel: 'alpha' })} />
              <div {...api.getChannelSliderThumbProps({ channel: 'alpha' })} />
            </div>
            <input {...api.getChannelInputProps({ channel: 'hex' })} />
          </div>
        </div>
      </Portal>
      <input {...api.getHiddenInputProps()} />
    </div>
  );
}
