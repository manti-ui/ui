import { useId } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { menu } from '@manti-ui/folds';
import { normalizeProps, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props';
import { MenuProvider, menuParts, useMenuSelection } from '../Menu/MenuParts';
import type { MenuSize } from '../Menu/MenuParts';
import { MenuItems } from '../Menu/MenuItems';
import type { MenuGetItemProps, MenuItem } from '../Menu/MenuItems';

export interface ContextMenuProps {
  /** Region that opens the menu on right-click or long-press. */
  children: ReactNode;
  /** Declarative commands, groups, separators, options, and submenus. */
  items: MenuItem[];
  /** Row rhythm of the panel. Submenus inherit it. */
  size?: MenuSize;
  /** Called with the value of the selected command. */
  onSelect?: (value: string) => void;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state for uncontrolled usage. */
  defaultOpen?: boolean;
  /** Called whenever the open state changes. */
  onOpenChange?: (open: boolean) => void;
  id?: string;
  /** Class applied to the floating panel. */
  className?: string;
  contentProps?: Omit<HTMLAttributes<HTMLDivElement>, 'children'>;
  getItemProps?: MenuGetItemProps;
}

/**
 * A right-click (or long-press) context menu backed by the same Zag.js menu
 * machine as {@link Menu}, opened at the pointer via its context trigger. The
 * machine owns keyboard navigation, typeahead, positioning, and dismissal; this
 * adapter renders the translucent panel through a portal. It shares the `menu`
 * style scope and every part below the trigger with {@link Menu}, so its panel
 * matches the dropdown menu.
 *
 * Pass the target region as `children` and describe the menu with `items`.
 *
 * ```tsx
 * <ContextMenu items={[{ value: 'copy', label: 'Copy' }]} onSelect={run}>
 *   {region}
 * </ContextMenu>
 * ```
 */
export function ContextMenu({
  children,
  items,
  size = 'md',
  onSelect,
  open,
  defaultOpen,
  onOpenChange,
  id,
  className,
  contentProps,
  getItemProps,
}: ContextMenuProps) {
  const autoId = useId();
  const baseId = id ?? autoId;
  const selection = useMenuSelection();
  const service = useMachine(menu.machine, {
    id: baseId,
    open,
    defaultOpen,
    onOpenChange: onOpenChange
      ? (details) => onOpenChange(details.open)
      : undefined,
  });
  const api = menu.connect(service, normalizeProps);

  return (
    <MenuProvider
      value={{
        api,
        service,
        size,
        registerItem: selection.registerItem,
        emitSelect: (value) => selection.emit(value, onSelect),
        contentProps,
        contentClassName: cx(className),
      }}
    >
      <menuParts.ContextTrigger>{children}</menuParts.ContextTrigger>
      <menuParts.Content>
        <MenuItems items={items} getItemProps={getItemProps} />
      </menuParts.Content>
    </MenuProvider>
  );
}
