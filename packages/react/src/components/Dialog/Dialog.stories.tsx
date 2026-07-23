import type { Meta, StoryObj } from '@storybook/react-vite';

import { Dialog } from './Dialog';
import { Button } from '../Button/Button';

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    title: 'Freeze a batch?',
    description:
      'Raw mantı freeze beautifully. Lay them on a floured tray, freeze solid, then bag them.',
    size: 'md',
    trigger: <Button variant="$1">Open dialog</Button>,
    children:
      'They keep for up to three months and cook straight from frozen — just add a minute to the boil.',
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    footer: ({ close }) => (
      <>
        <Button variant="tertiary" onClick={close}>
          Cancel
        </Button>
        <Button variant="$1" onClick={close}>
          Freeze them
        </Button>
      </>
    ),
  },
};

export const AlertDialog: Story = {
  args: {
    role: 'alertdialog',
    title: 'Discard this filling?',
    description: 'Your unsaved recipe changes will be lost.',
    size: 'sm',
    trigger: <Button variant="$1">Discard</Button>,
    children: null,
    footer: ({ close }) => (
      <>
        <Button variant="tertiary" onClick={close}>
          Keep editing
        </Button>
        <Button variant="$1" onClick={close}>
          Discard
        </Button>
      </>
    ),
  },
};
