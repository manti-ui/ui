import { NavLink } from 'react-router-dom';
import { ScrollArea } from '@manti-ui/react';

import { navGroups } from '../data/navigation';

/** The grouped page list. Shared by the desktop sidebar and the mobile menu. */
export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Documentation">
      {navGroups.map((group) => (
        <div key={group.label} className="docs-nav-group">
          <p className="docs-nav-group-label">{group.label}</p>
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
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
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
