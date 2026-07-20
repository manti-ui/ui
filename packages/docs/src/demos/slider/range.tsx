import { Slider } from '@manti-ui/react';

export default function SliderRange() {
  return (
    <div
      style={{
        display: 'grid',
        gap: 'var(--manti-space-6)',
        width: '100%',
        maxWidth: 'calc(var(--manti-space-16) * 6)',
      }}
    >
      <Slider
        label="Price range"
        variant="primary"
        defaultValue={[25, 75]}
        showValue
      />
      <Slider
        label="Portion"
        variant="primary"
        defaultValue={50}
        marks={[0, 25, 50, 75, 100]}
        showValue
      />
    </div>
  );
}
