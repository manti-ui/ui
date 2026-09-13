import { componentTokens } from '@manti-ui/tokens';

import { componentMeta } from '../data/componentMeta';
import type { DocPage } from '../pages';
import { SITE_URL, canonicalUrl } from '../seo/meta';
import { demoSource } from './demo-registry';

/**
 * A documentation page as Markdown an AI assistant can actually use.
 *
 * The page is authored as MDX, and its most useful parts are React tags:
 * `<Demo>` holds every code example, `<PropsTable>` the API, `<Anatomy>` the
 * styling contract, `<TokenTable>` the override tokens. Handing the raw MDX to
 * an assistant hands it `<PropsTable component="button" />` and nothing else,
 * so it answers about Button without having seen a single prop.
 *
 * Each of those tags is therefore resolved here against the same data the page
 * renders from, and the body is prefixed with a header naming the page and its
 * canonical URL so a quoted answer can be traced back. `page.source` arrives
 * frontmatter-free (see `virtual:manti-doc-sources`); routing metadata would be
 * noise in a prompt.
 */

const registry = componentTokens as Record<string, readonly string[]>;

/** Self-closing doc primitives, at the start of their own line. */
const TAG =
  /^[ \t]*<(Demo|PropsTable|Anatomy|TokenTable|InstallTabs|Faq)\b([^>]*?)\/>[ \t]*$/gm;

function attrs(raw: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const match of raw.matchAll(/([A-Za-z][\w-]*)="([^"]*)"/g)) {
    out[match[1]] = match[2];
  }
  return out;
}

/** Markdown tables are pipe-delimited, so a pipe inside a cell must escape. */
function cell(value: string): string {
  return value
    .replace(/\|/g, '\\|')
    .replace(/\s*\n\s*/g, ' ')
    .trim();
}

function table(headers: string[], rows: string[][]): string {
  if (rows.length === 0) return '';
  return [
    `| ${headers.join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...rows.map((row) => `| ${row.map(cell).join(' | ')} |`),
  ].join('\n');
}

function propsTable(component: string): string {
  const meta = componentMeta[component];
  if (!meta) return '';
  return table(
    ['Prop', 'Type', 'Default', 'Description'],
    meta.props.map((prop) => [
      `\`${prop.name}\``,
      `\`${prop.type}\``,
      prop.default ? `\`${prop.default}\`` : '-',
      prop.description,
    ]),
  );
}

function anatomyTable(component: string): string {
  const meta = componentMeta[component];
  if (!meta) return '';
  return table(
    ['Part', 'Selector', 'Description'],
    meta.anatomy.map((part) => [
      `\`${part.part}\``,
      `\`[data-scope="${meta.scope}"][data-part="${part.part}"]\``,
      part.description,
    ]),
  );
}

function tokenTable(component: string): string {
  const scope = componentMeta[component]?.scope ?? component;
  const tokens = registry[scope];
  if (!tokens || tokens.length === 0) {
    return `This component has no dedicated component tokens. Theme it through the semantic tokens and the \`--variant-*\` vocabulary, or override its anatomy selectors directly.`;
  }
  return table(
    ['Token', 'Controls'],
    tokens.map((token) => [
      `\`--manti-${scope}-${token}\``,
      token.replace(/-/g, ' '),
    ]),
  );
}

function demoBlock(name: string): string {
  const source = demoSource(name);
  if (!source) return '';
  return [`Example (\`${name}\`):`, '', '```tsx', source.trim(), '```'].join(
    '\n',
  );
}

function faqBlock(page: DocPage): string {
  if (!page.faq || page.faq.length === 0) return '';
  return [
    '## Frequently asked questions',
    '',
    ...page.faq.flatMap((entry) => [`### ${entry.q}`, '', entry.a, '']),
  ]
    .join('\n')
    .trimEnd();
}

/**
 * Site-relative links become absolute. The copied page is read away from the
 * site, where `/guides/tailwind` resolves against whatever host the reader is
 * on, or against nothing at all.
 */
function absoluteLinks(markdown: string): string {
  return markdown.replace(/\]\((\/[^)\s]*)\)/g, (_match, href: string) => {
    const [path, hash] = href.split('#');
    const url = path.endsWith('/') ? SITE_URL + path : `${SITE_URL}${path}/`;
    return `](${hash ? `${url}#${hash}` : url})`;
  });
}

/** The page as Markdown, with every doc primitive resolved to real content. */
export function buildPageMarkdown(page: DocPage): string {
  const body = page.source.trim();

  const resolved = body.replace(TAG, (match, tag: string, rawAttrs: string) => {
    const props = attrs(rawAttrs);
    switch (tag) {
      case 'Demo':
        return props.name ? demoBlock(props.name) : '';
      case 'PropsTable':
        return props.component ? propsTable(props.component) : '';
      case 'Anatomy':
        return props.component ? anatomyTable(props.component) : '';
      case 'TokenTable':
        return props.component ? tokenTable(props.component) : '';
      case 'InstallTabs':
        return props.packages
          ? ['```bash', `npm install ${props.packages}`, '```'].join('\n')
          : '';
      case 'Faq':
        return faqBlock(page);
      default:
        // An unrecognized tag is left as written: on guide pages the JSX is the
        // example, and removing it would delete the thing being documented.
        return match;
    }
  });

  const header = [`# ${page.title}`, '', `Source: ${canonicalUrl(page.slug)}`];
  if (page.description) header.push(`Summary: ${page.description}`);
  header.push(
    'Library: Manti UI, published as `@manti-ui/react` with `@manti-ui/styles` as a peer dependency.',
    'Full project guide for coding agents: https://manti.design/llms.txt',
  );

  // The body opens with its own `# Title` on almost every page; drop the
  // duplicate rather than introducing the page twice.
  const withoutOwnTitle = resolved.replace(/^#\s+.*\r?\n+/, '');

  return `${header.join('\n')}\n\n${absoluteLinks(withoutOwnTitle)}\n`;
}
