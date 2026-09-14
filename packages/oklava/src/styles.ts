import css from './oklava.css?inline';

/**
 * The panel's own stylesheet, written into the document on first mount.
 *
 * A devtool that needs a second import to look right is a devtool people give
 * up on, so the CSS travels inside the bundle as a string rather than as a file
 * the consumer has to wire up. It is authored as a real stylesheet in
 * `oklava.css` and passes through the package's Lightning CSS pipeline at build
 * time, so nesting and `light-dark()` survive exactly as they do in
 * `@manti-ui/styles`.
 *
 * The rules claim `@layer manti.oklava`, appended after the layer order
 * `@manti-ui/styles` establishes. That puts the panel's chrome above the
 * component defaults it builds on, and below any unlayered CSS the host app
 * writes, including the unlayered theme overrides Oklava itself injects. The
 * theme reaching the panel is deliberate: the panel is the preview.
 */

const STYLE_EL_ID = 'manti-oklava-styles';

export function ensureStyles(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_EL_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_EL_ID;
  el.textContent = css;
  document.head.appendChild(el);
}

/**
 * Pin the panel's focus ring to the width the host app shipped.
 *
 * Every knob restyles the panel, which is the point: it is the preview. Focus
 * width is the one setting where that backfires, because `0` strips the panel's
 * own rings and leaves the devtool unusable by keyboard. A second, tiny
 * stylesheet carries the value so the panel needs no inline style.
 */
const HOST_EL_ID = 'manti-oklava-host';

export function setHostFocusRingWidth(width: string): void {
  if (typeof document === 'undefined') return;
  let el = document.getElementById(HOST_EL_ID) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement('style');
    el.id = HOST_EL_ID;
    document.head.appendChild(el);
  }
  const rule = `@layer manti.oklava { .oklava-panel { --manti-oklava-focus-ring-width: ${width}; } }`;
  if (el.textContent !== rule) el.textContent = rule;
}
