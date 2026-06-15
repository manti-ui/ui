import type { Meta, StoryObj } from '@storybook/react-vite';

import { Tour } from './Tour';
import { Button } from '../Button/Button';

const steps = [
  {
    id: 'welcome',
    title: 'Welcome to Manti UI',
    description: 'A quick tour of the essentials. Use Back and Next to move.',
    placement: 'center' as const,
  },
  {
    id: 'tokens',
    title: 'Design tokens',
    description: 'Every visual value comes from the token contract.',
    target: '#tour-tokens',
  },
  {
    id: 'components',
    title: 'Components',
    description: 'Thin renderers over Zag.js behavior machines.',
    target: '#tour-components',
  },
];

const meta = {
  title: 'Components/Tour',
  component: Tour,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    steps,
    trigger: <Button>Start tour</Button>,
  },
  render: (args) => (
    <div style={{ display: 'grid', gap: 48 }}>
      <Tour {...args} />
      <div style={{ display: 'flex', gap: 24 }}>
        <span id="tour-tokens" style={{ padding: 8 }}>
          🎨 Tokens
        </span>
        <span id="tour-components" style={{ padding: 8 }}>
          🧩 Components
        </span>
      </div>
    </div>
  ),
} satisfies Meta<typeof Tour>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
