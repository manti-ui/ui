import { useEffect } from 'react';
import type { CSSProperties } from 'react';
import type { Story, StoryDefault } from '@ladle/react';

import { Alert } from '../components/Alert/Alert.js';
import { Badge } from '../components/Badge/Badge.js';
import { Button } from '../components/Button/Button.js';
import { Card } from '../components/Card/Card.js';
import { Code } from '../components/Code/Code.js';
import { DataTable } from '../components/DataTable/DataTable.js';
import type { DataTableColumn } from '../components/DataTable/DataTable.js';
import { Dialog } from '../components/Dialog/Dialog.js';
import { Heading } from '../components/Heading/Heading.js';
import { Popover } from '../components/Popover/Popover.js';
import { Steps } from '../components/Steps/Steps.js';
import { Text } from '../components/Text/Text.js';

/**
 * `--manti-font-display` is the face of Heading and every component title
 * part. It defaults to the text face; this story sets it on the document root,
 * where a theme would, so portalled titles (the open Popover here) follow too.
 */
const FACES = {
  text: null,
  serif: "ui-serif, Georgia, 'Times New Roman', serif",
  // A sans that differs from the text face on macOS, Windows and Linux
  // (Adwaita) hosts alike, so a capture shows the switch wherever it renders.
  grotesk: "'Helvetica Neue', Helvetica, Arial, 'Adwaita Sans', sans-serif",
  mono: 'var(--manti-font-mono)',
} as const;

type Face = keyof typeof FACES;

interface DisplayFaceProps {
  face: Face;
}

export default {
  title: 'Foundations/Display face',
  args: { face: 'serif' },
  argTypes: {
    face: {
      name: '--manti-font-display',
      control: { type: 'select' },
      options: Object.keys(FACES),
    },
  },
  meta: { layout: 'padded' },
} satisfies StoryDefault<DisplayFaceProps>;

const useDisplayFace = (face: Face) => {
  useEffect(() => {
    const value = FACES[face];
    const root = document.documentElement;
    if (value === null) return;
    root.style.setProperty('--manti-font-display', value);
    return () => {
      root.style.removeProperty('--manti-font-display');
    };
  }, [face]);
};

const stack: CSSProperties = { display: 'grid', gap: 'var(--manti-space-6)' };

const row: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(18rem, 1fr))',
  gap: 'var(--manti-space-6)',
  alignItems: 'start',
};

interface Dish {
  name: string;
  region: string;
  minutes: number;
}

const dishes: Dish[] = [
  { name: 'Kayseri mantısı', region: 'Central Anatolia', minutes: 90 },
  { name: 'Boşnak mantısı', region: 'Balkans', minutes: 60 },
  { name: 'Tatar böreği', region: 'Eskişehir', minutes: 75 },
];

const columns: DataTableColumn<Dish>[] = [
  { accessorKey: 'name', header: 'Dish' },
  { accessorKey: 'region', header: 'Region' },
  { accessorKey: 'minutes', header: 'Minutes', meta: { align: 'end' } },
];

const steps = [
  { title: 'Dough', description: 'Knead and rest' },
  { title: 'Fill', description: 'Spoon and fold' },
  { title: 'Steam', description: 'Cook through' },
];

/**
 * Every title surface on one page. Switch `--manti-font-display` to compare:
 * headings and titles change face, body copy stays on the text face.
 */
export const Showcase: Story<DisplayFaceProps> = ({ face }) => {
  useDisplayFace(face);
  return (
    <div style={stack}>
      <div style={{ display: 'grid', gap: 'var(--manti-space-2)' }}>
        <Heading level={1}>A display face for titles</Heading>
        <Text emphasis="muted">
          Body copy stays on <Code>--manti-font-sans</Code>; headings and
          component titles read <Code>--manti-font-display</Code>.
        </Text>
      </div>
      <div style={{ display: 'grid', gap: 'var(--manti-space-2)' }}>
        <Heading level={2}>Level 2 heading</Heading>
        <Heading level={3}>Level 3 heading</Heading>
        <Heading level={4}>Level 4 heading</Heading>
      </div>
      <div style={row}>
        <Card>
          <Card.Header>
            <Card.Title>Kayseri mantısı</Card.Title>
            <Card.Description>
              Tiny dumplings, garlic yogurt, paprika butter.
            </Card.Description>
          </Card.Header>
          <Card.Body>
            Hand-folded four-corner parcels, simmered until tender.
          </Card.Body>
          <Card.Footer>
            <Badge variant="primary" dot>
              Fresh
            </Badge>
          </Card.Footer>
        </Card>
        <div style={{ display: 'grid', gap: 'var(--manti-space-6)' }}>
          <Alert variant="info" title="Dough is resting">
            Give it 30 minutes before you start rolling.
          </Alert>
          <Steps items={steps} defaultStep={1} />
        </div>
      </div>
      <DataTable<Dish> title="Dishes" columns={columns} data={dishes} />
      <div style={{ paddingBlockEnd: 'var(--manti-space-16)' }}>
        <Popover
          defaultOpen
          placement="bottom-start"
          title="Popover title"
          trigger={<Button variant="secondary">Tips</Button>}
        >
          Popover body copy stays on the text face.
        </Popover>
      </div>
    </div>
  );
};

/**
 * A modal title: the Dialog portals out of the story, so its title follows
 * `--manti-font-display` only because the token is set on the document root.
 */
export const DialogTitle: Story<DisplayFaceProps> = ({ face }) => {
  useDisplayFace(face);
  return (
    <Dialog
      defaultOpen
      title="Steam the dumplings"
      description="The title reads the display face; this copy stays on the text face."
      trigger={<Button>Open dialog</Button>}
      footer={({ close }) => <Button onClick={close}>Done</Button>}
    >
      <Text>Twelve minutes over a rolling boil, lid on.</Text>
    </Dialog>
  );
};
