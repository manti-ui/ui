import { useId } from 'react';
import type { ReactNode } from 'react';
import { navigationMenu } from '@manti-ui/folds';
import { normalizeProps, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props';

export interface NavigationMenuLink {
  href: string;
  label: ReactNode;
  description?: ReactNode;
}

export interface NavigationMenuItem {
  value: string;
  label: ReactNode;
  links: NavigationMenuLink[];
}

export interface NavigationMenuProps {
  /** The top-level menus. */
  items: NavigationMenuItem[];
  /** Controlled open menu value. */
  value?: string;
  /** Initial open menu for uncontrolled usage. */
  defaultValue?: string;
  /** Called whenever the open menu changes. */
  onValueChange?: (value: string) => void;
  id?: string;
  className?: string;
}

/** A site navigation menu with rich dropdowns backed by the Zag.js
 * navigation-menu machine. */
export function NavigationMenu({
  items,
  value,
  defaultValue,
  onValueChange,
  id,
  className,
}: NavigationMenuProps) {
  const autoId = useId();
  const service = useMachine(navigationMenu.machine, {
    id: id ?? autoId,
    value,
    defaultValue,
    onValueChange: onValueChange
      ? (details) => onValueChange(details.value)
      : undefined,
  });
  const api = navigationMenu.connect(service, normalizeProps);

  return (
    <nav {...api.getRootProps()} className={cx(className)}>
      <div {...api.getListProps()}>
        {items.map((item) => (
          <div key={item.value} {...api.getItemProps({ value: item.value })}>
            <button {...api.getTriggerProps({ value: item.value })}>
              {item.label}
              <svg
                data-part="trigger-icon"
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
            </button>
            <div {...api.getContentProps({ value: item.value })}>
              {item.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  {...api.getLinkProps({ value: link.href })}
                >
                  <span data-part="link-label">{link.label}</span>
                  {link.description != null && (
                    <span data-part="link-description">{link.description}</span>
                  )}
                </a>
              ))}
            </div>
          </div>
        ))}
        <div {...api.getIndicatorProps()}>
          <div {...api.getArrowProps()} />
        </div>
      </div>
    </nav>
  );
}
