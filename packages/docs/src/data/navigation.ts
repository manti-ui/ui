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

// Components are split into these categories, each its own sidebar section. The
// names mirror the `group` frontmatter of every component page under content/.
const COMPONENT_CATEGORIES = [
  'Inputs',
  'Buttons & Actions',
  'Navigation',
  'Overlays',
  'Feedback',
  'Data Display',
  'Layout',
] as const;

/** Sidebar group order. Pages with a group outside this list are not listed. */
const GROUP_ORDER = [
  'Getting Started',
  'Foundations',
  'Guides',
  // The `/components` overview sits alone in its "Components" group, above the
  // categorized component sections.
  'Components',
  ...COMPONENT_CATEGORIES,
  'Reference',
  'Changelog',
] as const;

const COMPONENT_CATEGORY_SET = new Set<string>(COMPONENT_CATEGORIES);

export const navGroups: NavGroup[] = GROUP_ORDER.map((label) => {
  let items: NavItem[] = pages
    .filter((page) => page.group === label)
    .map((page) => ({
      slug: page.slug,
      // The overview page is titled "Components"; label its lone sidebar link
      // "Overview" so it doesn't echo the section heading above it.
      title: page.slug === '/components' ? 'Overview' : page.title,
      badge: page.badge,
    }));
  // Component categories list their items alphabetically rather than by `order`.
  if (COMPONENT_CATEGORY_SET.has(label)) {
    items = [...items].sort((a, b) => a.title.localeCompare(b.title));
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
