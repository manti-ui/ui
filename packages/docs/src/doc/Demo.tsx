import { lazy, Suspense, useId, useState } from 'react';
import type { ComponentType } from 'react';
import { Button, Select, Tabs, Text } from '@manti-ui/react';

import demoCssSource from '../demos/demo.css?raw';
import {
  toCssSource,
  toTailwindSource,
  usesDemoCss,
  type DemoStyle,
} from './demo-code';
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
// framework roadmap and remain disabled until their renderers land.
const ACTIVE_FRAMEWORK = 'react';
const FRAMEWORKS = [
  { id: 'react', label: 'React', icon: ReactIcon },
  { id: 'vue', label: 'Vue', icon: VueIcon },
  { id: 'svelte', label: 'Svelte', icon: SvelteIcon },
  { id: 'solid', label: 'Solid', icon: SolidIcon },
];
const frameworkItems = FRAMEWORKS.map((framework) => ({
  value: framework.id,
  label: framework.label,
  icon: framework.icon,
  content: null,
  disabled: framework.id !== ACTIVE_FRAMEWORK,
}));
const styleItems = [
  { value: 'tailwind', label: 'Tailwind' },
  { value: 'css', label: 'CSS' },
];

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
  /** Show the editable source initially while keeping the show/hide control. */
  defaultCodeOpen?: boolean;
}

export function Demo({
  name,
  center,
  roomy,
  defaultCodeOpen = false,
}: DemoProps) {
  const { Component, source } = resolve(name);
  const [showCode, setShowCode] = useState(defaultCodeOpen);
  const [styleMode, setStyleMode] = useState<DemoStyle>('tailwind');
  const styleSelectId = useId();

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
        <Text className="docs-search-empty">Missing demo: {name}</Text>
      </div>
    );
  }

  const sourceText = source?.trim();
  const cssFileName = `${name.split('/')[0]}.css`;
  const cssSource =
    sourceText && usesDemoCss(sourceText)
      ? toCssSource(sourceText, demoCssSource)
      : undefined;
  const displayedSource =
    styleMode === 'tailwind' && sourceText
      ? toTailwindSource(sourceText)
      : sourceText;

  const bar = (
    <div className="docs-demo-bar">
      {/* Framework switcher (Manti Tabs). Only React is enabled today; the
          active tab uses semantic info ink from the docs token layer. */}
      <div className="docs-demo-frameworks" data-variant="info">
        <Tabs
          items={frameworkItems}
          variant="soft"
          defaultValue={ACTIVE_FRAMEWORK}
        />
      </div>
      <div className="docs-demo-bar-actions">
        {showCode && cssSource && (
          <div className="docs-demo-style-picker">
            <Select
              id={styleSelectId}
              items={styleItems}
              className="docs-demo-style-select"
              aria-label="Code styling"
              size="sm"
              value={[styleMode]}
              onValueChange={([value]) => {
                if (value === 'tailwind' || value === 'css') {
                  setStyleMode(value);
                }
              }}
            />
          </div>
        )}
        <Button
          variant="tertiary"
          size="sm"
          onClick={() => setShowCode((value) => !value)}
          aria-expanded={showCode}
        >
          {showCode ? 'Hide code' : 'Show code'}
        </Button>
      </div>
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
            key={`${name}-${styleMode}`}
            source={displayedSource ?? ''}
            cssSource={styleMode === 'css' ? cssSource : undefined}
            cssFileName={cssFileName}
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
