import type { Meta, StoryObj } from '@storybook/react-vite';

import { createToaster } from './Toast';
import { Button } from '../Button/Button';

const { toaster, Toaster } = createToaster({ placement: 'bottom-end' });

const meta = {
  title: 'Components/Toast',
  component: Toaster,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      <Button
        onClick={() =>
          toaster.create({
            title: 'Mantı boiling',
            description: 'They float when they are ready — about four minutes.',
          })
        }
      >
        Default
      </Button>
      <Button
        tone="success"
        onClick={() =>
          toaster.success({
            title: 'Saved',
            description: 'Your recipe is in the cookbook.',
          })
        }
      >
        Success
      </Button>
      <Button
        tone="danger"
        onClick={() =>
          toaster.error({
            title: 'Dough too dry',
            description: 'Add a splash of water and knead again.',
          })
        }
      >
        Error
      </Button>
      <Button
        tone="info"
        onClick={() =>
          toaster.info({ title: 'Tip', description: 'Rest the dough first.' })
        }
      >
        Info
      </Button>
      <Toaster />
    </div>
  ),
};
