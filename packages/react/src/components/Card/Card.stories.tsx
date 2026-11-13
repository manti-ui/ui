import type { Story, StoryDefault } from '@ladle/react';

import { Badge } from '../Badge/Badge.js';
import { Button } from '../Button/Button.js';
import { Card } from './Card.js';
import type { CardProps } from './Card.js';
import { Text } from '../Text/Text.js';

export default {
  title: 'Components/Card',
  args: { elevated: false, interactive: false },
  decorators: [
    (Component) => (
      <div style={{ width: 360 }}>
        <Component />
      </div>
    ),
  ],
  meta: { layout: 'centered' },
} satisfies StoryDefault<CardProps>;

export const Basic: Story<CardProps> = (args) => (
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
      Hand-folded four-corner parcels, simmered until tender and finished with a
      smooth drizzle of warm chili oil.
    </Card.Body>
    <Card.Footer>
      <Button size="sm">Cook now</Button>
      <Button size="sm" variant="tertiary">
        Save
      </Button>
    </Card.Footer>
  </Card>
);

export const Elevated: Story<CardProps> = (args) => <Basic {...args} />;
Elevated.args = { elevated: true };

export const Interactive: Story<CardProps> = (args) => (
  <Card {...args} tabIndex={0}>
    <Card.Body>
      <Card.Title>Hover me</Card.Title>
      <Text emphasis="muted" style={{ marginTop: 'var(--manti-space-2)' }}>
        The whole surface lifts smoothly on hover and focus.
      </Text>
    </Card.Body>
  </Card>
);
Interactive.args = { interactive: true };
