import type { Meta, StoryObj } from '@storybook/react-vite';

import { TreeView } from './TreeView';

const tree = [
  {
    value: 'recipes',
    label: 'recipes',
    children: [
      {
        value: 'steamed',
        label: 'steamed',
        children: [
          { value: 'manti', label: 'manti.md' },
          { value: 'momo', label: 'momo.md' },
        ],
      },
      {
        value: 'boiled',
        label: 'boiled',
        children: [{ value: 'pelmeni', label: 'pelmeni.md' }],
      },
    ],
  },
  {
    value: 'sauces',
    label: 'sauces',
    children: [
      { value: 'yogurt', label: 'garlic-yogurt.md' },
      { value: 'chili-oil', label: 'chili-oil.md' },
    ],
  },
  { value: 'README', label: 'README.md' },
];

const folder = (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
    <path
      d="M1.75 4.5c0-.69.56-1.25 1.25-1.25h2.84c.4 0 .77.18 1 .5l.66.86c.24.31.6.49 1 .49h4.5c.69 0 1.25.56 1.25 1.25v5.4c0 .69-.56 1.25-1.25 1.25H3c-.69 0-1.25-.56-1.25-1.25V4.5Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
  </svg>
);

const file = (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
    <path
      d="M4 1.75h4.3c.27 0 .52.1.71.3l3.2 3.2c.19.18.29.43.29.7v8c0 .69-.56 1.25-1.25 1.25H4c-.69 0-1.25-.56-1.25-1.25V3c0-.69.56-1.25 1.25-1.25Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <path
      d="M8.5 2v3c0 .41.34.75.75.75h3"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const meta = {
  title: 'Components/TreeView',
  component: TreeView,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    items: tree,
    label: 'Cookbook',
    tone: 'primary',
    selectionMode: 'single',
    defaultExpandedValue: ['recipes', 'steamed'],
  },
  argTypes: {
    selectionMode: { control: 'inline-radio', options: ['single', 'multiple'] },
    tone: {
      control: 'select',
      options: ['primary', 'neutral', 'success', 'warning', 'danger', 'info'],
    },
  },
} satisfies Meta<typeof TreeView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const MultiSelect: Story = {
  args: { selectionMode: 'multiple', defaultSelectedValue: ['manti', 'momo'] },
};

export const WithIcons: Story = {
  args: {
    icon: (_node, { isBranch }) => (isBranch ? folder : file),
  },
};
