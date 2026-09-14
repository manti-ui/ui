import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Heading,
  Input,
  Progress,
  Select,
  Switch,
  Text,
} from '@manti-ui/react';

import { Oklava } from './Oklava';

/**
 * The devtools panel, over a page of ordinary Manti components.
 *
 * Everything below the panel is a normal app surface, which is the point: open
 * the panel, move a knob, and the surface re-skins because the override lands on
 * `:root`, not on anything the panel owns.
 */
const meta = {
  title: 'Devtools/Oklava',
  component: Oklava,
  parameters: { layout: 'fullscreen' },
  args: { defaultOpen: true, storageKey: false },
  argTypes: {
    storageKey: { control: false },
  },
  render: (args) => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--manti-space-5)',
        padding: 'var(--manti-space-6)',
        minHeight: '100vh',
      }}
    >
      <Heading level={1} size="2xl">
        A page to theme
      </Heading>
      <Text emphasis="muted">
        Open the panel and move any knob. Nothing on this page knows Oklava
        exists.
      </Text>

      <div
        style={{
          display: 'flex',
          gap: 'var(--manti-space-3)',
          flexWrap: 'wrap',
        }}
      >
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="tertiary">Tertiary</Button>
        <Button variant="success">Success</Button>
        <Button variant="danger">Danger</Button>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 'var(--manti-space-3)',
          flexWrap: 'wrap',
        }}
      >
        <Badge variant="primary">Primary</Badge>
        <Badge variant="info">Info</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="danger">Danger</Badge>
      </div>

      <Card style={{ maxWidth: '32rem' }}>
        <Card.Header>
          <Card.Title>Settings</Card.Title>
          <Card.Description>
            Ordinary form controls, reading ordinary tokens.
          </Card.Description>
        </Card.Header>
        <Card.Body
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--manti-space-4)',
          }}
        >
          <Input label="Workspace name" defaultValue="Manti" />
          <Select
            label="Region"
            items={[
              { value: 'eu', label: 'Europe' },
              { value: 'us', label: 'North America' },
            ]}
            defaultValue={['eu']}
          />
          <Checkbox defaultChecked>Email me about releases</Checkbox>
          <Switch>Public workspace</Switch>
          <Progress value={62} label="Storage used" />
        </Card.Body>
      </Card>

      <Oklava {...args} />
    </div>
  ),
} satisfies Meta<typeof Oklava>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Closed on load, which is how a real app renders it. */
export const Launcher: Story = {
  args: { defaultOpen: false },
};

/** Without the Google Fonts catalogue: the five built-in stacks alone. */
export const BuiltInFontsOnly: Story = {
  args: { googleFonts: false },
};
