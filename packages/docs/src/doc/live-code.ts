/**
 * Turn a demo source file into something react-live can evaluate.
 *
 * Demo files are real modules: they import from `@manti-ui/react` and default-export a
 * component. react-live instead evaluates a bare statement list where `scope` stands in
 * for imports, so the module wrapper has to come off:
 *
 *   - imports are dropped — `scope` already provides everything they name.
 *   - the default export becomes a plain declaration, and the `render()` call that
 *     react-live's `noInline` mode expects is appended.
 *
 * This only runs on the way to evaluation. The code shown in the editor keeps its
 * imports, because that is what a reader should paste into a real project.
 */

/**
 * Every demo import is one line ending in `from '…'` — true of all 110 demo files, and
 * of anything a reader is likely to type. A multi-line import would survive this and
 * then fail to evaluate; the error surfaces in the editor rather than silently.
 */
const IMPORT_LINE = /^import\s[^;\n]*?from\s*['"][^'"]+['"];?[ \t]*\r?\n?/gm;

const DEFAULT_EXPORT = /export\s+default\s+function\s+([A-Za-z_$][\w$]*)/;

export function toLiveCode(source: string): string {
  const body = source.replace(IMPORT_LINE, '');
  const named = DEFAULT_EXPORT.exec(body);

  // Thrown errors reach the reader through LiveError, so this doubles as the message
  // shown when someone edits the default export away.
  if (!named) {
    throw new Error(
      'This demo needs a default-exported component — e.g. `export default function Demo() { … }`.',
    );
  }

  return `${body.replace(/export\s+default\s+/, '')}\nrender(<${named[1]} />);`;
}
