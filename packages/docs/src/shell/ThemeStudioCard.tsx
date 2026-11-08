import { Text } from '@manti-ui/react';

import { STUDIO_URL } from '../data/navigation';
import { ExternalIcon } from './icons';

/**
 * Right-rail doorway to the Theme Studio, sitting under the palette playground
 * that shares its "Make it yours" heading: the playground is the quick pass
 * over a primary scale and a neutral gray, the studio is the full instrument.
 *
 * The studio itself is a separate app on its own subdomain (see
 * `manti-ui/studio`), so this is a plain outbound link: the docs carry no copy
 * of the theming machinery. The swatches are the shipped variants' solid fills,
 * step 9 of each Radix scale, not the visitor's: a theme built over there does
 * not follow them back here.
 */

const SWATCHES = [
  'var(--manti-orange-9)',
  'var(--manti-gray-9)',
  'var(--manti-green-9)',
  'var(--manti-blue-9)',
];

export function ThemeStudioCard() {
  return (
    <section className="docs-theme-cta" aria-label="Theme studio">
      <Text className="docs-theme-group-label">Advanced</Text>
      <a
        href={STUDIO_URL}
        target="_blank"
        rel="noreferrer"
        className="docs-theme-cta-link"
      >
        <span className="docs-theme-cta-copy">
          <strong>Theme Studio</strong>
          <span className="docs-theme-cta-external">{ExternalIcon}</span>
        </span>
        <span className="docs-theme-cta-swatches" aria-hidden="true">
          {SWATCHES.map((color) => (
            <i key={color} style={{ background: color }} />
          ))}
        </span>
      </a>
    </section>
  );
}
