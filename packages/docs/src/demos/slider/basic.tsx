import { Slider } from '@manti-ui/react';

export default function SliderBasic() {
  return (
    <div className="slider-field">
      <Slider
        label="Spice level"
        variant="primary"
        defaultValue={40}
        min={0}
        max={100}
        step={1}
        showValue
      />
    </div>
  );
}
