import { lazy, Suspense, useState } from 'react';
import type { ComponentType, CSSProperties } from 'react';
import { Button, Tabs } from '@manti-ui/react';

import { ReactIcon, SolidIcon, SvelteIcon, VueIcon } from './framework-icons';

// react-live carries a transpiler (sucrase) and a highlighter (Prism). Most readers
// never open the code, so it is split out and fetched on the first "Show code".
const DemoLive = lazy(() => import('./DemoLive'));

// Each demo file is loaded two ways: as a component for the closed preview, and as its
// raw source for the editor — from the same file, so the two can never drift.
const demoModules = import.meta.glob<{ default: ComponentType }>(
  '../demos/**/*.tsx',
  { eager: true },
);
const demoSources = import.meta.glob<string>('../demos/**/*.tsx', {
  eager: true,
  query: '?raw',
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
  const { Component, source } = resolve(name);
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

  const bar = (
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
  );

  // Closed, the preview is the imported component — no transpiler, no editor. Opened,
  // DemoLive owns the preview too, because the whole point is that editing the code
  // re-renders it. Toggling therefore remounts the demo and resets its state.
  const staticPreview = (
    <>
      <div className={canvasClass}>
        <Component />
      </div>
      {bar}
    </>
  );

  if (!source) {
    return <div className="docs-demo">{staticPreview}</div>;
  }

  return (
    <div className="docs-demo">
      {showCode ? (
        <Suspense fallback={staticPreview}>
          <DemoLive
            source={source.trim()}
            canvasClass={canvasClass}
            bar={bar}
          />
        </Suspense>
      ) : (
        staticPreview
      )}
    </div>
  );
}
