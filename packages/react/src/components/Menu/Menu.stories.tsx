import type { Story, StoryDefault } from '@ladle/react';
import { useEffect, useRef, useState } from 'react';

import { Menu } from './Menu.js';
import type { MenuProps } from './Menu.js';
import { PortalContainerProvider } from '../../internal/Portal.js';
import { Button } from '../Button/Button.js';
import { Card } from '../Card/Card.js';
import { Kbd } from '../Kbd/Kbd.js';
import { Text } from '../Text/Text.js';

export default {
  title: 'Components/Menu',
  args: {
    placement: 'bottom-start',
    trigger: <Button variant="tertiary">Serve as…</Button>,
    items: [
      { value: 'yogurt', label: 'Garlic yogurt', shortcut: '⌘1' },
      { value: 'butter', label: 'Chili butter', shortcut: '⌘2' },
      { value: 'broth', label: 'In broth', shortcut: '⌘3' },
      { type: 'separator' },
      { value: 'plain', label: 'Plain', disabled: true },
    ],
  },
  argTypes: {
    size: { control: { type: 'inline-radio' }, options: ['sm', 'md', 'lg'] },
  },
  meta: { layout: 'centered' },
} satisfies StoryDefault<MenuProps>;

export const Playground: Story<MenuProps> = (args) => <Menu {...args} />;

export const BottomCenter: Story<MenuProps> = (args) => <Menu {...args} />;
BottomCenter.args = {
  placement: 'bottom-center',
  trigger: <Button variant="tertiary">Open bottom-center menu</Button>,
};

export const Grouped: Story<MenuProps> = (args) => <Menu {...args} />;
Grouped.args = {
  items: [
    {
      type: 'group',
      label: 'Toppings',
      items: [
        { value: 'yogurt', label: 'Garlic yogurt' },
        { value: 'butter', label: 'Chili butter' },
        { value: 'mint', label: 'Dried mint' },
      ],
    },
    { type: 'separator' },
    {
      type: 'group',
      label: 'Style',
      items: [
        { value: 'kayseri', label: 'Kayseri (tiny)' },
        { value: 'steamed', label: 'Steamed (large)' },
      ],
    },
  ],
};

export const Nested: Story<MenuProps> = (args) => <Menu {...args} />;
Nested.args = {
  trigger: <Button variant="tertiary">File</Button>,
  items: [
    { value: 'new', label: 'New file', shortcut: '⌘N' },
    {
      type: 'submenu',
      value: 'share',
      label: 'Share',
      items: [
        { value: 'messages', label: 'Messages' },
        { value: 'mail', label: 'Mail' },
        {
          type: 'submenu',
          value: 'more',
          label: 'More',
          items: [
            { value: 'airdrop', label: 'AirDrop' },
            { value: 'notes', label: 'Notes' },
          ],
        },
      ],
    },
    { type: 'separator' },
    { value: 'print', label: 'Print…', shortcut: '⌘P' },
  ],
};

export const OptionsAndDanger: Story<MenuProps> = (args) => {
  const [compact, setCompact] = useState(true);
  const [theme, setTheme] = useState('system');
  return (
    <Menu
      {...args}
      items={[
        {
          type: 'checkbox',
          value: 'compact',
          label: 'Compact density',
          checked: compact,
          closeOnSelect: false,
          onCheckedChange: setCompact,
        },
        {
          type: 'group',
          label: 'Theme',
          items: ['light', 'dark', 'system'].map((value) => ({
            type: 'radio' as const,
            value,
            label: value,
            checked: theme === value,
            onCheckedChange: () => setTheme(value),
          })),
        },
        { type: 'separator' },
        {
          value: 'delete',
          label: 'Delete account',
          tone: 'danger',
        },
      ]}
    />
  );
};

/**
 * No `trigger`: the menu opens from the `J` key or the external button, sits
 * under the status bar through `getAnchorRect`, and Escape hands focus back
 * to whatever had it before it opened.
 */
export const WithoutTrigger: Story<MenuProps> = (args) => {
  const [open, setOpen] = useState(Boolean(args.defaultOpen));
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('input, textarea, [contenteditable]')) return;
      if (event.key.toLowerCase() === 'j' && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div>
      <Card ref={barRef}>
        <Card.Body
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--manti-space-3)',
          }}
        >
          <Text as="span" size="sm" emphasis="muted">
            <Text as="span" size="sm/medium">
              Jobs
            </Text>{' '}
            · press <Kbd>J</Kbd> anywhere, or use the button.
          </Text>
          <Button variant="secondary" onClick={() => setOpen(true)}>
            Open jobs menu
          </Button>
        </Card.Body>
      </Card>
      <Menu
        {...args}
        trigger={undefined}
        ariaLabel="Jobs"
        open={open}
        onOpenChange={setOpen}
        getAnchorRect={() => barRef.current?.getBoundingClientRect() ?? null}
      />
    </div>
  );
};
WithoutTrigger.args = { defaultOpen: true };
WithoutTrigger.meta = { layout: 'padded' };

/**
 * A Menu inside the app's own native `<dialog>`, opened with `showModal()`.
 * The dialog sits in the top layer and makes everything outside it inert, so a
 * menu portalled to `document.body` would paint under it and ignore input.
 * `PortalContainerProvider` points every Manti overlay below it at the dialog,
 * so the menu mounts inside the top layer and takes pointer and keyboard input.
 */
export const InsideNativeDialog: Story<MenuProps> = (args) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <div>
      <Button
        variant="secondary"
        onClick={() => dialogRef.current?.showModal()}
      >
        Open native dialog
      </Button>
      <dialog
        ref={dialogRef}
        aria-label="Order"
        style={{
          padding: 0,
          border: 'none',
          background: 'transparent',
          color: 'var(--manti-text)',
          // The menu positions inside the dialog; let it overflow the box.
          overflow: 'visible',
        }}
      >
        <PortalContainerProvider container={dialogRef}>
          <Card>
            <Card.Body
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 'var(--manti-space-3)',
              }}
            >
              <Text size="sm" emphasis="muted">
                This dialog is in the top layer. The menu mounts inside it.
              </Text>
              <Menu {...args} />
              <Button
                variant="tertiary"
                onClick={() => dialogRef.current?.close()}
              >
                Close
              </Button>
            </Card.Body>
          </Card>
        </PortalContainerProvider>
      </dialog>
    </div>
  );
};
