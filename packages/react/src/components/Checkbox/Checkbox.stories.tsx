import type { Story, StoryDefault } from '@ladle/react';

import { Checkbox } from './Checkbox.js';
import type { CheckboxProps } from './Checkbox.js';

export default {
  title: 'Components/Checkbox',
  args: {
    children: 'Extra sumac',
    size: 'md',
    variant: 'primary',
    defaultChecked: true,
    indeterminate: false,
    disabled: false,
  },
  argTypes: {
    size: { control: { type: 'inline-radio' }, options: ['sm', 'md', 'lg'] },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary', 'danger', 'outline'],
    },
  },
  meta: { layout: 'centered' },
} satisfies StoryDefault<CheckboxProps>;

export const Playground: Story<CheckboxProps> = (args) => (
  <Checkbox {...args} />
);

export const States: Story<CheckboxProps> = (args) => (
  <div style={{ display: 'grid', gap: '0.75rem' }}>
    <Checkbox {...args} defaultChecked={false}>
      Unchecked
    </Checkbox>
    <Checkbox {...args} defaultChecked>
      Checked
    </Checkbox>
    <Checkbox {...args} indeterminate>
      Indeterminate
    </Checkbox>
    <Checkbox {...args} defaultChecked={false} disabled>
      Disabled
    </Checkbox>
  </div>
);

export const Sizes: Story<CheckboxProps> = (args) => (
  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
    <Checkbox {...args} size="sm">
      Small
    </Checkbox>
    <Checkbox {...args} size="md">
      Medium
    </Checkbox>
    <Checkbox {...args} size="lg">
      Large
    </Checkbox>
  </div>
);
