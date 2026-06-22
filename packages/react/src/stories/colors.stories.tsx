import { colorPrimitives, tones } from '@manti-ui/tokens';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Foundations/Colors',
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

function Ramp({
  name,
  steps,
}: {
  name: string;
  steps: Record<string, string>;
}) {
  return (
    <div>
      <div
        style={{
          marginBottom: 8,
          fontWeight: 600,
          textTransform: 'capitalize',
        }}
      >
        {name}
      </div>
      <div style={{ display: 'flex', borderRadius: 10, overflow: 'hidden' }}>
        {Object.entries(steps).map(([step, value]) => (
          <div key={step} style={{ flex: 1 }}>
            <div style={{ height: 56, background: value }} />
            <div
              style={{
                padding: '4px 2px',
                fontSize: 11,
                textAlign: 'center',
                color: 'var(--manti-text-muted)',
              }}
            >
              {step}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const Primitives: Story = {
  render: () => (
    <div style={page}>
      <div>
        <h1 style={{ fontSize: 32, letterSpacing: '-0.03em' }}>Color ramps</h1>
        <p style={{ color: 'var(--manti-text-muted)', maxWidth: '60ch' }}>
          Six warm-tinted, perceptually-smooth OKLCH scales under plain color
          names: gray, orange, green, amber, red, and blue.
        </p>
      </div>
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {Object.entries(colorPrimitives).map(([name, steps]) => (
          <Ramp
            key={name}
            name={name}
            steps={steps as Record<string, string>}
          />
        ))}
      </div>
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div style={page}>
      <div>
        <h1 style={{ fontSize: 32, letterSpacing: '-0.03em' }}>
          Semantic tones
        </h1>
        <p style={{ color: 'var(--manti-text-muted)', maxWidth: '60ch' }}>
          Every tonal component reads the same <code>--tone-*</code> roles.
          Toggle the Storybook theme to see them adapt via{' '}
          <code>light-dark()</code>.
        </p>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '1rem',
        }}
      >
        {tones.map((tone) => (
          <div
            key={tone}
            data-tone={tone}
            style={{
              border: '1px solid var(--manti-border)',
              borderRadius: 14,
              overflow: 'hidden',
              background: 'var(--manti-surface)',
            }}
          >
            <div
              style={{
                height: 64,
                background: 'var(--tone-solid)',
                color: 'var(--tone-on-solid)',
                display: 'grid',
                placeItems: 'center',
                fontWeight: 600,
                textTransform: 'capitalize',
              }}
            >
              {tone}
            </div>
            <div
              style={{
                height: 40,
                background: 'var(--tone-soft-bg)',
                color: 'var(--tone-soft-text)',
                display: 'grid',
                placeItems: 'center',
                fontSize: 13,
              }}
            >
              soft
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};
