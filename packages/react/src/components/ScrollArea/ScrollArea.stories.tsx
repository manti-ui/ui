import type { Meta, StoryObj } from '@storybook/react-vite';

import { ScrollArea } from './ScrollArea';
import { Badge } from '../Badge/Badge';
import { Card } from '../Card/Card';

const paragraphs = [
  'Mantı is a family of dumplings found from Central Asia to Anatolia. The Turkish kind is tiny — squares of thin dough pinched around a pinch of spiced lamb or beef, then boiled.',
  'They are served under a generous spoon of garlic yogurt and a drizzle of melted butter bloomed with Aleppo pepper and dried mint.',
  'Rolling them small is a point of pride: the saying goes that a good cook makes mantı small enough that forty fit on a single spoon.',
  'Across regions the shape shifts — boat-shaped and steamed, folded into purses, or left open at the top — but the yogurt-and-butter finish is the throughline.',
  'Freeze them raw on a floured tray, then bag them; they cook straight from frozen with just an extra minute in the pot.',
  'A bowl of mantı is rarely a quiet affair — it is a dish made in batches, by many hands, for a full table.',
];

const Prose = () => (
  <div
    style={{
      display: 'grid',
      gap: '0.75rem',
      padding: '1rem',
      color: 'var(--manti-text-muted)',
      fontSize: 'var(--manti-text-sm)',
      lineHeight: 'var(--manti-leading-normal)',
    }}
  >
    {paragraphs.map((p, i) => (
      <p key={i} style={{ margin: 0 }}>
        {p}
      </p>
    ))}
  </div>
);

const meta = {
  title: 'Components/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    orientation: 'vertical',
    type: 'auto',
    focusable: true,
    style: { height: '14rem', width: '22rem' },
    children: <Prose />,
  },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['vertical', 'horizontal', 'both'],
    },
    type: { control: 'inline-radio', options: ['auto', 'hover', 'always'] },
  },
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const InsideCard: Story = {
  render: () => (
    <Card style={{ width: '24rem' }}>
      <h3 style={{ margin: '0 0 0.5rem', fontSize: 'var(--manti-text-lg)' }}>
        About mantı
      </h3>
      <ScrollArea style={{ height: '10rem' }}>
        <div
          style={{
            display: 'grid',
            gap: '0.75rem',
            paddingRight: '0.75rem',
            color: 'var(--manti-text-muted)',
            fontSize: 'var(--manti-text-sm)',
            lineHeight: 'var(--manti-leading-normal)',
          }}
        >
          {paragraphs.map((p, i) => (
            <p key={i} style={{ margin: 0 }}>
              {p}
            </p>
          ))}
        </div>
      </ScrollArea>
    </Card>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <ScrollArea orientation="horizontal" style={{ width: '22rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem' }}>
        {Array.from({ length: 16 }, (_, i) => (
          <Badge key={i} tone="neutral" variant="soft">
            Tag {i + 1}
          </Badge>
        ))}
      </div>
    </ScrollArea>
  ),
};
