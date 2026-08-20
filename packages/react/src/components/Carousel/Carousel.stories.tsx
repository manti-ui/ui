import type { Meta, StoryObj } from '@storybook/react-vite';

import { Carousel } from './Carousel';
import { Text } from '../Text/Text';

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

const meta = {
  title: 'Components/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    slides: palette.map((bg, i) => slide(`Slide ${i + 1}`, bg)),
    slidesPerPage: 1,
    orientation: 'horizontal',
    loop: false,
  },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'danger', 'outline'],
    },
  },
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const TwoPerPage: Story = {
  args: { slidesPerPage: 2, loop: true },
};
