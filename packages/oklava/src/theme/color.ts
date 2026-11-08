import { radixInk } from '@manti-ui/tokens';

/**
 * Label-ink selection for a Radix solid step.
 *
 * Every solid Oklava writes is step 9 of a Radix scale, and Radix designs each
 * step 9 for one foreground: light text on every scale except Sky, Mint, Lime,
 * Yellow and Amber, which take dark text. `radixInk` in `@manti-ui/tokens`
 * holds that rule, and `packages/styles/scripts/lib/variant-ink.mjs` applies
 * the same one to the shipped variants and presets, so a theme built here gets
 * the ink the build would have generated for the same scale.
 */

const INKS = {
  light: 'var(--manti-text-on-accent)',
  dark: 'var(--manti-text-on-bright)',
} as const;

/** `--variant-on-solid` for step 9 of the named Radix scale. */
export function inkFor(scale: string): string {
  return INKS[radixInk(scale)];
}
