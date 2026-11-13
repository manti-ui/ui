import type { Story, StoryDefault } from '@ladle/react';

import { Slider } from './Slider.js';
import type { SliderProps } from './Slider.js';

export default {
  title: 'Components/Slider',
  args: {
    label: 'Spice level',
    variant: 'primary',
    defaultValue: 40,
    min: 0,
    max: 100,
    step: 1,
    showValue: true,
    disabled: false,
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary', 'danger', 'outline'],
    },
  },
  meta: { layout: 'padded' },
} satisfies StoryDefault<SliderProps>;

export const Playground: Story<SliderProps> = (args) => <Slider {...args} />;

export const Range: Story<SliderProps> = (args) => <Slider {...args} />;
Range.args = { label: 'Price range', defaultValue: [25, 75] };

export const WithMarks: Story<SliderProps> = (args) => <Slider {...args} />;
WithMarks.args = { label: 'Portion', marks: [0, 25, 50, 75, 100] };

export const Variants: Story<SliderProps> = (args) => (
  <div style={{ display: 'grid', gap: '1.5rem', maxWidth: 360 }}>
    {(['primary', 'secondary', 'tertiary', 'danger', 'outline'] as const).map(
      (variant) => (
        <Slider {...args} key={variant} variant={variant} label={variant} />
      ),
    )}
  </div>
);
