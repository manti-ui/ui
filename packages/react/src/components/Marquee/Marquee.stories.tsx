import type { Meta, StoryObj } from '@storybook/react-vite';

import { Marquee } from './Marquee';
import { Badge } from '../Badge/Badge';

const tags = [
  'Framework-agnostic',
  'Zag.js machines',
  'Design tokens',
  'light-dark()',
  'Monochrome',
  'Accessible',
];

const Tags = () => (
  <>
    {tags.map((t) => (
      <Badge key={t} tone="neutral" variant="soft">
        {t}
      </Badge>
    ))}
  </>
);

const meta = {
  title: 'Components/Marquee',
  component: Marquee,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    children: <Tags />,
    direction: 'left',
    speed: 20,
    pauseOnHover: true,
    gap: 'md',
  },
  argTypes: {
    direction: {
      control: 'inline-radio',
      options: ['left', 'right', 'up', 'down'],
    },
    speed: { control: { type: 'number', min: 2, max: 60 } },
    gap: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Marquee>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Directions: Story = {
  args: {
    direction: 'left',
    gap: 'md',
  },

  render: () => (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      <Marquee direction="left">
        <Tags />
      </Marquee>
      <Marquee direction="right">
        <Tags />
      </Marquee>
    </div>
  ),
};

export const Text: Story = {
  render: () => (
    <Marquee speed={28}>
      <span style={{ color: 'var(--manti-text-muted)' }}>
        Manti UI — a framework-agnostic design system built on Zag.js behavior
        machines.
      </span>
    </Marquee>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div style={{ height: '12rem' }}>
      <Marquee direction="up" speed={12}>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {tags.map((t) => (
            <Badge key={t} tone="neutral" variant="soft">
              {t}
            </Badge>
          ))}
        </div>
      </Marquee>
    </div>
  ),
};
