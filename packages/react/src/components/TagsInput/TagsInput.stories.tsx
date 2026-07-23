import type { Meta, StoryObj } from '@storybook/react-vite';

import { TagsInput } from './TagsInput';

const meta = {
  title: 'Components/TagsInput',
  component: TagsInput,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    label: 'Fillings',
    variant: 'primary',
    defaultValue: ['lamb', 'onion', 'pepper'],
    placeholder: 'Add a filling…',
    disabled: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'danger', 'outline'],
    },
  },
} satisfies Meta<typeof TagsInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: '1rem', maxWidth: 420 }}>
      <TagsInput {...args} label="Default" />
      <TagsInput {...args} label="Invalid" invalid />
      <TagsInput {...args} label="Disabled" disabled />
    </div>
  ),
};

export const MaxThree: Story = {
  args: { label: 'Up to 3 tags', max: 3, defaultValue: ['lamb', 'onion'] },
};
