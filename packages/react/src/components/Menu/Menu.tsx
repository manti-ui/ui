import { useId } from 'react';
import type { HTMLAttributes, ReactElement, ReactNode } from 'react';
import { menu } from '@manti-ui/folds';
import { normalizeProps, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props';
import { renderTrigger } from '../../internal/floating';
import type { Placement } from '../../internal/floating';
import { MenuProvider, menuParts, useMenuSelection } from './MenuParts';
import { renderMenuItems } from './MenuItems';
import type { MenuGetItemProps, MenuItem } from './MenuItems';

export type { MenuItemRootProps, MenuTone } from './MenuParts';
export type {
  MenuActionCommand,
  MenuCheckboxCommand,
  MenuCommand,
  MenuGroup,
  MenuItem,
  MenuRadioCommand,
  MenuSeparator,
} from './MenuItems';
export type {
  ContextMenuTriggerProps,
  MenuCheckboxItemProps,
  MenuContentProps,
  MenuGroupLabelProps,
  MenuGroupProps,
  MenuItemIndicatorProps,
  MenuItemProps,
  MenuItemSlotProps,
  MenuRadioItemProps,
  MenuSeparatorProps,
  MenuTriggerProps,
} from './MenuParts';

export type MenuPlacement = Placement | 'bottom-center';

export interface MenuProps {
  /**
   * Element that opens the menu. Cloned with the machine's trigger props.
   * Composition alternative: render `Menu.Trigger` as a child.
   */
  trigger?: ReactElement;
  /**
   * Declarative menu contents. Omit it and compose `Menu.Content` with
   * `Menu.Item`, `Menu.Group`, and `Menu.Separator` children instead.
   */
  items?: MenuItem[];
  /** Composed parts, used when `items` is omitted. */
  children?: ReactNode;
  /** Placement relative to the trigger. `bottom-center` aliases `bottom`. */
  placement?: MenuPlacement;
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
 * A dropdown command menu backed by the Zag.js menu machine. The machine owns
 * keyboard navigation, typeahead, selection, and dismissal; this adapter renders
 * the translucent panel and its items through a portal.
 *
 * Pass `items` for the declarative shorthand, or compose the parts directly:
 *
 * ```tsx
 * <Menu onSelect={run}>
 *   <Menu.Trigger><Button>Actions</Button></Menu.Trigger>
 *   <Menu.Content>
 *     <Menu.Item value="edit">Edit</Menu.Item>
 *     <Menu.Separator />
 *     <Menu.Item value="delete" tone="danger">Delete</Menu.Item>
 *   </Menu.Content>
 * </Menu>
 * ```
 */
export function Menu({
  trigger,
  items,
  children,
  placement = 'bottom-start',
  onSelect,
  open,
  defaultOpen,
  onOpenChange,
  id,
  className,
  contentProps,
  getItemProps,
}: MenuProps) {
  const autoId = useId();
  const baseId = id ?? autoId;
  const floatingPlacement =
    placement === 'bottom-center' ? 'bottom' : placement;
  const selection = useMenuSelection();
  const service = useMachine(menu.machine, {
    id: baseId,
    positioning: { placement: floatingPlacement },
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
      {trigger != null && renderTrigger(trigger, api.getTriggerProps())}
      {items != null ? (
        <menuParts.Content>
          {renderMenuItems(items, getItemProps)}
        </menuParts.Content>
      ) : (
        children
      )}
    </MenuProvider>
  );
}

Menu.Trigger = menuParts.Trigger;
Menu.Content = menuParts.Content;
Menu.Item = menuParts.Item;
Menu.CheckboxItem = menuParts.CheckboxItem;
Menu.RadioItem = menuParts.RadioItem;
Menu.ItemIcon = menuParts.ItemIcon;
Menu.ItemText = menuParts.ItemText;
Menu.ItemShortcut = menuParts.ItemShortcut;
Menu.ItemIndicator = menuParts.ItemIndicator;
Menu.Group = menuParts.Group;
Menu.GroupLabel = menuParts.GroupLabel;
Menu.Separator = menuParts.Separator;
