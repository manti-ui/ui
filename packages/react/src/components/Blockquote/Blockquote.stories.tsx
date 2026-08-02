import type { Meta, StoryObj } from '@storybook/react-vite';

import { Blockquote } from './Blockquote';

const meta = {
  title: 'Typography/Blockquote',
  component: Blockquote,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    children:
      'The best interface is the one that makes the intended action feel inevitable.',
    size: 'md',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['md', 'lg'] },
  },
} satisfies Meta<typeof Blockquote>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gap: 'var(--manti-space-6)',
        maxWidth: 'calc(var(--manti-space-16) * 10)',
      }}
    >
      <Blockquote size="md">
        Components should preserve the meaning of the HTML they render.
      </Blockquote>
      <Blockquote size="lg">
        A shared token language makes every new primitive feel at home.
      </Blockquote>
    </div>
  ),
};
