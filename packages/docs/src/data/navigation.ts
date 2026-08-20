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
  'Typography',
  // Framework-agnostic primitives that aren't visual components (hooks like
  // useShortcut), each its own page ordered by `order`.
  'Utilities',
  'Components',
  'Reference',
  'Changelog',
] as const;

/** Hub routes stay addressable, but the sidebar starts at the first real page. */
const OVERVIEW_SLUGS = new Set(['/foundations', '/changelog']);

export const navGroups: NavGroup[] = GROUP_ORDER.map((label) => {
  if (label === 'Typography') {
    const items: NavItem[] = pages
      .filter(
        (page) =>
          page.slug === '/typography' || page.slug.startsWith('/typography/'),
      )
      .map((page) => ({
        slug: page.slug,
        title: page.slug === '/typography' ? 'Overview' : page.title,
        badge: page.badge,
      }));
    return { label, items };
  }

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
    .filter((page) => page.group === label && !OVERVIEW_SLUGS.has(page.slug))
    .map((page) => ({
      slug: page.slug,
      title: page.title,
      badge: page.badge,
    }));
  return { label, items };
}).filter((group) => group.items.length > 0);

/** Flattened, in-order list of every sidebar page (for prev/next if needed). */
export const flatNav: NavItem[] = navGroups.flatMap((group) => group.items);

/**
 * The Theme Studio: its own app on its own subdomain (repo: manti-ui/studio).
 * It is not a docs route, so it sits with the outbound links on the right of
 * the header rather than in `primaryNav`.
 */
export const STUDIO_URL = 'https://studio.manti.design';

/** Published Manti version (injected at build time — see vite.config.ts). */
export const MANTI_VERSION = __MANTI_VERSION__;
/** Release-notes page for the current version (target of the header badge). */
export const LATEST_CHANGELOG_SLUG = `/changelog/v${MANTI_VERSION}`;

function firstPageInGroup(label: string, fallback: string): string {
  return (
    navGroups.find((group) => group.label === label)?.items[0]?.slug ?? fallback
  );
}

/** Condensed primary links shown in the top navigation bar. */
export const primaryNav: NavItem[] = [
  { slug: '/getting-started', title: 'Getting Started' },
  { slug: '/guides/plain-css', title: 'Guides' },
  { slug: '/components', title: 'Components' },
  {
    slug: firstPageInGroup('Foundations', '/foundations'),
    title: 'Foundations',
  },
  {
    slug: firstPageInGroup('Changelog', LATEST_CHANGELOG_SLUG),
    title: 'Changelog',
  },
];

/** `owner/name` of the public repository. */
export const GITHUB_REPO = 'manti-ui/ui';
export const GITHUB_URL = `https://github.com/${GITHUB_REPO}`;
/** Unauthenticated repo endpoint — read client-side for the star count. */
export const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}`;
// Storybook ships in the same Netlify deploy, served at the /storybook subpath.
// Trailing slash is required so Storybook's relative asset URLs resolve under it.
export const STORYBOOK_URL = '/storybook/';
