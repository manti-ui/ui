import { Slider } from '@manti-ui/react';

export default function SliderRange() {
  return (
    <div className="slider-range">
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
