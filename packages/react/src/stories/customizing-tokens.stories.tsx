import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge } from '../components/Badge/Badge';
import { Button } from '../components/Button/Button';
import { Switch } from '../components/Switch/Switch';
import { TextField } from '../components/TextField/TextField';

/**
 * Token override demo. Manti tokens form three tiers, each defaulting into the
 * one above it: primitive → semantic → component. This story contrasts the two
 * customization altitudes a consumer reaches for.
 */
const meta = {
  title: 'Foundations/Customizing tokens',
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const page: CSSProperties = {
  padding: '2.5rem',
  display: 'grid',
  gap: '1.75rem',
  fontFamily: 'var(--manti-font-sans)',
  color: 'var(--manti-text)',
  background: 'var(--manti-bg)',
};

const panel: CSSProperties = {
  display: 'grid',
  gap: '1rem',
  padding: '1.5rem',
  border: '1px solid var(--manti-border)',
  borderRadius: 'var(--manti-radius-lg)',
  background: 'var(--manti-surface)',
};

const cluster: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.75rem',
  alignItems: 'center',
};

const caption: CSSProperties = {
  fontSize: 'var(--manti-text-sm)',
  color: 'var(--manti-text-muted)',
  margin: 0,
};

const label: CSSProperties = {
  fontSize: 'var(--manti-text-xs)',
  fontWeight: 600,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: 'var(--manti-text-subtle)',
};

// A small fixed set of controls so the same cluster can be re-rendered under
// different token scopes and the difference is obvious at a glance.
function Controls() {
  return (
    <div style={cluster}>
      <Button tone="primary">Save</Button>
      <Button tone="primary" variant="outline">
        Cancel
      </Button>
      <TextField placeholder="Type a recipe…" />
      <Switch defaultChecked>Notify</Switch>
      <Badge tone="success">Fresh</Badge>
    </div>
  );
}

// Setting CSS custom properties via inline style needs a cast — the keys are
// valid CSS but not in the typed CSSProperties surface.
const vars = (obj: Record<string, string>): CSSProperties => obj as CSSProperties;

export const Overview: Story = {
  render: () => (
    <div style={page}>
      <div>
        <h1 style={{ fontSize: 30, letterSpacing: '-0.03em', margin: 0 }}>
          Customizing with tokens
        </h1>
        <p style={{ ...caption, marginTop: '0.5rem', maxWidth: '46ch' }}>
          Redefine token custom properties at any scope. Pick the right altitude:
          semantic tokens are the front door, component tokens are an escape
          hatch.
        </p>
      </div>

      {/* 1 — baseline */}
      <div style={panel}>
        <span style={label}>As shipped</span>
        <Controls />
        <p style={caption}>The defaults — no overrides in scope.</p>
      </div>

      {/* 2 — semantic front door: cascades to every control at once */}
      <div
        style={{
          ...panel,
          ...vars({
            '--manti-control-height-md': '3rem',
            '--manti-radius-md': '3px',
          }),
        }}
      >
        <span style={label}>Semantic override — the front door</span>
        <Controls />
        <p style={caption}>
          One Tier-2 change cascades to <strong>every</strong> control together:{' '}
          <code>--manti-control-height-md</code> resizes the button, text field
          and switch in lockstep; <code>--manti-radius-md</code> sharpens their
          corners. This is the everyday theming lever.
        </p>
      </div>

      {/* 3 — component-token escape hatch: one component diverges on purpose */}
      <div
        style={{
          ...panel,
          ...vars({ '--manti-button-radius': '9999px' }),
        }}
      >
        <span style={label}>Component token — the escape hatch</span>
        <Controls />
        <p style={caption}>
          <code>--manti-button-radius</code> makes the buttons pill-shaped while
          the text field, switch and badge keep their own radius. Reach for a
          component token only to make <strong>one</strong> component diverge
          from the system on purpose.
        </p>
      </div>
    </div>
  ),
};

export const SemanticFrontDoor: Story = {
  name: 'Semantic front door',
  render: () => (
    <div style={page}>
      <p style={caption}>
        Change a Tier-2 semantic token and the whole system follows. Here every
        control shares <code>--manti-control-height-*</code>, so one value
        retunes them all.
      </p>
      <div style={panel}>
        <span style={label}>md → 2.5rem (default)</span>
        <Controls />
      </div>
      <div style={{ ...panel, ...vars({ '--manti-control-height-md': '2rem' }) }}>
        <span style={label}>md → 2rem (compact)</span>
        <Controls />
      </div>
      <div
        style={{ ...panel, ...vars({ '--manti-control-height-md': '3.25rem' }) }}
      >
        <span style={label}>md → 3.25rem (roomy)</span>
        <Controls />
      </div>
    </div>
  ),
};

export const ComponentEscapeHatch: Story = {
  name: 'Component escape hatch',
  render: () => (
    <div style={page}>
      <p style={caption}>
        A component token overrides a single component. The siblings are
        untouched — that is the whole point.
      </p>
      <div
        style={{
          ...panel,
          ...vars({
            '--manti-button-radius': '9999px',
            '--manti-button-padding-x': '1.5rem',
          }),
        }}
      >
        <span style={label}>--manti-button-* overridden</span>
        <Controls />
        <p style={caption}>
          Only the buttons change shape and padding; the text field and switch
          keep the system defaults.
        </p>
      </div>
    </div>
  ),
};
