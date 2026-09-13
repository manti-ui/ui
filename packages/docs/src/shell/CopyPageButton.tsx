import { useState } from 'react';
import { Button } from '@manti-ui/react';

import { buildPageMarkdown } from '../doc/pageMarkdown';
import type { DocPage } from '../pages';

/**
 * Copies the page as Markdown, for pasting into an AI assistant.
 *
 * It copies the resolved page rather than its MDX source: the examples, props,
 * anatomy and tokens are React tags on the page, and an assistant handed
 * `<PropsTable component="button" />` has been told nothing about Button.
 * See `doc/pageMarkdown.ts`.
 */
export function CopyPageButton({ page }: { page: DocPage }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(buildPageMarkdown(page));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* Clipboard permissions are optional; the page remains usable. */
    }
  }

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={copy}
      aria-label="Copy this page as Markdown for an AI assistant"
    >
      {copied ? 'Copied' : 'Copy page'}
    </Button>
  );
}
