import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Card } from './Card';

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { elevated: false, interactive: false },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => (
    <Card {...args}>
      <Card.Header>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Card.Title>Kayseri Mantısı</Card.Title>
          <Badge variant="primary" dot>
            Fresh
          </Badge>
        </div>
        <Card.Description>
          Tiny dumplings, garlic yogurt, paprika butter.
        </Card.Description>
      </Card.Header>
      <Card.Body>
        Hand-folded four-corner parcels, simmered until tender and finished with
        a smooth drizzle of warm chili oil.
      </Card.Body>
      <Card.Footer>
        <Button size="sm">Cook now</Button>
        <Button size="sm" variant="tertiary">
          Save
        </Button>
      </Card.Footer>
    </Card>
  ),
};

export const Elevated: Story = {
  args: { elevated: true },
  render: Basic.render,
};

export const Interactive: Story = {
  args: { interactive: true },
  render: (args) => (
    <Card {...args} tabIndex={0}>
      <Card.Body>
        <Card.Title>Hover me</Card.Title>
        <p style={{ marginTop: 8, color: 'var(--manti-text-muted)' }}>
          The whole surface lifts smoothly on hover and focus.
        </p>
      </Card.Body>
    </Card>
  ),
};
