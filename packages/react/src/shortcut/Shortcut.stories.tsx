import { useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { useShortcut, useShortcuts } from './useShortcut';
import { Badge } from '../components/Badge/Badge';
import { Button } from '../components/Button/Button';
import { Card } from '../components/Card/Card';
import { Dialog } from '../components/Dialog/Dialog';
import { Input } from '../components/Input/Input';

const meta = {
  title: 'Primitives/useShortcut',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const stack: CSSProperties = {
  display: 'grid',
  gap: 'var(--manti-space-4)',
  width: 340,
};

const row: CSSProperties = {
  display: 'flex',
  gap: 'var(--manti-space-2)',
  alignItems: 'center',
  flexWrap: 'wrap',
};

const muted: CSSProperties = {
  color: 'var(--manti-text-muted)',
  fontSize: 'var(--manti-text-sm)',
  lineHeight: 1.5,
};

/** A small key-combo hint, rendered with the monospace token — no colored accent. */
function Combo({ children }: { children: ReactNode }) {
  return (
    <Badge variant="tertiary" style={{ fontFamily: 'var(--manti-font-mono)' }}>
      {children}
    </Badge>
  );
}

/**
 * Global by default: the listener sits on `window`, so `⌘K` / `Ctrl+K` opens the
 * dialog regardless of focus — no wiring on any element. `preventDefault`
 * defaults to `true`, so the browser's own ⌘K doesn't also fire.
 */
export const Global: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    useShortcut('mod+k', () => setOpen(true));
    return (
      <div style={stack}>
        <div style={row}>
          <Button onClick={() => setOpen(true)}>
            Search… <Combo>mod+k</Combo>
          </Button>
        </div>
        <p style={muted}>
          Press <Combo>⌘K</Combo> / <Combo>Ctrl+K</Combo> anywhere on the page.
        </p>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          title="Search"
          description="Opened by click or by the global ⌘K shortcut."
        >
          <Input label="Query" placeholder="Type to search…" />
        </Dialog>
      </div>
    );
  },
};

/**
 * Scoped to a region: pass a ref and the combo only fires while focus is inside
 * that element. Focus the card and press `⌘S` — it saves. Click outside first
 * and the same combo does nothing (and the browser keeps ⌘S for itself).
 */
export const Scoped: Story = {
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    const [saves, setSaves] = useState(0);
    useShortcut('mod+s', () => setSaves((n) => n + 1), { scope: ref });
    return (
      <div style={stack}>
        {/* The ref sits on a focusable wrapper; clicking anywhere inside it
            focuses the region, so the scoped ⌘S then fires. */}
        <div ref={ref} tabIndex={-1} style={{ outline: 'none' }}>
          <Card elevated style={{ padding: 'var(--manti-space-5)', ...stack }}>
            <strong>Editor region</strong>
            <p style={muted}>
              Click here to focus, then press <Combo>⌘S</Combo> /{' '}
              <Combo>Ctrl+S</Combo> to save.
            </p>
            <div style={row}>
              <Badge variant={saves > 0 ? 'primary' : 'secondary'}>
                {saves > 0 ? `Saved ×${saves}` : 'Not saved'}
              </Badge>
            </div>
          </Card>
        </div>
        <p style={muted}>
          Focus outside the card and ⌘S falls through to the browser instead.
        </p>
      </div>
    );
  },
};

/** Bind several combos at once with `useShortcuts`. Includes a `g d` sequence. */
export const Multiple: Story = {
  render: () => {
    const [log, setLog] = useState<string[]>([]);
    const push = (label: string) =>
      setLog((prev) => [label, ...prev].slice(0, 5));
    useShortcuts({
      'mod+k': () => push('mod+k → open search'),
      'mod+/': () => push('mod+/ → toggle help'),
      'g d': () => push('g d → go to dashboard'),
    });
    return (
      <div style={stack}>
        <div style={row}>
          <Combo>mod+k</Combo>
          <Combo>mod+/</Combo>
          <Combo>g d</Combo>
        </div>
        <p style={muted}>
          Try each combo. For the sequence, press <Combo>g</Combo> then{' '}
          <Combo>d</Combo> within a second.
        </p>
        <Card
          style={{
            padding: 'var(--manti-space-4)',
            ...stack,
            gap: 'var(--manti-space-1)',
          }}
        >
          {log.length === 0 ? (
            <span style={muted}>No shortcut fired yet.</span>
          ) : (
            log.map((entry, i) => (
              <span
                key={`${entry}-${i}`}
                style={{
                  fontFamily: 'var(--manti-font-mono)',
                  fontSize: 'var(--manti-text-sm)',
                  opacity: i === 0 ? 1 : 0.55,
                }}
              >
                {entry}
              </span>
            ))
          )}
        </Card>
      </div>
    );
  },
};

/**
 * The form-element guard: by default combos don't fire while you type in an
 * input. The first field ignores `mod+enter`; the second opts in with
 * `enableOnFormElements` and fires from inside the input.
 */
export const FormGuard: Story = {
  render: () => {
    const [count, setCount] = useState(0);
    useShortcut('mod+enter', () => setCount((n) => n + 1), {
      enableOnFormElements: true,
    });
    return (
      <div style={stack}>
        <Input
          label="Comment"
          placeholder="Type, then press ⌘/Ctrl+Enter to submit"
        />
        <div style={row}>
          <Badge variant={count > 0 ? 'primary' : 'secondary'}>
            Submitted ×{count}
          </Badge>
        </div>
        <p style={muted}>
          <Combo>mod+enter</Combo> fires even from inside the field because this
          binding sets <code>enableOnFormElements</code>.
        </p>
      </div>
    );
  },
};
