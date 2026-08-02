import { useId } from 'react';
import type { HTMLAttributes, ReactElement } from 'react';
import { menu } from '@manti-ui/folds';
import { normalizeProps, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props';
import { renderTrigger } from '../../internal/floating';
import type { Placement } from '../../internal/floating';
import { MenuProvider, menuParts, useMenuSelection } from './MenuParts';
import { MenuItems } from './MenuItems';
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
  MenuSubmenu,
} from './MenuItems';

export type MenuPlacement = Placement | 'bottom-center';

export interface MenuProps {
  /** Element that opens the menu. Cloned with the machine trigger props. */
  trigger: ReactElement;
  /** Declarative commands, groups, separators, options, and submenus. */
  items: MenuItem[];
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
  /** Accessible name for the menu panel. */
  ariaLabel?: string;
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
 * Submenus use the same recursive item model:
 *
 * ```tsx
 * <Menu
 *   trigger={<Button>Actions</Button>}
 *   items={[
 *     { value: 'edit', label: 'Edit' },
 *     { type: 'submenu', value: 'share', label: 'Share', items: [...] },
 *   ]}
 * />
 * ```
 */
export function Menu({
  trigger,
  items,
  placement = 'bottom-start',
  onSelect,
  open,
  defaultOpen,
  onOpenChange,
  ariaLabel,
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
    'aria-label': ariaLabel,
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
        registerItem: selection.registerItem,
        emitSelect: (value) => selection.emit(value, onSelect),
        contentProps,
        contentClassName: cx(className),
      }}
    >
      {renderTrigger(trigger, api.getTriggerProps())}
      <menuParts.Content>
        <MenuItems items={items} getItemProps={getItemProps} />
      </menuParts.Content>
    </MenuProvider>
  );
}
