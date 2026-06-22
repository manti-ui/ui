import { Badge, Marquee } from '@manti-ui/react';

const tags = [
  'Framework-agnostic',
  'Zag.js machines',
  'Design tokens',
  'Monochrome',
  'Accessible',
];

const Tags = () => (
  <>
    {tags.map((t) => (
      <Badge key={t} tone="neutral" variant="soft">
        {t}
      </Badge>
    ))}
  </>
);

export default function MarqueeDirections() {
  return (
    <div style={{ display: 'grid', gap: 'var(--manti-space-6)' }}>
      <Marquee direction="left">
        <Tags />
      </Marquee>
      <Marquee direction="right">
        <Tags />
      </Marquee>
    </div>
  );
}
