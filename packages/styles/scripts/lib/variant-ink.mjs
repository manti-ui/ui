/**
 * Which ink a solid fill carries, decided once for every generator.
 *
 * Ranking is lexicographic: clear WCAG 2.1 AA (4.5:1) first, then maximise APCA
 * Lc among whatever survives. The two metrics genuinely disagree on the primary
 * orange — light ink scores Lc 65 to dark ink's 41 yet lands at 3.39:1 where
 * dark reaches 5.24:1 — and AA is the bar the contrast gate enforces, so APCA
 * only breaks ties above it.
 *
 * `gen-variant-ink.mjs` (shipped variants) and `gen-preset-css.mjs` (preset
 * themes) both call this, so a preset can never get an ink the build would not
 * have chosen for the same color.
 */
import { apca, wcag } from './tokens-css.mjs';

/**
 * The inks a solid may carry. Both are existing tokens, so a generated region
 * never introduces a bespoke literal: `--manti-text-on-accent` is the near-white
 * used across accent surfaces, `--manti-gray-12` the darkest neutral.
 */
export const INKS = [
  { token: '--manti-text-on-accent', label: 'light' },
  { token: '--manti-gray-12', label: 'dark' },
];

/** WCAG 2.1 AA for normal text — the bar `check-contrast.mjs` gates on. */
export const AA = 4.5;

/**
 * Score every candidate against `solid` and return the winner.
 *
 * `candidates` are `{ token, label, c }`, `c` being the resolved {@link Color}.
 * `chosen` is null when nothing clears AA — a caller must treat that as a
 * defect rather than shipping the least-bad ink.
 */
export function pickInk(solid, candidates) {
  const scored = candidates.map((ink) => ({
    ...ink,
    lc: apca(ink.c, solid),
    ratio: wcag(ink.c, solid),
  }));
  const passing = scored
    .filter((s) => s.ratio >= AA)
    .sort((a, b) => b.lc - a.lc);
  return { scored, chosen: passing[0] ?? null };
}
