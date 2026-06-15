import type { Meta, StoryObj } from '@storybook/react-vite';

import { Editable } from './Editable';

const meta = {
  title: 'Components/Editable',
  component: Editable,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    label: 'Recipe name',
    tone: 'primary',
    defaultValue: 'Kayseri mantısı',
    placeholder: 'Enter a name…',
    activationMode: 'focus',
    submitMode: 'both',
    disabled: false,
  },
  argTypes: {
    activationMode: {
      control: 'inline-radio',
      options: ['focus', 'dblclick', 'click', 'none'],
    },
    submitMode: {
      control: 'inline-radio',
      options: ['enter', 'blur', 'both', 'none'],
    },
    tone: {
      control: 'select',
      options: ['primary', 'neutral', 'success', 'warning', 'danger', 'info'],
    },
  },
} satisfies Meta<typeof Editable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const DoubleClickToEdit: Story = {
  args: { activationMode: 'dblclick' },
};

export const Empty: Story = {
  args: { defaultValue: '', placeholder: 'Click to add a name…' },
};
