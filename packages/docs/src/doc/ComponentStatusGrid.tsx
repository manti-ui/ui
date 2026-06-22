import { Link } from 'react-router-dom';
import { Badge, Card } from '@manti-ui/react';

import { componentCatalog } from '../data/componentMeta';
import { STORYBOOK_URL } from '../data/navigation';

/** The whole-library overview grid, with a docs/Storybook status per component. */
export function ComponentStatusGrid() {
  return (
    <div className="docs-card-grid">
      {componentCatalog.map((item) => {
        const card = (
          <Card interactive>
            <Card.Body>
              <div
                className="docs-cluster"
                style={{ justifyContent: 'space-between' }}
              >
                <strong>{item.name}</strong>
                <Badge
                  tone={item.documented ? 'success' : 'neutral'}
                  variant="soft"
                >
                  {item.documented ? 'Docs' : 'Storybook'}
                </Badge>
              </div>
              <p
                style={{
                  color: 'var(--manti-text-muted)',
                  marginTop: 'var(--manti-space-2)',
                  marginBottom: 0,
                }}
              >
                {item.summary}
              </p>
            </Card.Body>
          </Card>
        );

        return item.documented ? (
          <Link
            key={item.key}
            to={`/components/${item.key}`}
            className="docs-plain"
          >
            {card}
          </Link>
        ) : (
          <a
            key={item.key}
            href={STORYBOOK_URL}
            target="_blank"
            rel="noreferrer"
            className="docs-plain"
          >
            {card}
          </a>
        );
      })}
    </div>
  );
}
