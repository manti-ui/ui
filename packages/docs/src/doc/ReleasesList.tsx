import { Link } from 'react-router-dom';

import { pages } from '../pages';

// Release pages live in the Changelog group (excluding the /changelog overview),
// already sorted newest-first by their `order`.
const releases = pages.filter(
  (page) => page.group === 'Changelog' && page.slug !== '/changelog',
);

/**
 * The releases overview: a plain stacked list (not cards). Each row is a link to
 * that version's notes, with a subtle hover.
 */
export function ReleasesList() {
  return (
    <div className="docs-releases">
      {releases.map((release) => (
        <Link key={release.slug} to={release.slug} className="docs-release">
          <span className="docs-release-title">
            {release.title}
            {release.date && (
              <span className="docs-release-date"> — {release.date}</span>
            )}
          </span>
          {release.description && (
            <span className="docs-release-summary">{release.description}</span>
          )}
        </Link>
      ))}
    </div>
  );
}
