import type { Story, StoryDefault } from '@ladle/react';

import { Carousel } from './Carousel.js';
import type { CarouselProps } from './Carousel.js';
import { Text } from '../Text/Text.js';

const palette = [
  'var(--manti-surface)',
  'var(--manti-surface-raised)',
  'var(--manti-surface-sunken)',
  'var(--manti-surface)',
  'var(--manti-surface-raised)',
];

const slide = (label: string, bg: string) => (
  <div
    style={{
      display: 'grid',
      placeItems: 'center',
      height: 200,
      borderRadius: 'var(--manti-radius-lg)',
      border: '1px solid var(--manti-border)',
      background: bg,
    }}
  >
    <Text as="span" size="2xl/semibold">
      {label}
    </Text>
  </div>
);

export default {
  title: 'Components/Carousel',
  args: {
    slides: palette.map((bg, i) => slide(`Slide ${i + 1}`, bg)),
    slidesPerPage: 1,
    orientation: 'horizontal',
    loop: false,
  },
  argTypes: {
    orientation: {
      control: { type: 'inline-radio' },
      options: ['horizontal', 'vertical'],
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary', 'danger', 'outline'],
    },
  },
  meta: { layout: 'padded' },
} satisfies StoryDefault<CarouselProps>;

export const Playground: Story<CarouselProps> = (args) => (
  <Carousel {...args} />
);

export const TwoPerPage: Story<CarouselProps> = (args) => (
  <Carousel {...args} />
);
TwoPerPage.args = { slidesPerPage: 2, loop: true };
