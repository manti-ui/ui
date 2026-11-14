import type { CSSProperties } from 'react';
import {
  colorPrimitives,
  colorScales,
  radixAccentScaleNames,
  radixGrayScaleNames,
  radixScales,
  variants,
  type MantiRadixScale,
} from '@manti-ui/tokens';
import type { Story, StoryDefault } from '@ladle/react';

import { Heading } from '../components/Heading/Heading.js';
import { Text } from '../components/Text/Text.js';

/**
 * The color foundations: the six ramps Manti ships, the Radix scale catalog a
 * theme picks from, and the semantic variants every component reads. Every
 * chip is a `light-dark()` pair of Radix steps, so the page follows the
 * gallery's theme toggle.
 */
export default {
  title: 'Foundations/Colors',
  meta: { layout: 'fullscreen' },
} satisfies StoryDefault;

const page: CSSProperties = {
  padding: 'var(--manti-space-10)',
  display: 'grid',
  gap: 'var(--manti-space-10)',
  color: 'var(--manti-text)',
  background: 'var(--manti-bg)',
};

const intro: CSSProperties = {
  display: 'grid',
  gap: 'var(--manti-space-2)',
  maxWidth: '60ch',
};

const stack: CSSProperties = {
  display: 'grid',
  gap: 'var(--manti-space-6)',
};

const ramp: CSSProperties = {
  display: 'flex',
  borderRadius: 'var(--manti-radius-md)',
  overflow: 'hidden',
};

const chip: CSSProperties = { height: 'var(--manti-space-12)' };

function Ramp({
  title,
  steps,
}: {
  title: string;
  steps: Record<string, string>;
}) {
  return (
    <div style={{ display: 'grid', gap: 'var(--manti-space-2)' }}>
      <Text size="sm/semibold">{title}</Text>
      <div style={ramp}>
        {Object.entries(steps).map(([step, value]) => (
          <div key={step} style={{ flex: 1 }}>
            <div style={{ ...chip, background: value }} />
            <Text size="xs" emphasis="muted" align="center">
              {step}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
}

/** One catalog scale as the theme-aware steps the theme tools write. */
function catalogSteps(name: MantiRadixScale): Record<string, string> {
  const scale = radixScales[name];
  return Object.fromEntries(
    Object.keys(scale.light).map((step) => {
      const n = Number(step) as keyof typeof scale.light;
      return [step, `light-dark(${scale.light[n]}, ${scale.dark[n]})`];
    }),
  );
}

export const Primitives: Story = () => (
  <div style={page}>
    <div style={intro}>
      <Heading level={1} size="3xl">
        Color ramps
      </Heading>
      <Text emphasis="muted">
        Seven Radix Colors scales under plain color names: gray (Radix slate),
        tomato (the primary), orange, green, amber, red, and blue. Each step
        follows the theme.
      </Text>
    </div>
    <div style={stack}>
      {Object.entries(colorPrimitives).map(([name, steps]) => {
        const radix = colorScales[name as keyof typeof colorScales].radix;
        return (
          <Ramp
            key={name}
            title={radix === name ? name : `${name} (Radix ${radix})`}
            steps={steps as Record<string, string>}
          />
        );
      })}
    </div>
  </div>
);

/**
 * The `radixScales` catalog in `@manti-ui/tokens`: every scale a theme may
 * name. Oklava and the docs playground offer exactly these, by name, for a
 * variant (any accent or gray) and for the neutral (a gray). There is no free
 * color input anywhere.
 */
export const RadixCatalog: Story = () => (
  <div style={page}>
    <div style={intro}>
      <Heading level={1} size="3xl">
        Radix scale catalog
      </Heading>
      <Text emphasis="muted">
        The scales a theme picks from, by name. An accent names the gray Radix
        pairs it with; a gray is a theme&apos;s neutral.
      </Text>
    </div>
    <section style={stack}>
      <Heading level={2} size="lg">
        Accents
      </Heading>
      {radixAccentScaleNames.map((name) => (
        <Ramp
          key={name}
          title={`${name} (pairs with ${radixScales[name].gray})`}
          steps={catalogSteps(name)}
        />
      ))}
    </section>
    <section style={stack}>
      <Heading level={2} size="lg">
        Grays
      </Heading>
      {radixGrayScaleNames.map((name) => (
        <Ramp key={name} title={name} steps={catalogSteps(name)} />
      ))}
    </section>
  </div>
);

export const Variants: Story = () => (
  <div style={page}>
    <div style={intro}>
      <Heading level={1} size="3xl">
        Semantic variants
      </Heading>
      <Text emphasis="muted">
        Every variant-driven component reads the same <code>--variant-*</code>{' '}
        roles. Toggle the theme to see them adapt via <code>light-dark()</code>.
      </Text>
    </div>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns:
          'repeat(auto-fill, minmax(calc(var(--manti-space-12) * 3), 1fr))',
        gap: 'var(--manti-space-4)',
      }}
    >
      {variants.map((variant) => (
        <div
          key={variant}
          data-variant={variant}
          style={{
            border: '1px solid var(--manti-border)',
            borderRadius: 'var(--manti-radius-lg)',
            overflow: 'hidden',
            background: 'var(--manti-surface)',
          }}
        >
          <div
            style={{
              height: 'var(--manti-space-16)',
              background: 'var(--variant-solid)',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <Text
              as="span"
              size="sm/semibold"
              style={{ color: 'var(--variant-on-solid)' }}
            >
              {variant}
            </Text>
          </div>
          <div
            style={{
              height: 'var(--manti-space-10)',
              background: 'var(--variant-soft-bg)',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <Text
              as="span"
              size="xs"
              style={{ color: 'var(--variant-soft-text)' }}
            >
              soft
            </Text>
          </div>
        </div>
      ))}
    </div>
  </div>
);
