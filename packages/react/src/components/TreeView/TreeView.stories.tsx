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
