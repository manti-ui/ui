import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge } from './Badge';

const variants = [
  'primary',
  'secondary',
  'tertiary',
  'danger',
  'outline',
] as const;

const row: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
  alignItems: 'center',
};

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    children: 'Fresh',
    variant: 'secondary',
    size: 'sm',
    dot: false,
  },
  argTypes: {
    variant: { control: 'select', options: variants },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={row}>
      {variants.map((variant) => (
        <Badge {...args} key={variant} variant={variant}>
          {variant}
        </Badge>
      ))}
    </div>
  ),
};

export const WithDot: Story = {
  render: (args) => (
    <div style={row}>
      <Badge {...args} variant="primary" dot>
        Ready
      </Badge>
      <Badge {...args} variant="outline" dot>
        Resting
      </Badge>
      <Badge {...args} variant="danger" dot>
        Burnt
      </Badge>
    </div>
  ),
};
