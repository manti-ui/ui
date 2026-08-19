import { Link } from 'react-router-dom';
import { Card } from '@manti-ui/react';

const foundations = [
  {
    slug: '/foundations/design-signature',
    title: 'Design signature',
    description:
      'The neutral panel material and calm interaction style behind Mantı UI.',
  },
  {
    slug: '/foundations/color-and-tones',
    title: 'Color & variants',
    description:
      'Color ramps, semantic roles, component states, and variants.',
  },
  {
    slug: '/foundations/tokens',
    title: 'Design tokens',
    description:
      'The primitive, semantic, and component tokens that shape the system.',
  },
  {
    slug: '/foundations/motion',
    title: 'Motion',
    description:
      'Motion levels, duration tokens, easing curves, and reduced-motion behavior.',
  },
  {
    slug: '/foundations/architecture',
    title: 'Architecture',
    description:
      'How tokens, CSS, behavior, and React rendering stay separated.',
  },
] as const;

export function FoundationsGrid() {
  return (
    <div className="docs-card-grid">
      {foundations.map((item) => (
        <Link key={item.slug} to={item.slug} className="docs-plain">
          <Card interactive>
            <Card.Body>
              <Card.Title>{item.title}</Card.Title>
              <Card.Description>{item.description}</Card.Description>
            </Card.Body>
          </Card>
        </Link>
      ))}
    </div>
  );
}
