import { fontSize, fontWeight } from '@manti-ui/tokens';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Foundations/Typography',
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const page = {
  padding: '2.5rem',
  display: 'grid',
  gap: '2.5rem',
  fontFamily: 'var(--manti-font-sans)',
  color: 'var(--manti-text)',
  background: 'var(--manti-bg)',
} as const;

export const Scale: Story = {
  render: () => (
    <div style={page}>
      <div>
        <h1
          style={{
            fontSize: 32,
            letterSpacing: 'var(--manti-tracking-tighter)',
          }}
        >
          Type scale
        </h1>
        <p style={{ color: 'var(--manti-text-muted)' }}>
          A calm, readable scale in Inter. Sizes are exposed as{' '}
          <code>--manti-text-*</code> tokens.
        </p>
      </div>
      <div style={{ display: 'grid', gap: '0.5rem' }}>
        {Object.entries(fontSize).map(([name, value]) => (
          <div
            key={name}
            style={{ display: 'flex', alignItems: 'baseline', gap: '1.5rem' }}
          >
            <span
              style={{
                width: 48,
                fontSize: 12,
                color: 'var(--manti-text-subtle)',
              }}
            >
              {name}
            </span>
            <span
              style={{
                fontSize: value,
                letterSpacing: 'var(--manti-tracking-tighter)',
              }}
            >
              Mantı keeps it smooth
            </span>
          </div>
        ))}
      </div>
      <div>
        <h2 style={{ fontSize: 20, marginBottom: '1rem' }}>Weights</h2>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          {Object.entries(fontWeight).map(([name, value]) => (
            <span
              key={name}
              style={{ fontSize: 20, fontWeight: Number(value) }}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  ),
};
