import { useMemo, useState } from 'react';
import {
  Button,
  Dialog,
  Tabs,
  Text,
  Textarea,
  useClipboard,
} from '@manti-ui/react';

import { buildAgentPrompt } from './theme/agentPrompt';
import { coerce } from './theme/apply';
import { buildThemeStylesheet } from './theme/css';
import { useOklavaTheme } from './theme/store';

/**
 * The hand-off surface: the theme as CSS, as an agent brief, or as JSON.
 *
 * The CSS shown here is exactly what the app is running. The same builder feeds
 * the injected `<style>`, so "looks right in the panel" and "looks right once I
 * paste it" cannot drift.
 */

const CopyIcon = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    aria-hidden="true"
  >
    <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
    <path d="M10.5 5.5V4A1.5 1.5 0 0 0 9 2.5H4A1.5 1.5 0 0 0 2.5 4v5A1.5 1.5 0 0 0 4 10.5h1.5" />
  </svg>
);

const CheckIcon = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3.5 8.5l3 3 6-7" />
  </svg>
);

function CopyButton({ value, label }: { value: string; label: string }) {
  const { copied, copy } = useClipboard({ value });
  return (
    <Button
      variant={copied ? 'success' : 'primary'}
      size="sm"
      leadingIcon={copied ? CheckIcon : CopyIcon}
      onClick={copy}
    >
      {copied ? 'Copied' : label}
    </Button>
  );
}

interface CodePanelProps {
  description: string;
  value: string;
  copyLabel: string;
  language?: string;
  children?: React.ReactNode;
}

function CodePanel({
  description,
  value,
  copyLabel,
  language,
  children,
}: CodePanelProps) {
  return (
    <div className="oklava-export-panel">
      <div className="oklava-export-bar">
        <Text size="xs" emphasis="subtle">
          {description}
        </Text>
        <CopyButton value={value} label={copyLabel} />
      </div>
      <pre className="oklava-export-code" data-language={language}>
        <code>{value}</code>
      </pre>
      {children}
    </div>
  );
}

/**
 * Paste a theme back in. This is what replaces the studio's share links: a host
 * app's URL is not Oklava's to rewrite, but a theme still has to be able to
 * travel between two people.
 */
function ImportRow() {
  const { set } = useOklavaTheme();
  const [draft, setDraft] = useState('');
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="oklava-import">
      <Textarea
        label="Paste a theme"
        rows={3}
        value={draft}
        placeholder='{ "preset": "ocean", … }'
        error={error ?? undefined}
        onChange={(event) => {
          setDraft(event.target.value);
          setError(null);
        }}
      />
      <Button
        variant="secondary"
        size="sm"
        disabled={!draft.trim()}
        onClick={() => {
          try {
            set(coerce(JSON.parse(draft)));
            setDraft('');
          } catch {
            setError('That is not valid JSON.');
          }
        }}
      >
        Apply
      </Button>
    </div>
  );
}

export interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Path the agent prompt tells an agent to write. */
  themeFile?: string;
}

export function ExportDialog({
  open,
  onOpenChange,
  themeFile,
}: ExportDialogProps) {
  const { config } = useOklavaTheme();
  const [tab, setTab] = useState('css');

  const css = useMemo(() => buildThemeStylesheet(config), [config]);
  const prompt = useMemo(
    () => buildAgentPrompt(config, { themeFile }),
    [config, themeFile],
  );
  const json = useMemo(() => JSON.stringify(config, null, 2), [config]);

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      title="Take your theme with you"
      description="Every knob in the panel is a public token override. Nothing here is devtool-only."
      className="oklava-export"
      footer={({ close }) => (
        <>
          <Text size="xs" emphasis="subtle" className="oklava-export-note">
            Import the CSS after <code>@manti-ui/styles/index.css</code>,
            outside any cascade layer.
          </Text>
          <Button variant="tertiary" onClick={close}>
            Close
          </Button>
        </>
      )}
    >
      <Tabs
        variant="pill"
        size="sm"
        value={tab}
        onValueChange={setTab}
        items={[
          {
            value: 'css',
            label: 'CSS tokens',
            content: (
              <CodePanel
                description="Drop this into your stylesheet. It is the CSS this app is running."
                value={css}
                copyLabel="Copy CSS"
                language="css"
              />
            ),
          },
          {
            value: 'prompt',
            label: 'AI prompt',
            content: (
              <CodePanel
                description="Paste into Claude Code, Cursor, or any agent working in this repo, and it will apply the theme for you."
                value={prompt}
                copyLabel="Copy prompt"
                language="markdown"
              />
            ),
          },
          {
            value: 'json',
            label: 'JSON',
            content: (
              <CodePanel
                description="The raw panel state, for storing a theme in your own tooling."
                value={json}
                copyLabel="Copy JSON"
                language="json"
              >
                <ImportRow />
              </CodePanel>
            ),
          },
        ]}
      />
    </Dialog>
  );
}
