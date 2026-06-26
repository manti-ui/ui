import { NavLink } from 'react-router-dom';
import { Collapsible, ScrollArea } from '@manti-ui/react';

import { navGroups } from '../data/navigation';

function ChevronIcon() {
  return (
    <svg
      className="docs-nav-group-chevron"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      aria-hidden="true"
    >
      <path
        d="M3 4.5L6 7.5l3-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * The grouped page list. Shared by the desktop sidebar and the mobile menu.
 * Each group is a Manti Collapsible so categories can be expanded/collapsed;
 * open by default, with the state persisting across in-app navigation (the
 * sidebar lives in the persistent layout shell).
 */
export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Documentation" className="docs-sidebar-nav">
      {navGroups.map((group) => (
        <Collapsible
          key={group.label}
          className="docs-nav-group"
          defaultOpen
          trigger={
            <>
              <span>{group.label}</span>
              <ChevronIcon />
            </>
          }
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
                    <span className="docs-side-badge" data-tone="primary">
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
