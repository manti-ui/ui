import type { PrismTheme } from 'prism-react-renderer';

/**
 * Prism themes for the live editor, carrying GitHub's own token colors so the editable
 * demo blocks read like the Shiki `github-light` / `github-dark` blocks everywhere else
 * on the page.
 *
 * They cannot match perfectly: Shiki highlights with TextMate grammars and Prism with
 * regex rules, so the two disagree about what a token *is* before color ever enters it.
 * The palette is shared; the tokenization is not.
 *
 * Backgrounds stay `transparent` — `.docs-live-editor` paints the surface from Manti
 * tokens, the same as `pre.shiki`.
 */

const light = {
  plain: '#24292f',
  comment: '#6e7781',
  keyword: '#cf222e',
  string: '#0a3069',
  function: '#8250df',
  constant: '#0550ae',
  tag: '#116329',
  attrName: '#0550ae',
};

const dark = {
  plain: '#c9d1d9',
  comment: '#8b949e',
  keyword: '#ff7b72',
  string: '#a5d6ff',
  function: '#d2a8ff',
  constant: '#79c0ff',
  tag: '#7ee787',
  attrName: '#79c0ff',
};

function theme(palette: typeof light): PrismTheme {
  return {
    plain: { color: palette.plain, backgroundColor: 'transparent' },
    styles: [
      {
        types: ['comment', 'prolog', 'doctype', 'cdata'],
        style: { color: palette.comment, fontStyle: 'italic' },
      },
      {
        types: ['keyword', 'operator', 'atrule', 'selector'],
        style: { color: palette.keyword },
      },
      {
        types: ['string', 'char', 'attr-value', 'regex', 'url'],
        style: { color: palette.string },
      },
      {
        types: ['function', 'class-name', 'maybe-class-name'],
        style: { color: palette.function },
      },
      {
        types: ['number', 'boolean', 'constant', 'symbol', 'builtin'],
        style: { color: palette.constant },
      },
      { types: ['tag'], style: { color: palette.tag } },
      { types: ['attr-name', 'property'], style: { color: palette.attrName } },
      { types: ['punctuation'], style: { color: palette.plain } },
      { types: ['deleted'], style: { color: light.keyword } },
      { types: ['inserted'], style: { color: palette.tag } },
    ],
  };
}

export const livePrismThemes = {
  light: theme(light),
  dark: theme(dark),
};
