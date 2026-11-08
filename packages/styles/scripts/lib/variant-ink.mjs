/**
 * Which ink a solid fill carries, decided once for every generator.
 *
 * A solid on a Radix scale's step 9 follows Radix's own rule
 * (`radixInk` in `@manti-ui/tokens`): the light ink on every scale except
 * Sky, Mint, Lime, Yellow and Amber, which take the dark ink. That is how
 * Radix designs its step 9, and Manti takes the scales verbatim, so the ink is
 * not re-derived from a contrast metric here.
 *
 * A solid that is not a step 9 (the neutral variants paint step 12) has no
 * Radix rule, so it is measured: the ink with the higher WCAG 2.1 ratio wins,
 * and APCA Lc breaks a tie.
 *
 * `gen-variant-ink.mjs` (shipped variants) and `gen-preset-css.mjs` (preset
 * themes) both call this, so a preset can never get an ink the build would not
 * have chosen for the same color.
 */
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { apca, wcag } from './tokens-css.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const TOKENS_TS = resolve(here, '../../../tokens/src/index.ts');
const { radixInk } = await import(pathToFileURL(TOKENS_TS).href);

/**
 * The inks a solid may carry. Both are existing tokens, so a generated region
 * never introduces a bespoke literal: `--manti-text-on-accent` is the near-white
 * used across accent surfaces, `--manti-text-on-bright` its near-black twin.
 * Both hold one Radix step across schemes (`--manti-ink-*`), which a bare
 * slate step does not: `--manti-gray-12` is dark in light and light in dark.
 */
export const INKS = [
  { token: '--manti-text-on-accent', label: 'light' },
  { token: '--manti-text-on-bright', label: 'dark' },
];

/** WCAG 2.1 AA for normal text, reported next to each pick. */
export const AA = 4.5;

/** The ink Radix designs for step 9 of the named Radix scale. */
export function inkForScale(radixName) {
  const label = radixInk(radixName);
  return INKS.find((ink) => ink.label === label);
}

/**
 * Score every candidate against `solid`. `candidates` are
 * `{ token, label, c }`, `c` being the resolved {@link Color}.
 *
 * With `radixName`, the winner is the Radix pick for that scale's step 9.
 * Without it, the winner is the higher WCAG ratio, APCA Lc breaking a tie.
 */
export function pickInk(solid, candidates, radixName) {
  const scored = candidates.map((ink) => ({
    ...ink,
    lc: apca(ink.c, solid),
    ratio: wcag(ink.c, solid),
  }));
  if (radixName) {
    const want = inkForScale(radixName).token;
    return { scored, chosen: scored.find((s) => s.token === want) };
  }
  const chosen = [...scored].sort(
    (a, b) => b.ratio - a.ratio || Math.abs(b.lc) - Math.abs(a.lc),
  )[0];
  return { scored, chosen };
}
