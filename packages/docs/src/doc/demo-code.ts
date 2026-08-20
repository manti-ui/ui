import { styleClassMap } from './demo-class-map';

/** The styling vocabulary exposed by the demo code switcher. */
export type DemoStyle = 'tailwind' | 'css';

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const STYLE_CLASS_PATTERN = new RegExp(
  `\\b(?:${Object.keys(styleClassMap)
    .sort((a, b) => b.length - a.length)
    .map(escapeRegExp)
    .join('|')})\\b`,
  'g',
);

function classNamesIn(source: string) {
  return [...new Set(source.match(STYLE_CLASS_PATTERN) ?? [])];
}

/** Convert copy-ready CSS classes into copyable Tailwind utilities. */
export function toTailwindSource(source: string): string {
  return source.replace(STYLE_CLASS_PATTERN, (className) => {
    return styleClassMap[className] ?? className;
  });
}

/** A component needs the CSS subtab only when it owns copy-ready CSS classes. */
export function usesDemoCss(source: string): boolean {
  return classNamesIn(source).some((className) => className in styleClassMap);
}

/** Return only the CSS blocks used by the current demo, rather than the whole registry. */
export function toCssSource(
  source: string,
  cssSource: string,
): string | undefined {
  const rules = classNamesIn(source)
    .map((className) => {
      const pattern = new RegExp(
        `^\\.${escapeRegExp(className)} \\{[\\s\\S]*?^\\}`,
        'm',
      );
      return cssSource.match(pattern)?.[0];
    })
    .filter((rule): rule is string => rule != null);

  if (rules.length === 0) return undefined;
  return rules.join('\n\n');
}
