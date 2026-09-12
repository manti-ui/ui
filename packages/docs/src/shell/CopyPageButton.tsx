import { useState } from 'react';
import { Button } from '@manti-ui/react';

export function CopyPageButton({ source }: { source: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(source);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* Clipboard permissions are optional; the page remains usable. */
    }
  }

  return (
    <Button variant="secondary" size="sm" onClick={copy} aria-label="Copy page content">
      {copied ? 'Copied' : 'Copy page'}
    </Button>
  );
}
