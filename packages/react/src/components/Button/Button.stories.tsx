import type { CSSProperties } from 'react';
import type { Story, StoryDefault } from '@ladle/react';

import { Button } from './Button.js';
import type { ButtonProps } from './Button.js';

const variants = [
  'primary',
  'secondary',
  'tertiary',
  'danger',
  'outline',
  'link',
] as const;

const row: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.75rem',
  alignItems: 'center',
};

export default {
  title: 'Components/Button',
  args: {
    children: 'Knead dough',
    variant: 'primary',
    size: 'md',
    loading: false,
    fullWidth: false,
    disabled: false,
  },
  argTypes: {
    variant: { control: { type: 'select' }, options: variants },
    size: { control: { type: 'inline-radio' }, options: ['sm', 'md', 'lg'] },
  },
  meta: { layout: 'centered' },
} satisfies StoryDefault<ButtonProps>;

export const Playground: Story<ButtonProps> = (args) => <Button {...args} />;

export const Variants: Story<ButtonProps> = (args) => (
  <div style={row}>
    {variants.map((variant) => (
      <Button {...args} key={variant} variant={variant}>
        {variant}
      </Button>
    ))}
  </div>
);

export const Sizes: Story<ButtonProps> = (args) => (
  <div style={row}>
    <Button {...args} size="sm">
      Small
    </Button>
    <Button {...args} size="md">
      Medium
    </Button>
    <Button {...args} size="lg">
      Large
    </Button>
  </div>
);

export const WithIcons: Story<ButtonProps> = (args) => (
  <div style={row}>
    <Button {...args} leadingIcon={<span aria-hidden>＋</span>}>
      Add filling
    </Button>
    <Button
      {...args}
      variant="secondary"
      trailingIcon={<span aria-hidden>→</span>}
    >
      Continue
    </Button>
    <Button {...args} iconOnly aria-label="More options">
      <span aria-hidden>⋯</span>
    </Button>
  </div>
);

export const Loading: Story<ButtonProps> = (args) => <Button {...args} />;
Loading.args = { loading: true };

export const PolymorphicLink: Story<ButtonProps<'a'>> = (args) => (
  <Button {...args} as="a" href="#button-link-target">
    Navigate as an anchor
  </Button>
);

export const Disabled: Story<ButtonProps> = (args) => (
  <div style={row}>
    {variants.map((variant) => (
      <Button {...args} key={variant} variant={variant}>
        {variant}
      </Button>
    ))}
  </div>
);
Disabled.args = { disabled: true };
