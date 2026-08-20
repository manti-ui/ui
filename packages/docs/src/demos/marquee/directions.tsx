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
      <Badge key={t} variant="secondary">
        {t}
      </Badge>
    ))}
  </>
);

export default function MarqueeDirections() {
  return (
    <div className="marquee-grid">
      <Marquee direction="left">
        <Tags />
      </Marquee>
      <Marquee direction="right">
        <Tags />
      </Marquee>
    </div>
  );
}
