import { AngleSlider } from '@manti-ui/react';

export default function AngleSliderMarks() {
  return (
    <AngleSlider
      label="Snap to 45°"
      tone="primary"
      defaultValue={45}
      step={45}
      marks={[0, 45, 90, 135, 180, 225, 270, 315]}
      showValue
    />
  );
}
