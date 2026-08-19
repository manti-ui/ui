import type { Meta, StoryObj } from '@storybook/react-vite';

import { Text } from '../Text/Text';
import { Heading } from './Heading';

const SIZES = [
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

const meta = {
  title: 'Typography/Heading',
  component: Heading,
  tags: ['autodocs'],
  args: {
    children: 'Behavior you can trust, styling you can own',
    level: 2,
    emphasis: 'default',
  },
  argTypes: {
    level: { control: 'inline-radio', options: [1, 2, 3, 4, 5, 6] },
    size: { control: 'select', options: [undefined, ...SIZES] },
    emphasis: {
      control: 'inline-radio',
      options: ['default', 'muted', 'subtle'],
    },
    variant: {
      control: 'select',
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
      control: 'inline-radio',
      options: [undefined, 'start', 'center', 'end'],
    },
  },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

const Stack = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--manti-space-4)',
    }}
  >
    {children}
  </div>
);

export const Playground: Story = {};

/** Each rank comes with a default stop, so the plain markup already reads right. */
export const Levels: Story = {
  render: () => (
    <Stack>
      {([1, 2, 3, 4, 5, 6] as const).map((level) => (
        <Heading key={level} level={level}>
          Level {level} heading
        </Heading>
      ))}
    </Stack>
  ),
};

/**
 * The point of keeping `level` and `size` apart: a section can be an `h2` for
 * the document outline while laying out small, and a hero can be an `h1` at
 * display size without anyone reaching for a `div`.
 */
export const LevelVsSize: Story = {
  render: () => (
    <Stack>
      <Heading level={1} size="5xl">
        h1 at 5xl
      </Heading>
      <Heading level={2} size="sm" emphasis="muted">
        h2 at sm — an eyebrow that still belongs to the outline
      </Heading>
      <Text emphasis="subtle" size="sm">
        Both are real heading elements; only the visual stop changed.
      </Text>
    </Stack>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Stack>
      {SIZES.map((size) => (
        <Heading key={size} level={3} size={size}>
          {size} — tracking tightens as the type grows
        </Heading>
      ))}
    </Stack>
  ),
};

export const Emphasis: Story = {
  render: () => (
    <Stack>
      <Heading level={3}>Default title</Heading>
      <Heading level={3} emphasis="muted">
        Muted title
      </Heading>
      <Heading level={3} emphasis="subtle">
        Subtle title
      </Heading>
    </Stack>
  ),
};

export const Variants: Story = {
  render: () => (
    <Stack>
      <Heading level={3} variant="danger">
        Payment failed
      </Heading>
      <Heading level={3} variant="success">
        All checks passed
      </Heading>
      <Heading level={3} variant="primary">
        Ready to publish
      </Heading>
    </Stack>
  ),
};

/** A title and its supporting copy — the pairing Heading exists for. */
export const WithSupportingText: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gap: 'var(--manti-space-2)',
        maxWidth: '40rem',
      }}
    >
      <Heading level={2}>Design tokens are mandatory</Heading>
      <Text emphasis="muted">
        Every visual value comes from the token contract, so a consumer can
        restyle a component without forking it.
      </Text>
    </div>
  ),
};
