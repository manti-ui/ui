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
                {item.documented ? (
                  <span className="docs-card-arrow" aria-hidden="true">
                    <svg viewBox="0 0 16 16" focusable="false">
                      <path
                        d="M3 8h9M8 4l4 4-4 4"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </span>
                ) : (
                  <Badge variant="secondary">Storybook</Badge>
                )}
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
          <Link key={item.key} to={item.slug} className="docs-plain">
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
