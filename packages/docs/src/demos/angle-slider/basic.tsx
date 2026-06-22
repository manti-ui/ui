import { AngleSlider } from '@manti-ui/react';

export default function AngleSliderBasic() {
  return (
    <AngleSlider
      label="Gradient angle"
      tone="primary"
      defaultValue={45}
      step={1}
      showValue
    />
  );
}
