/**
 * Reader and resolver for `src/tokens.css`.
 *
 * The token file is the only honest source for what a color actually resolves
 * to: the theme-aware roles and the `--variant-*` vocabulary are hand-authored
 * there with `light-dark()` and `color-mix()`, which the TS contract cannot
 * express. Anything that needs a *resolved* palette value — the contrast audit,
 * the variant-ink generator — reads it through here so the two can never
 * disagree about what a token means.
 *
 * Only the CSS constructs the token file actually uses are modelled. Anything
 * else resolves to null, which callers must surface as a defect rather than
 * guess at: an unresolved token is a dangling `var()` the browser drops.
 */
import { readFile } from 'node:fs/promises';

import Color from 'colorjs.io';

/** Body of the first `selector {` … matching `}` (brace-counted). */
function blockBody(raw, selectorRe) {
  const m = selectorRe.exec(raw);
  if (!m) return null;
  let i = raw.indexOf('{', m.index) + 1;
  let depth = 1;
  const start = i;
  for (; i < raw.length && depth > 0; i++) {
    if (raw[i] === '{') depth++;
    else if (raw[i] === '}') depth--;
  }
  return raw.slice(start, i - 1);
}

/** name → raw value declarations inside a block body. */
function decls(body) {
  const map = new Map();
  if (!body) return map;
  for (const m of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g))
    map.set(m[1], m[2].trim());
  return map;
}

/** Split on top-level `sep`, respecting parentheses. */
export function splitTop(s, sep = ',') {
  const out = [];
  let depth = 0,
    cur = '';
  for (const ch of s) {
    if (ch === '(') depth++;
    else if (ch === ')') depth--;
    if (ch === sep && depth === 0) {
      out.push(cur.trim());
      cur = '';
    } else cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

/**
 * Parse `tokens.css` and return its declarations plus a resolver bound to them.
 *
 * `color(value, theme, scope)` → {@link Color} or null.
 * `resolveToken(name, theme, scope)` → `{ c }` or `{ err }`, so a caller can
 * report *why* a token did not resolve instead of printing a bare `?`.
 */
export async function readTokensCss(path) {
  const raw = (await readFile(path, 'utf8')).replace(/\/\*[\s\S]*?\*\//g, '');

  const root = decls(blockBody(raw, /:root\s*\{/));
  const variantScopes = new Map();
  for (const m of raw.matchAll(/\[data-variant='([\w-]+)'\]\s*\{/g)) {
    // A variant may be declared in more than one block (a hand-authored one and
    // a generated one); walking them in source order and overwriting reproduces
    // what the cascade does at equal specificity — last declaration wins.
    const merged = variantScopes.get(m[1]) ?? new Map();
    for (const [k, v] of decls(blockBody(raw.slice(m.index), /\{/)))
      merged.set(k, v);
    variantScopes.set(m[1], merged);
  }

  /** Resolve a scalar (number or var → number), e.g. a hue channel. */
  function scalar(v, theme, scope) {
    v = v.trim();
    const mv = v.match(/^var\(\s*(--[\w-]+)\s*\)$/);
    if (mv) return scalar(scope.get(mv[1]) ?? root.get(mv[1]), theme, scope);
    return parseFloat(v);
  }

  function color(v, theme, scope) {
    v = v.trim();
    if (v === 'white' || v === 'black') return new Color(v);

    let m = v.match(/^var\(\s*(--[\w-]+)\s*(?:,(.*))?\)$/s);
    if (m) {
      const ref = scope.get(m[1]) ?? root.get(m[1]);
      if (ref != null) return color(ref, theme, scope);
      return m[2] ? color(m[2], theme, scope) : null;
    }
    m = v.match(/^light-dark\(([\s\S]*)\)$/);
    if (m) {
      const [lite, dark] = splitTop(m[1]);
      return color(theme === 'light' ? lite : dark, theme, scope);
    }
    m = v.match(/^color-mix\(\s*in oklab\s*,([\s\S]*)\)$/);
    if (m) {
      const [p1, p2] = splitTop(m[1]);
      const parse = (p) => {
        const pm = p.match(/^([\s\S]+?)\s+([\d.]+)%$/);
        return pm
          ? { c: pm[1], w: parseFloat(pm[2]) / 100 }
          : { c: p, w: null };
      };
      const a = parse(p1),
        b = parse(p2);
      if (a.w == null && b.w != null) a.w = 1 - b.w;
      if (a.w == null) a.w = 0.5;
      if (b.w == null) b.w = 1 - a.w;
      const A = color(a.c, theme, scope),
        B = color(b.c, theme, scope);
      if (!A || !B) return null;
      // `mix(other, ratio)` weights `other` by ratio.
      return A.mix(B, b.w / (a.w + b.w), { space: 'oklab' });
    }
    m = v.match(/^oklch\(([\s\S]*)\)$/);
    if (m) {
      const noAlpha = splitTop(m[1], '/')[0].trim();
      const [l, c, h] = noAlpha.split(/\s+/);
      return new Color('oklch', [
        parseFloat(l),
        parseFloat(c),
        scalar(h, theme, scope),
      ]);
    }
    return null;
  }

  function resolveToken(name, theme, scope) {
    const value = scope.get(name) ?? root.get(name);
    if (value == null) return { err: `${name} is not declared` };
    const c = color(value, theme, scope);
    if (!c) return { err: `${name} did not resolve to a color (${value})` };
    return { c };
  }

  return { root, variantScopes, color, resolveToken };
}

// ── metrics ──────────────────────────────────────────────────────────────────
export const wcag = (fg, bg) => Color.contrast(fg, bg, 'WCAG21');

/**
 * APCA is polarity-sensitive and colorjs takes (background, foreground); the
 * sign encodes light-on-dark vs dark-on-light, which callers do not use.
 */
export const apca = (fg, bg) => Math.abs(Color.contrast(bg, fg, 'APCA'));

/**
 * The color an sRGB display actually resolves, per CSS Color 4 gamut mapping.
 * `toGamut()` mutates in place and returns `this`, so clone first — otherwise
 * a caller would quietly rewrite the color it is measuring.
 */
export const toSrgb = (c) =>
  c.clone().toGamut({ space: 'srgb', method: 'css' });

export { Color };
