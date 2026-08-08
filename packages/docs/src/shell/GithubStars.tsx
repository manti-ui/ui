import { useEffect, useState } from 'react';
import { Button } from '@manti-ui/react';

import { GITHUB_API_URL, GITHUB_REPO, GITHUB_URL } from '../data/navigation';
import { GithubIcon } from './icons';

/** `1234` → `1.2k`. Counts below 1000 stay exact. */
function formatStars(count: number): string {
  if (count < 1000) return String(count);
  return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k`;
}

/**
 * Repository link in the header. The star count is fetched client-side (the
 * docs are prerendered, so a build-time value would freeze at deploy time) and
 * simply stays absent if the unauthenticated API call is rate-limited or
 * offline — the link itself always renders.
 */
export function GithubStars() {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch(GITHUB_API_URL, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { stargazers_count?: number } | null) => {
        if (typeof data?.stargazers_count === 'number') {
          setStars(data.stargazers_count);
        }
      })
      .catch(() => {
        /* rate-limited or offline — render the bare link */
      });
    return () => controller.abort();
  }, []);

  return (
    <Button
      as="a"
      href={GITHUB_URL}
      target="_blank"
      rel="noreferrer"
      variant="tertiary"
      size="sm"
      iconOnly={stars === null}
      leadingIcon={GithubIcon}
      className="docs-nav-outbound"
      aria-label={
        stars === null
          ? `${GITHUB_REPO} on GitHub`
          : `${GITHUB_REPO} on GitHub — ${stars} stars`
      }
    >
      {stars !== null && (
        <span className="docs-nav-github-stars" aria-hidden="true">
          {formatStars(stars)}
        </span>
      )}
    </Button>
  );
}
