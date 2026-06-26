import { useState } from 'react';
import type { ComponentType, CSSProperties } from 'react';
import { Button, Tabs } from '@manti-ui/react';

import { ReactIcon, SolidIcon, SvelteIcon, VueIcon } from './framework-icons';

// Each demo file is loaded three ways: as a live component, as its raw source
// (for the copy button), and as Shiki-highlighted HTML (for display) — all from
// the same file, so preview, copy and code can never drift.
const demoModules = import.meta.glob<{ default: ComponentType }>(
  '../demos/**/*.tsx',
  { eager: true },
);
const demoSources = import.meta.glob<string>('../demos/**/*.tsx', {
  eager: true,
  query: '?raw',
  import: 'default',
});
const demoHtml = import.meta.glob<string>('../demos/**/*.tsx', {
  eager: true,
  query: '?highlight',
  import: 'default',
});

// The renderers Manti targets. Only React ships today; the rest preview the
// framework-agnostic roadmap. `color` is each framework's own brand color (a
// third-party identity, not a Manti token).
const ACTIVE_FRAMEWORK = 'react';
const FRAMEWORKS = [
  { id: 'react', label: 'React', color: '#61dafb', icon: ReactIcon },
  { id: 'vue', label: 'Vue', color: '#42b883', icon: VueIcon },
  { id: 'svelte', label: 'Svelte', color: '#ff3e00', icon: SvelteIcon },
  { id: 'solid', label: 'Solid', color: '#4f88c6', icon: SolidIcon },
];
const activeColor =
  FRAMEWORKS.find((framework) => framework.id === ACTIVE_FRAMEWORK)?.color ??
  '#61dafb';
const frameworkItems = FRAMEWORKS.map((framework) => ({
  value: framework.id,
  label: framework.label,
  icon: framework.icon,
  content: null,
  disabled: framework.id !== ACTIVE_FRAMEWORK,
}));

function resolve(name: string) {
  const key = `../demos/${name}.tsx`;
  return {
    Component: demoModules[key]?.default,
    source: demoSources[key],
    html: demoHtml[key],
  };
}

export interface DemoProps {
  /** Path under src/demos without extension, e.g. `button/variants`. */
  name: string;
  /** Center the preview instead of left-aligning it. */
  center?: boolean;
  /** Reserve vertical room and top-align the preview — for demos whose inline
   * dropdown opens downward (e.g. NavigationMenu) and would otherwise be
   * clipped by the canvas overflow. */
  roomy?: boolean;
}

export function Demo({ name, center, roomy }: DemoProps) {
  const { Component, source, html } = resolve(name);
  const [showCode, setShowCode] = useState(false);

  const canvasClass = [
    'docs-demo-canvas',
    center && 'is-center',
    roomy && 'is-roomy',
  ]
    .filter(Boolean)
    .join(' ');

  if (!Component) {
    return (
      <div className="docs-demo">
        <p className="docs-search-empty">Missing demo: {name}</p>
      </div>
    );
  }

  return (
    <div className="docs-demo">
      <div className={canvasClass}>
        <Component />
      </div>
      {source && html && (
        <>
          <div className="docs-demo-bar">
            {/* Framework switcher (Manti Tabs). Only React is enabled today; the
                active tab wears its framework's brand color via --fw-color. */}
            <div
              className="docs-demo-frameworks"
              style={{ '--fw-color': activeColor } as CSSProperties}
            >
              <Tabs
                items={frameworkItems}
                variant="soft"
                defaultValue={ACTIVE_FRAMEWORK}
              />
            </div>
            <Button
              variant="ghost"
              tone="neutral"
              size="sm"
              onClick={() => setShowCode((value) => !value)}
              aria-expanded={showCode}
            >
              {showCode ? 'Hide code' : 'Show code'}
            </Button>
          </div>
          {showCode && <DemoSource html={html} source={source} />}
        </>
      )}
    </div>
  );
}

function DemoSource({ html, source }: { html: string; source: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(source);
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
          aria-label="Copy demo source"
        >
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
      {/* Shiki HTML produced at build time by the ?highlight Vite plugin. */}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
