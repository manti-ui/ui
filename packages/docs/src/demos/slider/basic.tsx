import { Slider } from '@manti-ui/react';

export default function SliderBasic() {
  return (
    <div style={{ width: '100%', maxWidth: 'calc(var(--manti-space-16) * 6)' }}>
      <Slider
        label="Spice level"
        tone="primary"
        defaultValue={40}
        min={0}
        max={100}
        step={1}
        showValue
      />
    </div>
  );
}
