/**
 * Contrast audit of the resolved Manti palette.
 *
 * Reads the REAL token values out of `src/tokens.css` (resolving `var()`,
 * `light-dark()`, `color-mix(in oklab, …)` and the `--manti-cool-hue`
 * indirection) so the check can never drift from the tokens it guards. Computes
 * WCAG 2.1 contrast ratio and APCA Lc for the key text/UI pairs in both themes.
 *
 *   node scripts/check-contrast.mjs           # report (exit 0)
 *   node scripts/check-contrast.mjs --gate     # exit 1 if a GATE pair fails AA
 *
 * WCAG 2.1 thresholds: normal text ≥4.5 (AA), UI/non-text ≥3.0, AAA ≥7.
 * APCA Lc is reported as an indicator (≈60 body, ≈45 large, ≈75 fine text).
 * Only load-bearing pairs are gated; decorative borders / lowest-emphasis text
 * are reported as warnings (WCAG exempts decorative and disabled elements).
 */
import { readFile } from 'node:fs/promises';
import { dirname, resolve as presolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const CSS = presolve(here, '../src/tokens.css');
const gate = process.argv.includes('--gate');

// ── tiny CSS reader ──────────────────────────────────────────────────────────
const raw = (await readFile(CSS, 'utf8')).replace(/\/\*[\s\S]*?\*\//g, '');

/** Body of the first `selector {` … matching `}` (brace-counted). */
function blockBody(selectorRe) {
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

const root = decls(blockBody(/:root\s*\{/));
const variantScopes = new Map();
for (const m of raw.matchAll(/\[data-variant='([\w-]+)'\]\s*\{/g)) {
  variantScopes.set(
    m[1],
    decls(blockBody(new RegExp(`\\[data-variant='${m[1]}'\\]\\s*\\{`))),
  );
}

// ── value resolution → [L, C, H] ─────────────────────────────────────────────
/** Split on top-level `sep`, respecting parentheses. */
function splitTop(s, sep = ',') {
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

const KW = { white: [1, 0, 0], black: [0, 0, 0] };
const rad = (d) => (d * Math.PI) / 180;

/** Resolve a scalar (number or var → number), e.g. a hue channel. */
function scalar(v, theme, scope) {
  v = v.trim();
  const mv = v.match(/^var\(\s*(--[\w-]+)\s*\)$/);
  if (mv) return scalar(scope.get(mv[1]) ?? root.get(mv[1]), theme, scope);
  return parseFloat(v);
}

/** Resolve a value to OKLCH [L, C, H]; null if not a color. */
function color(v, theme, scope) {
  v = v.trim();
  if (KW[v]) return KW[v];

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
      return pm ? { c: pm[1], w: parseFloat(pm[2]) / 100 } : { c: p, w: null };
    };
    const a = parse(p1),
      b = parse(p2);
    if (a.w == null && b.w != null) a.w = 1 - b.w;
    if (a.w == null) a.w = 0.5;
    if (b.w == null) b.w = 1 - a.w;
    const A = color(a.c, theme, scope),
      B = color(b.c, theme, scope);
    if (!A || !B) return null;
    return mixOklab(A, a.w, B, b.w);
  }
  m = v.match(/^oklch\(([\s\S]*)\)$/);
  if (m) {
    const noAlpha = splitTop(m[1], '/')[0].trim();
    const parts = noAlpha.split(/\s+/);
    return [
      parseFloat(parts[0]),
      parseFloat(parts[1]),
      scalar(parts[2], theme, scope),
    ];
  }
  return null;
}

function toLab([L, C, H]) {
  return { L, a: C * Math.cos(rad(H)), b: C * Math.sin(rad(H)) };
}
function fromLab({ L, a, b }) {
  const C = Math.hypot(a, b);
  let H = (Math.atan2(b, a) * 180) / Math.PI;
  if (H < 0) H += 360;
  return [L, C, H];
}
function mixOklab(A, wa, B, wb) {
  const t = wa / (wa + wb),
    a = toLab(A),
    b = toLab(B);
  return fromLab({
    L: t * a.L + (1 - t) * b.L,
    a: t * a.a + (1 - t) * b.a,
    b: t * a.b + (1 - t) * b.b,
  });
}

// ── OKLCH → sRGB, WCAG, APCA ──────────────────────────────────────────────────
const clamp01 = (x) => Math.min(1, Math.max(0, x));
function oklch2srgb(oklch) {
  const { L, a, b } = toLab(oklch);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3,
    m = m_ ** 3,
    s = s_ ** 3;
  const lin = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  return lin.map((c) =>
    clamp01(c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055),
  );
}
const unlin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
function wcag(fg, bg) {
  const y = (o) => {
    const [r, g, b] = oklch2srgb(o);
    return 0.2126 * unlin(r) + 0.7152 * unlin(g) + 0.0722 * unlin(b);
  };
  const [hi, lo] = [y(fg), y(bg)].sort((x, z) => z - x);
  return (hi + 0.05) / (lo + 0.05);
}
function apca(fg, bg) {
  const Y = (o) => {
    let [r, g, b] = oklch2srgb(o);
    let y = 0.2126729 * r ** 2.4 + 0.7151522 * g ** 2.4 + 0.072175 * b ** 2.4;
    return y < 0.022 ? y + (0.022 - y) ** 1.414 : y;
  };
  const Yt = Y(fg),
    Yb = Y(bg);
  if (Math.abs(Yb - Yt) < 0.0005) return 0;
  let S, out;
  if (Yb > Yt) {
    S = (Yb ** 0.56 - Yt ** 0.57) * 1.14;
    out = S < 0.1 ? 0 : (S - 0.027) * 100;
  } else {
    S = (Yb ** 0.65 - Yt ** 0.62) * 1.14;
    out = S > -0.1 ? 0 : (S + 0.027) * 100;
  }
  return Math.abs(out);
}

// ── pairs to check ───────────────────────────────────────────────────────────
// kind: 'text' → AA 4.5 | 'ui' → 3.0.  gate: counts toward exit code.
const chrome = [
  ['text / bg', '--manti-text', '--manti-bg', 'text', true],
  ['text / surface', '--manti-text', '--manti-surface', 'text', true],
  [
    'text-muted / surface',
    '--manti-text-muted',
    '--manti-surface',
    'text',
    true,
  ],
  ['text-subtle / surface', '--manti-text-subtle', '--manti-surface', 'text', true],
  ['focus-ring / bg', '--manti-focus-ring', '--manti-bg', 'ui', true],
  [
    'border-strong / surface',
    '--manti-border-strong',
    '--manti-surface',
    'ui',
    false,
  ],
  ['border / surface', '--manti-border', '--manti-surface', 'ui', false],
];
const perVariant = [
  ['on-solid / solid', '--variant-on-solid', '--variant-solid', 'text', true],
  [
    'soft-text / soft-bg',
    '--variant-soft-text',
    '--variant-soft-bg',
    'text',
    true,
  ],
];

let failures = 0;
function row(label, fg, bg, kind, gated, scope) {
  const out = [];
  for (const theme of ['light', 'dark']) {
    const c1 = color(scope.get(fg) ?? root.get(fg), theme, scope);
    const c2 = color(scope.get(bg) ?? root.get(bg), theme, scope);
    if (!c1 || !c2) {
      out.push(`${theme}:?`);
      continue;
    }
    const w = wcag(c1, c2),
      lc = apca(c1, c2);
    const bar = kind === 'ui' ? 3.0 : 4.5;
    const pass = w >= bar;
    if (!pass && gated) failures++;
    const tag = pass ? 'ok' : gated ? 'FAIL' : 'warn';
    out.push(
      `${theme} ${w.toFixed(2).padStart(5)} ${tag.padEnd(4)} Lc${lc.toFixed(0).padStart(3)}`,
    );
  }
  const g = gated ? '' : '  ·warn-only';
  console.log(`  ${label.padEnd(24)} ${out.join('   ')}${g}`);
}

console.log('\nCHROME (root)');
for (const [l, fg, bg, k, g] of chrome) row(l, fg, bg, k, g, root);
for (const [name, scope] of variantScopes) {
  console.log(`\nVARIANT '${name}'`);
  for (const [l, fg, bg, k, g] of perVariant) row(l, fg, bg, k, g, scope);
}

console.log(
  `\nGate: normal text ≥4.5, UI ≥3.0 (load-bearing only). warn-only rows never fail the gate.`,
);
if (gate && failures) {
  console.error(`\n✗ ${failures} gated contrast failure(s).`);
  process.exit(1);
}
console.log(
  gate
    ? `\n✓ no gated contrast failures.`
    : `\n(report only — pass --gate to enforce)`,
);
