import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Badge, Button, Dialog } from '@manti-ui/react';

import {
  LATEST_CHANGELOG_SLUG,
  MANTI_VERSION,
  STUDIO_URL,
  primaryNav,
} from '../data/navigation';
import { useSearch } from '../search/SearchProvider';
import { useTheme } from '../theme/useTheme';
import { GithubStars } from './GithubStars';
import { ExternalIcon, MenuIcon, MoonIcon, SearchIcon, SunIcon } from './icons';
import { SidebarNav } from './Sidebar';

export function TopNav() {
  const { theme, setTheme } = useTheme();
  const { setOpen } = useSearch();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="docs-nav">
      <Link to="/" className="docs-brand" aria-label="Manti UI home">
        <img
          src="/manti-white.svg"
          alt="Manti UI logo"
          width="40"
          height="40"
        />
        <span>Manti UI</span>
      </Link>

      <Link
        to={LATEST_CHANGELOG_SLUG}
        className="docs-version"
        aria-label={`Version ${MANTI_VERSION} — what's new`}
      >
        <Badge variant="primary" size="sm">
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
          variant="secondary"
          size="sm"
          leadingIcon={SearchIcon}
          aria-keyshortcuts="Meta+K"
          onClick={() => setOpen(true)}
        >
          Search
          <kbd className="docs-search-shortcut" aria-label="Command K">
            <span aria-hidden="true">⌘</span>
            <span aria-hidden="true">K</span>
          </kbd>
        </Button>
        {/* The Theme Studio is a separate app on its own subdomain, so this is
            a real anchor. Handing it to the router would resolve it as a docs
            route and 404. */}
        <Button
          as="a"
          href={STUDIO_URL}
          target="_blank"
          rel="noreferrer"
          variant="tertiary"
          size="sm"
          trailingIcon={ExternalIcon}
          className="docs-nav-outbound"
        >
          Studio
        </Button>
        <GithubStars />
        <Button
          iconOnly
          variant="tertiary"
          aria-label="Toggle dark theme"
          size="sm"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? MoonIcon : SunIcon}
        </Button>
        <Button
          className="docs-nav-menu-button"
          variant="tertiary"
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
