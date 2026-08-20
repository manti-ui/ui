import { NavLink, useLocation } from 'react-router-dom';
import { Collapsible, ScrollArea } from '@manti-ui/react';

import { navGroups } from '../data/navigation';

const CONTEXTUAL_GROUPS = new Map([
  ['/foundations', 'Foundations'],
  ['/changelog', 'Changelog'],
]);

function groupForPath(pathname: string): string | undefined {
  for (const [prefix, label] of CONTEXTUAL_GROUPS) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return label;
    }
  }
  return undefined;
}

function visibleGroups(pathname: string) {
  const contextualGroup = groupForPath(pathname);
  if (contextualGroup) {
    return navGroups.filter((group) => group.label === contextualGroup);
  }

  return navGroups.filter(
    (group) => !CONTEXTUAL_GROUPS.has(`/${group.label.toLowerCase()}`),
  );
}

/**
 * The grouped page list. Shared by the desktop sidebar and the mobile menu.
 * Each group is a Manti Collapsible so categories can be expanded/collapsed;
 * open by default, with the state persisting across in-app navigation (the
 * sidebar lives in the persistent layout shell).
 */
export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const { pathname } = useLocation();

  return (
    <nav aria-label="Documentation" className="docs-sidebar-nav">
      {visibleGroups(pathname).map((group) => (
        <Collapsible
          key={group.label}
          className="docs-nav-group"
          defaultOpen
          trigger={<span>{group.label}</span>}
        >
          <ul className="docs-nav-list">
            {group.items.map((item) => (
              <li key={item.slug}>
                <NavLink
                  to={item.slug}
                  end
                  className="docs-side-link"
                  onClick={onNavigate}
                >
                  {item.title}
                  {item.badge && (
                    <span className="docs-side-badge" data-variant="primary">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </Collapsible>
      ))}
    </nav>
  );
}

export function Sidebar() {
  return (
    <aside className="docs-sidebar">
      <ScrollArea className="docs-sidebar-scroll">
        <div className="docs-sidebar-inner">
          <SidebarNav />
        </div>
      </ScrollArea>
    </aside>
  );
}
