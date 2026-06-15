import type { Meta, StoryObj } from '@storybook/react-vite';

import { Carousel } from './Carousel';

const palette = ['#1f2933', '#27333f', '#30404d', '#3a4d5c', '#45596b'];

const slide = (label: string, bg: string) => (
  <div
    style={{
      display: 'grid',
      placeItems: 'center',
      height: 200,
      borderRadius: 12,
      background: bg,
      color: '#fff',
      fontSize: 24,
      fontWeight: 600,
    }}
  >
    {label}
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
  },
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const TwoPerPage: Story = {
  args: { slidesPerPage: 2, loop: true },
};
