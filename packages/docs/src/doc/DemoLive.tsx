import { useContext, useState } from 'react';
import * as React from 'react';
import type { ReactNode } from 'react';
import * as manti from '@manti-ui/react';
import { Alert, Button } from '@manti-ui/react';
import { LiveContext, LiveEditor, LiveProvider, LivePreview } from 'react-live';

import { useTheme } from '../theme/useTheme';
import { toLiveCode } from './live-code';
import { livePrismThemes } from './live-theme';

/**
 * Keep only the namespace keys that can legally be a function parameter.
 *
 * react-live evaluates code by passing the scope's keys to `new Function` as parameter
 * names, so a key that is not a plain identifier is a syntax error at eval time — it takes
 * down every demo, not just the one that would have used it. Module namespaces ship two:
 * `default` (a reserved word) and, through CJS interop, a literal `module.exports`.
 *
 * The engine is asked the same question react-live will ask, rather than matching against
 * a hand-kept list of reserved words that React's namespace could outgrow. It runs once,
 * when this lazily-loaded chunk is first fetched.
 */
function bindable(namespace: object) {
  return Object.fromEntries(
    Object.entries(namespace).filter(([key]) => {
      try {
        new Function(key, '');
        return true;
      } catch {
        return false;
      }
    }),
  );
}

// What the demo code can reach without importing. `scope` is react-live's stand-in for
// the module system, so it has to cover exactly what the demo files import: every Manti
// export, plus React and its hooks. `React` itself is included for `React.*` access.
const scope = { React, ...bindable(React), ...bindable(manti) };

export interface DemoLiveProps {
  /** The demo's source, verbatim — imports and all. */
  source: string;
  /** Canvas classes computed by Demo, so the live preview sits where the static one did. */
  canvasClass: string;
  /** The framework switcher / hide-code row, rendered between preview and editor. */
  bar: ReactNode;
}

/**
 * The editable half of a Demo: the preview, any error, and the live editor, all bound to
 * one LiveProvider so a keystroke re-renders the component above.
 *
 * Loaded lazily by Demo — react-live carries a transpiler (sucrase) and a highlighter
 * (Prism), which no reader should pay for until they open the code.
 */
export default function DemoLive({ source, canvasClass, bar }: DemoLiveProps) {
  const [code, setCode] = useState(source);
  const { theme } = useTheme();
  const edited = code.trim() !== source.trim();

  return (
    <LiveProvider
      code={code}
      scope={scope}
      transformCode={toLiveCode}
      theme={livePrismThemes[theme]}
      noInline
      enableTypeScript
      language="tsx"
    >
      <div className={canvasClass}>
        <LivePreview />
      </div>
      <LiveErrorPanel />
      {bar}
      <div className="docs-codeblock docs-live">
        <div className="docs-live-actions">
          {edited && (
            <Button
              variant="ghost"
              tone="neutral"
              size="sm"
              onClick={() => setCode(source)}
            >
              Reset
            </Button>
          )}
          <CopyButton code={code} />
        </div>
        <LiveEditor
          className="docs-live-editor"
          onChange={setCode}
          aria-label="Editable demo source"
        />
      </div>
    </LiveProvider>
  );
}

/**
 * react-live ships `<LiveError />`, but it renders a bare `<pre>`. It is only a reader of
 * `context.error` — the boundary that catches a broken render lives in LivePreview — so
 * nothing is lost by reading the same context here and rendering the error as a Manti
 * Alert instead, above the code that caused it.
 */
function LiveErrorPanel() {
  const { error } = useContext(LiveContext);
  if (!error) return null;

  return (
    <div className="docs-live-error">
      <Alert tone="danger" title="This code doesn’t run" role="alert">
        <pre className="docs-live-error-text">{error}</pre>
      </Alert>
    </div>
  );
}

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <Button
      variant="soft"
      tone="neutral"
      size="sm"
      onClick={copy}
      aria-label="Copy demo source"
    >
      {copied ? 'Copied' : 'Copy'}
    </Button>
  );
}
