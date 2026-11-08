import type { CSSProperties } from 'react';
import { presets, variants } from '@manti-ui/tokens';
import type { Meta, StoryObj } from '@storybook/react-vite';

import '@manti-ui/styles/themes.css';

import { Badge, type BadgeVariant } from '../components/Badge/Badge.js';
import { Button } from '../components/Button/Button.js';
import { Heading } from '../components/Heading/Heading.js';
import { Text } from '../components/Text/Text.js';

/**
 * Every shipped preset, each under its own `data-manti-theme` scope from
 * `@manti-ui/styles/themes.css`, rendered in both color schemes side by side.
 * Each scheme panel is a `data-theme` container, so the page shows the light
 * and the dark Radix steps of one preset at once, whatever the toolbar says.
 */
const meta = {
  title: 'Foundations/Theme presets',
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const SCHEMES = ['light', 'dark'] as const;
const BADGE_VARIANTS = variants.filter(
  (variant): variant is BadgeVariant => variant !== 'tertiary',
);

const page: CSSProperties = {
  display: 'grid',
  gap: 'var(--manti-space-8)',
  padding: 'var(--manti-space-10)',
  background: 'var(--manti-bg)',
};

const presetRow: CSSProperties = {
  display: 'grid',
  gap: 'var(--manti-space-3)',
};

const schemes: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: 'var(--manti-space-4)',
};

const panel: CSSProperties = {
  display: 'grid',
  gap: 'var(--manti-space-4)',
  padding: 'var(--manti-space-6)',
  background: 'var(--manti-bg)',
  borderRadius: 'var(--manti-radius-lg)',
};

const cluster: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 'var(--manti-space-2)',
};

function SchemePanel({ scheme }: { scheme: (typeof SCHEMES)[number] }) {
  return (
    <div data-theme={scheme} style={panel}>
      <Text size="sm" emphasis="muted">
        {scheme}
      </Text>
      <div style={cluster}>
        {variants.map((variant) => (
          <Button key={variant} size="sm" variant={variant}>
            {variant}
          </Button>
        ))}
      </div>
      <div style={cluster}>
        {BADGE_VARIANTS.map((variant) => (
          <Badge key={variant} variant={variant}>
            {variant}
          </Badge>
        ))}
      </div>
    </div>
  );
}

export const AllPresets: Story = {
  render: () => (
    <div style={page}>
      {Object.entries(presets).map(([id, preset]) => (
        <section
          key={id}
          data-manti-theme={preset.default ? undefined : id}
          style={presetRow}
        >
          <Heading level={2} size="lg">
            {preset.label}
          </Heading>
          <Text size="sm" emphasis="muted">
            {preset.colors.primary} on {preset.neutral}
          </Text>
          <div style={schemes}>
            {SCHEMES.map((scheme) => (
              <SchemePanel key={scheme} scheme={scheme} />
            ))}
          </div>
        </section>
      ))}
    </div>
  ),
};
