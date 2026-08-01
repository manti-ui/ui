import { useId } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { menu } from '@manti-ui/folds';
import { normalizeProps, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props';
import { MenuProvider, menuParts, useMenuSelection } from '../Menu/MenuParts';
import { renderMenuItems } from '../Menu/MenuItems';
import type { MenuGetItemProps, MenuItem } from '../Menu/MenuItems';

export interface ContextMenuProps {
  /**
   * With `items`, the region that opens the menu on right-click (or long-press
   * on touch). Without it, the composed parts — `ContextMenu.Trigger` and
   * `ContextMenu.Content`.
   */
  children?: ReactNode;
  /**
   * Declarative menu contents. Omit it and compose `ContextMenu.Content` with
   * `ContextMenu.Item`, `ContextMenu.Group`, and `ContextMenu.Separator`.
   */
  items?: MenuItem[];
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
 * Pass `items` with the target region as `children`, or compose the parts:
 *
 * ```tsx
 * <ContextMenu onSelect={run}>
 *   <ContextMenu.Trigger>{region}</ContextMenu.Trigger>
 *   <ContextMenu.Content>
 *     <ContextMenu.Item value="copy">Copy</ContextMenu.Item>
 *   </ContextMenu.Content>
 * </ContextMenu>
 * ```
 */
export function ContextMenu({
  children,
  items,
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
        registerItem: selection.registerItem,
        emitSelect: (value) => selection.emit(value, onSelect),
        contentProps,
        contentClassName: cx(className),
      }}
    >
      {items != null ? (
        <>
          <menuParts.ContextTrigger>{children}</menuParts.ContextTrigger>
          <menuParts.Content>
            {renderMenuItems(items, getItemProps)}
          </menuParts.Content>
        </>
      ) : (
        children
      )}
    </MenuProvider>
  );
}

ContextMenu.Trigger = menuParts.ContextTrigger;
ContextMenu.Content = menuParts.Content;
ContextMenu.Item = menuParts.Item;
ContextMenu.CheckboxItem = menuParts.CheckboxItem;
ContextMenu.RadioItem = menuParts.RadioItem;
ContextMenu.ItemIcon = menuParts.ItemIcon;
ContextMenu.ItemText = menuParts.ItemText;
ContextMenu.ItemShortcut = menuParts.ItemShortcut;
ContextMenu.ItemIndicator = menuParts.ItemIndicator;
ContextMenu.Group = menuParts.Group;
ContextMenu.GroupLabel = menuParts.GroupLabel;
ContextMenu.Separator = menuParts.Separator;
