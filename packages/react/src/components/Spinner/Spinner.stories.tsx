import type { Story, StoryDefault } from '@ladle/react';

import { Spinner } from './Spinner.js';
import type { SpinnerProps } from './Spinner.js';

export default {
  title: 'Components/Spinner',
  args: { size: 'md' },
  argTypes: {
    size: { control: { type: 'inline-radio' }, options: ['sm', 'md', 'lg'] },
  },
  meta: { layout: 'centered' },
} satisfies StoryDefault<SpinnerProps>;

export const Playground: Story<SpinnerProps> = (args) => <Spinner {...args} />;

export const Sizes: Story<SpinnerProps> = () => (
  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
    <Spinner size="sm" />
    <Spinner size="md" />
    <Spinner size="lg" />
  </div>
);

export const OnTone: Story<SpinnerProps> = () => (
  <div
    style={{
      display: 'flex',
      gap: '1.5rem',
      padding: '1.5rem',
      borderRadius: '14px',
      color: 'var(--manti-orange-7)',
    }}
  >
    <Spinner />
    <span style={{ color: 'var(--manti-green-7)' }}>
      <Spinner />
    </span>
    <span style={{ color: 'var(--manti-blue-7)' }}>
      <Spinner />
    </span>
  </div>
);
