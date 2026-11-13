import { useEffect, useId, useRef } from 'react';
import type { HTMLAttributes, ReactElement } from 'react';
import { menu } from '@manti-ui/folds';
import { normalizeProps, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props.js';
import { renderTrigger, useFocusOrigin } from '../../internal/floating.js';
import type { GetAnchorRect, Placement } from '../../internal/floating.js';
import { MenuProvider, menuParts, useMenuSelection } from './MenuParts.js';
import type { MenuSize } from './MenuParts.js';
import { MenuItems } from './MenuItems.js';
import type { MenuGetItemProps, MenuItem } from './MenuItems.js';

export type { MenuItemRootProps, MenuSize, MenuTone } from './MenuParts.js';
export type {
  MenuActionCommand,
  MenuCheckboxCommand,
  MenuCommand,
  MenuGroup,
  MenuItem,
  MenuRadioCommand,
  MenuSeparator,
  MenuSubmenu,
} from './MenuItems.js';

export type MenuPlacement = Placement | 'bottom-center';

export interface MenuProps {
  /**
   * Element that opens the menu. Cloned with the machine trigger props.
   * Optional: without it, open the menu with `open` and place it with
   * `getAnchorRect`.
   */
  trigger?: ReactElement;
  /** Declarative commands, groups, separators, options, and submenus. */
  items: MenuItem[];
  /**
   * Placement relative to the trigger, or to the `getAnchorRect` rect.
   * `bottom-center` aliases `bottom`.
   */
  placement?: MenuPlacement;
  /**
   * Place the panel at this rect (viewport coordinates) instead of the
   * trigger. Return `null` to fall back to the trigger.
   */
  getAnchorRect?: GetAnchorRect;
  /**
   * Element to focus when the menu closes. Defaults to the trigger, or, with
   * no trigger, to the element that had focus when the menu opened.
   */
  finalFocusEl?: () => HTMLElement | null;
  /**
   * Move focus back on close (to `finalFocusEl` or its default). With
   * `false` the adapter leaves focus where the machine put it. @default true
   */
  restoreFocus?: boolean;
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
  getAnchorRect,
  finalFocusEl,
  restoreFocus = true,
  size = 'md',
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
    positioning: { placement: floatingPlacement, getAnchorRect },
    'aria-label': ariaLabel,
    open,
    defaultOpen,
    onOpenChange: onOpenChange
      ? (details) => onOpenChange(details.open)
      : undefined,
  });
  const api = menu.connect(service, normalizeProps);
  const triggerId = api.getTriggerProps().id;
  const hasTrigger = trigger != null;

  // `@zag-js/menu` has no `finalFocusEl` or `restoreFocus`: it refocuses its
  // trigger on close, and with no trigger focus falls to the body. So the
  // adapter does the rest, after the machine's own refocus has run.
  const focusOrigin = useRef<HTMLElement | null>(null);
  useFocusOrigin(focusOrigin, api.open);
  const wasOpen = useRef(api.open);
  useEffect(() => {
    const closed = wasOpen.current && !api.open;
    wasOpen.current = api.open;
    if (!closed || !restoreFocus || (hasTrigger && !finalFocusEl)) return;
    queueMicrotask(() => {
      // Focus the user moved on purpose (a click into another field) stays.
      const active = document.activeElement;
      const dropped =
        active == null ||
        active === document.body ||
        (active instanceof HTMLElement && active.id === triggerId);
      if (!dropped) return;
      const target = finalFocusEl
        ? finalFocusEl()
        : hasTrigger
          ? null
          : focusOrigin.current;
      target?.focus({ preventScroll: true });
    });
  }, [api.open, restoreFocus, hasTrigger, finalFocusEl, triggerId]);

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
      {renderTrigger(trigger, api.getTriggerProps())}
      <menuParts.Content>
        <MenuItems items={items} getItemProps={getItemProps} />
      </menuParts.Content>
    </MenuProvider>
  );
}
