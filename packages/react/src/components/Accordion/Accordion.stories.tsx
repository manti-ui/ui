import type { Meta, StoryObj } from '@storybook/react-vite';

import { Accordion } from './Accordion.js';

const items = [
  {
    value: 'shape',
    title: 'How small should they be?',
    content: 'Traditionally tiny — a good cook fits many on a single spoon.',
  },
  {
    value: 'serve',
    title: 'What goes on top?',
    content: 'Garlic yogurt, melted chili butter, dried mint, and sumac.',
  },
  {
    value: 'freeze',
    title: 'Can I freeze them?',
    content: 'Yes — freeze raw on a tray, then bag once solid.',
  },
];

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { items, defaultValue: ['shape'], multiple: false, collapsible: true },
  decorators: [
    (Story) => (
      <div style={{ width: 460 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Multiple: Story = {
  args: { multiple: true, defaultValue: ['shape', 'serve'] },
};
