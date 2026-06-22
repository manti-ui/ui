import { Badge, Marquee } from '@manti-ui/react';

const tags = [
  'Framework-agnostic',
  'Zag.js machines',
  'Design tokens',
  'light-dark()',
  'Monochrome',
  'Accessible',
];

export default function MarqueeBasic() {
  return (
    <Marquee>
      {tags.map((t) => (
        <Badge key={t} tone="neutral" variant="soft">
          {t}
        </Badge>
      ))}
    </Marquee>
  );
}
