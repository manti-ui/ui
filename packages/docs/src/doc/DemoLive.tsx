import { useContext, useId, useRef, useState } from 'react';
import * as React from 'react';
import type { ReactNode } from 'react';
import * as manti from '@manti-ui/react';
import { Alert, Button } from '@manti-ui/react';
import { LiveContext, LiveEditor, LiveProvider, LivePreview } from 'react-live';
import { Highlight, Prism } from 'prism-react-renderer';
import type { PrismTheme } from 'prism-react-renderer';

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
  /** Optional plain-CSS source shown in the CSS code subtab. */
  cssSource?: string;
  /** The copy-ready component stylesheet filename shown by the CSS subtab. */
  cssFileName: string;
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
export default function DemoLive({
  source,
  cssSource,
  cssFileName,
  canvasClass,
  bar,
}: DemoLiveProps) {
  const [code, setCode] = useState(source);
  const [cssCode, setCssCode] = useState(cssSource ?? '');
  const [codeTab, setCodeTab] = useState<'tsx' | 'css'>('tsx');
  const { theme } = useTheme();
  const cssTabId = useId();
  const codeEdited = code.trim() !== source.trim();
  const cssEdited = cssSource != null && cssCode.trim() !== cssSource.trim();
  const showingCss = codeTab === 'css' && cssSource != null;
  const copyCode = showingCss ? cssCode : code;

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
      {cssSource && <style data-component-css="true">{cssCode}</style>}
      <div className={canvasClass}>
        {/* `display: contents` on the preview wrapper (see docs.css) hoists the
            demo's own elements up to be direct flex children of the canvas, so
            the open (editable) preview lays out identically to the closed one —
            same gap, wrapping, and centering. Without it, react-live's wrapper
            div becomes the single flex child and the demo loses the canvas grid. */}
        <LivePreview className="docs-live-preview" />
      </div>
      <LiveErrorPanel />
      {bar}
      <div className="docs-codeblock docs-live">
        {cssSource && (
          <div
            className="docs-live-tabs"
            role="tablist"
            aria-label="Code files"
          >
            <button
              id={`${cssTabId}-tsx`}
              type="button"
              role="tab"
              aria-selected={codeTab === 'tsx'}
              aria-controls={`${cssTabId}-tsx-panel`}
              tabIndex={codeTab === 'tsx' ? 0 : -1}
              onClick={() => setCodeTab('tsx')}
            >
              Component.tsx
            </button>
            <button
              id={`${cssTabId}-css`}
              type="button"
              role="tab"
              aria-selected={codeTab === 'css'}
              aria-controls={`${cssTabId}-css-panel`}
              tabIndex={codeTab === 'css' ? 0 : -1}
              onClick={() => setCodeTab('css')}
            >
              {cssFileName}
            </button>
          </div>
        )}
        <div className="docs-live-actions">
          {(showingCss ? cssEdited : codeEdited) && (
            <Button
              variant="tertiary"
              size="sm"
              onClick={() =>
                showingCss ? setCssCode(cssSource ?? '') : setCode(source)
              }
            >
              Reset
            </Button>
          )}
          <CopyButton code={copyCode} />
        </div>
        {showingCss ? (
          <div
            id={`${cssTabId}-css-panel`}
            className="docs-live-css"
            role="tabpanel"
            aria-labelledby={`${cssTabId}-css`}
          >
            <CssEditor
              code={cssCode}
              onChange={setCssCode}
              theme={livePrismThemes[theme]}
            />
          </div>
        ) : (
          <div
            id={`${cssTabId}-tsx-panel`}
            role="tabpanel"
            aria-labelledby={`${cssTabId}-tsx`}
          >
            <LiveEditor
              className="docs-live-editor"
              onChange={setCode}
              aria-label="Editable demo source"
            />
          </div>
        )}
      </div>
    </LiveProvider>
  );
}

interface CssEditorProps {
  code: string;
  onChange: (code: string) => void;
  theme: PrismTheme;
}

function CssEditor({ code, onChange, theme }: CssEditorProps) {
  const highlightRef = useRef<HTMLPreElement>(null);

  function syncScroll(event: React.UIEvent<HTMLTextAreaElement>) {
    const input = event.currentTarget;
    if (highlightRef.current) {
      highlightRef.current.style.transform = `translate(${-input.scrollLeft}px, ${-input.scrollTop}px)`;
    }
  }

  return (
    <div className="docs-live-css-editor">
      <Highlight prism={Prism} language="css" code={code} theme={theme}>
        {({ tokens, getLineProps, getTokenProps }) => (
          <pre
            ref={highlightRef}
            className="docs-live-css-highlight"
            aria-hidden="true"
          >
            {tokens.map((line, lineIndex) => (
              <span key={lineIndex} {...getLineProps({ line })}>
                {line
                  .filter((token) => !token.empty)
                  .map((token, tokenIndex) => (
                    <span key={tokenIndex} {...getTokenProps({ token })} />
                  ))}
                {'\n'}
              </span>
            ))}
          </pre>
        )}
      </Highlight>
      <textarea
        className="docs-live-css-input"
        value={code}
        onChange={(event) => onChange(event.target.value)}
        onScroll={syncScroll}
        aria-label="Editable CSS source"
        spellCheck={false}
        wrap="off"
      />
    </div>
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
      <Alert variant="danger" title="This code doesn’t run" role="alert">
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
      variant="secondary"
      size="sm"
      onClick={copy}
      aria-label="Copy demo source"
    >
      {copied ? 'Copied' : 'Copy'}
    </Button>
  );
}
