import { Badge, Button, Input, Progress } from '@manti-ui/react';
import { presets } from '@manti-ui/tokens';

import { STUDIO_URL } from '../data/navigation';

/**
 * The shipped presets, each previewed under its own `data-manti-theme` scope.
 *
 * The scoped file is the same generated source as `themes/<id>.css`, so what a
 * card shows is what the one-line import gives an app — including the neutral
 * re-tint, the radius factor, and Graphite's density.
 */
export function ThemePresets() {
  return (
    <>
      <div className="docs-theme-grid">
        {Object.entries(presets).map(([id, preset]) => (
          <div
            key={id}
            className="docs-theme-card"
            data-manti-theme={preset.default ? undefined : id}
          >
            <div className="docs-theme-head">
              <strong>{preset.label}</strong>
              <Badge>{id}</Badge>
            </div>
            <p className="docs-theme-note">{preset.description}</p>
            <div className="docs-cluster">
              <Button size="sm">Save</Button>
              <Button size="sm" variant="secondary">
                Cancel
              </Button>
              <Badge variant="primary">Beta</Badge>
            </div>
            <Input size="sm" placeholder="Search" fullWidth />
            <Progress value={62} size="sm" />
            <code className="docs-theme-import">
              {preset.default
                ? '@manti-ui/styles/index.css'
                : `@manti-ui/styles/themes/${id}.css`}
            </code>
          </div>
        ))}
      </div>
      <p className="docs-theme-footnote">
        Want something none of these are? The{' '}
        <a href={STUDIO_URL} target="_blank" rel="noreferrer">
          Theme Studio
        </a>{' '}
        tunes the same tokens and hands back a stylesheet.
      </p>
    </>
  );
}
