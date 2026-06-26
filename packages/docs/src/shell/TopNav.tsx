import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Badge, Button, Dialog } from '@manti-ui/react';

import {
  GITHUB_URL,
  LATEST_CHANGELOG_SLUG,
  MANTI_VERSION,
  STORYBOOK_URL,
  primaryNav,
} from '../data/navigation';
import { useSearch } from '../search/SearchProvider';
import { useTheme } from '../theme/useTheme';
import { MenuIcon, MoonIcon, SearchIcon, SunIcon } from './icons';
import { SidebarNav } from './Sidebar';

export function TopNav() {
  const { theme, setTheme } = useTheme();
  const { setOpen } = useSearch();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="docs-nav">
      <Link to="/" className="docs-brand" aria-label="Manti UI home">
        <img src="/manti-white.svg" alt="" />
        <span>Manti UI</span>
      </Link>

      <Link
        to={LATEST_CHANGELOG_SLUG}
        className="docs-version"
        aria-label={`Version ${MANTI_VERSION} — what's new`}
      >
        <Badge tone="primary" variant="soft" size="sm">
          v{MANTI_VERSION}
        </Badge>
      </Link>

      <nav className="docs-nav-primary" aria-label="Primary">
        {primaryNav.map((item) => (
          <NavLink key={item.slug} to={item.slug} className="docs-nav-link">
            {item.title}
          </NavLink>
        ))}
      </nav>

      <span className="docs-nav-spacer" />

      <div className="docs-nav-actions">
        <Button
          variant="soft"
          tone="neutral"
          size="sm"
          leadingIcon={SearchIcon}
          onClick={() => setOpen(true)}
        >
          Search
        </Button>
        <a
          href={STORYBOOK_URL}
          target="_blank"
          rel="noreferrer"
          className="docs-nav-link"
        >
          Storybook
        </a>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          className="docs-nav-link"
        >
          GitHub
        </a>
        <Button
          iconOnly
          variant="ghost"
          tone="primary"
          aria-label="Toggle dark theme"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? MoonIcon : SunIcon}
        </Button>
        <Button
          className="docs-nav-menu-button"
          variant="ghost"
          tone="neutral"
          size="sm"
          iconOnly
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
        >
          {MenuIcon}
        </Button>
      </div>

      <Dialog open={menuOpen} onOpenChange={setMenuOpen} title="Menu" size="sm">
        <SidebarNav onNavigate={() => setMenuOpen(false)} />
      </Dialog>
    </header>
  );
}
