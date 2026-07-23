import { pages } from '../pages';

export interface NavItem {
  slug: string;
  title: string;
  /** Small tag shown after the title, e.g. `New`. */
  badge?: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

/**
 * Sidebar group order. Every component page (slug under `/components/`) is
 * collected into a single "Components" section, listed alphabetically — there
 * are no per-category sub-sections. Pages with a group outside this list are
 * not shown in the sidebar.
 */
const GROUP_ORDER = [
  'Getting Started',
  'Foundations',
  'Guides',
  // Framework-agnostic primitives that aren't visual components (hooks like
  // useShortcut), each its own page ordered by `order`.
  'Utilities',
  'Components',
  'Reference',
  'Changelog',
] as const;

export const navGroups: NavGroup[] = GROUP_ORDER.map((label) => {
  if (label === 'Components') {
    // The `/components` overview first, then every component page A→Z.
    const overview: NavItem[] = pages
      .filter((page) => page.slug === '/components')
      .map((page) => ({
        slug: page.slug,
        // The overview page is titled "Components"; label its link "Overview"
        // so it doesn't echo the section heading above it.
        title: 'Overview',
        badge: page.badge,
      }));
    const components: NavItem[] = pages
      .filter((page) => page.slug.startsWith('/components/'))
      .map((page) => ({
        slug: page.slug,
        title: page.title,
        badge: page.badge,
      }))
      .sort((a, b) => a.title.localeCompare(b.title));
    return { label, items: [...overview, ...components] };
  }

  const items: NavItem[] = pages
    .filter((page) => page.group === label)
    .map((page) => ({
      slug: page.slug,
      title: page.title,
      badge: page.badge,
    }));
  return { label, items };
}).filter((group) => group.items.length > 0);

/** Flattened, in-order list of every sidebar page (for prev/next if needed). */
export const flatNav: NavItem[] = navGroups.flatMap((group) => group.items);

/** Condensed primary links shown in the top navigation bar. */
export const primaryNav: NavItem[] = [
  { slug: '/getting-started', title: 'Getting Started' },
  { slug: '/foundations/design-signature', title: 'Foundations' },
  { slug: '/components', title: 'Components' },
  { slug: '/guides/plain-css', title: 'Guides' },
  { slug: '/changelog', title: 'Changelog' },
];

/** Published Manti version (injected at build time — see vite.config.ts). */
export const MANTI_VERSION = __MANTI_VERSION__;
/** Release-notes page for the current version (target of the header badge). */
export const LATEST_CHANGELOG_SLUG = `/changelog/v${MANTI_VERSION}`;

export const GITHUB_URL = 'https://github.com/manti-ui/ui';
// Storybook ships in the same Netlify deploy, served at the /storybook subpath.
// Trailing slash is required so Storybook's relative asset URLs resolve under it.
export const STORYBOOK_URL = '/storybook/';
