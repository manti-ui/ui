import type { Story, StoryDefault } from '@ladle/react';

import { Card } from '../Card/Card.js';
import { Text } from './Text.js';
import type { TextProps } from './Text.js';

const SCALE = [
  'xs',
  'sm',
  'base',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl',
] as const;

const WEIGHTS = ['regular', 'medium', 'semibold', 'bold'] as const;

/** Every bare stop, plus the `stop/weight` pairs the compound prop accepts. */
const SIZES = [
  ...SCALE,
  ...SCALE.flatMap((scale) => WEIGHTS.map((w) => `${scale}/${w}` as const)),
];

export default {
  title: 'Typography/Text',
  args: {
    children:
      'Manti UI is a framework-agnostic design system powered by Zag.js behavior machines.',
    size: 'base',
    emphasis: 'default',
  },
  argTypes: {
    size: { control: { type: 'select' }, options: SIZES },
    emphasis: {
      control: { type: 'inline-radio' },
      options: ['default', 'muted', 'subtle'],
    },
    variant: {
      control: { type: 'select' },
      options: [
        undefined,
        'primary',
        'secondary',
        'success',
        'info',
        'tertiary',
        'danger',
        'outline',
      ],
    },
    align: {
      control: { type: 'inline-radio' },
      options: [undefined, 'start', 'center', 'end', 'justify'],
    },
  },
} satisfies StoryDefault<TextProps>;

const Stack = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--manti-space-3)',
    }}
  >
    {children}
  </div>
);

export const Playground: Story<TextProps> = (args) => <Text {...args} />;

export const Sizes: Story<TextProps> = () => (
  <Stack>
    {SCALE.map((size) => (
      <Text key={size} size={size}>
        {size} — the quick brown fox
      </Text>
    ))}
  </Stack>
);

export const Weights: Story<TextProps> = () => (
  <Stack>
    {WEIGHTS.map((weight) => (
      <Text key={weight} size={`base/${weight}`}>
        base/{weight} — the quick brown fox
      </Text>
    ))}
  </Stack>
);

/** The neutral ladder: body copy, secondary detail, then quiet metadata. */
export const Emphasis: Story<TextProps> = () => (
  <Stack>
    <Text>Default — the sentence a reader is meant to finish.</Text>
    <Text emphasis="muted">Muted — supporting detail beside it.</Text>
    <Text emphasis="subtle">Subtle — metadata that should not compete.</Text>
  </Stack>
);

/** Semantic color is a separate axis, so a message can be quiet *and* red. */
export const Variants: Story<TextProps> = () => (
  <Stack>
    <Text variant="danger">Danger — this payment could not be captured.</Text>
    <Text variant="success">Success — the invoice was sent.</Text>
    <Text variant="info">Info — changes sync every few minutes.</Text>
    <Text variant="primary">Primary — the accent voice.</Text>
  </Stack>
);

export const Truncation: Story<TextProps> = () => (
  <div style={{ display: 'grid', gap: 'var(--manti-space-4)', width: 320 }}>
    <Card>
      <Text size="base/semibold" truncate>
        A single-line title that runs well past the width of its card
      </Text>
      <Text emphasis="muted" size="sm" lineClamp={2}>
        Manti UI keeps behavior in framework-agnostic machines and ships the
        look as tokens, so a component can be restyled without forking it or
        reaching into its internals.
      </Text>
    </Card>
  </div>
);

export const Alignment: Story<TextProps> = () => (
  <Stack>
    <Text align="start">Start aligned.</Text>
    <Text align="center">Center aligned.</Text>
    <Text align="end">End aligned.</Text>
  </Stack>
);

/** `as` keeps the element honest — a label, a list item, an inline span. */
export const Polymorphic: Story<TextProps> = () => (
  <Stack>
    <Text as="span" size="sm" emphasis="muted">
      Rendered as a span.
    </Text>
    <Text as="label" size="sm/medium" htmlFor="demo-input">
      Rendered as a label.
    </Text>
  </Stack>
);
