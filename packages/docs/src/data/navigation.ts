import { pages } from '../pages';

export interface NavItem {
  slug: string;
  title: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

/** Sidebar group order. Pages with a group outside this list are not listed. */
const GROUP_ORDER = [
  'Getting Started',
  'Foundations',
  'Guides',
  'Components',
  'Reference',
] as const;

export const navGroups: NavGroup[] = GROUP_ORDER.map((label) => {
  let items: NavItem[] = pages
    .filter((page) => page.group === label)
    .map((page) => ({ slug: page.slug, title: page.title }));
  // The Components group is alphabetical, with the overview pinned to the top.
  if (label === 'Components') {
    items = [...items].sort((a, b) => {
      if (a.slug === '/components') return -1;
      if (b.slug === '/components') return 1;
      return a.title.localeCompare(b.title);
    });
  }
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
];

export const GITHUB_URL = 'https://github.com/manti-ui/ui';
// Storybook ships in the same Netlify deploy, served at the /storybook subpath.
// Trailing slash is required so Storybook's relative asset URLs resolve under it.
export const STORYBOOK_URL = '/storybook/';
