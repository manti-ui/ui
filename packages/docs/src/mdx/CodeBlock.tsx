import { useRef, useState } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import { Button } from '@manti-ui/react';

/**
 * `pre` override for MDX. The rehype-shiki plugin already produced the colored
 * `<pre class="shiki">`; this only adds a hover copy button around it.
 */
export function CodeBlock(props: ComponentPropsWithoutRef<'pre'>) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  async function copy() {
    const text = ref.current?.innerText ?? '';
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="docs-codeblock">
      <div className="docs-copy">
        <Button
          variant="soft"
          tone="neutral"
          size="sm"
          onClick={copy}
          aria-label="Copy code"
        >
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
      <pre {...props} ref={ref} />
    </div>
  );
}
