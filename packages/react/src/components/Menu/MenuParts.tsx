/**
 * Compound parts shared by {@link Menu} and {@link ContextMenu}. Both drive the
 * same Zag.js menu machine and render into the same `menu` style scope, so they
 * differ only in how the menu is opened — everything below the trigger is one
 * set of parts.
 *
 * A root publishes its connected machine through `MenuContext`; every part
 * reads the machine from there rather than through props, so consumers can
 * compose the panel freely.
 */
import {
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
} from 'react';
import type { HTMLAttributes, MouseEventHandler, ReactNode } from 'react';
import type { menu } from '@manti-ui/folds';
import { mergeProps } from '@zag-js/react';
import type { PropTypes } from '@zag-js/react';

import { Portal } from '../../internal/Portal';
import { cx } from '../../internal/props';
import type { WithDataAttributes } from '../../internal/props';
import { renderTrigger } from '../../internal/floating';
import { CheckIcon } from '../../internal/icons';

export type MenuApi = menu.Api<PropTypes>;

/** Semantic visual tone of a command, exposed as `data-tone` / `data-variant`. */
export type MenuTone = 'default' | 'danger';

/** Props accepted by a command's root element. */
export type MenuItemRootProps = WithDataAttributes<
  Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onSelect'>
>;

type MenuSelectHandler = (value: string) => void;

interface MenuContextValue {
  api: MenuApi;
  /**
   * Subscribe a command's own `onSelect` to the menu's selection event.
   * Returns an unsubscribe function.
   */
  registerItem: (value: string, handler: MenuSelectHandler) => () => void;
  /** Report a command as selected. */
  emitSelect: (value: string) => void;
  /** Defaults merged onto `Menu.Content`, so both API shapes style it alike. */
  contentProps?: Omit<HTMLAttributes<HTMLDivElement>, 'children'>;
  contentClassName?: string;
}

const MenuContext = createContext<MenuContextValue | null>(null);

export const MenuProvider = MenuContext.Provider;

export function useMenuContext(part: string): MenuContextValue {
  const context = useContext(MenuContext);
  if (context == null) {
    throw new Error(
      `${part} must be rendered inside a <Menu> or <ContextMenu>.`,
    );
  }
  return context;
}

/**
 * Fans one selection out to the root's `onSelect` and to the selected command's
 * own handler.
 *
 * Selection is reported from the activated command rather than from the
 * machine's `onSelect`: the machine reports whatever it has *highlighted*, which
 * a synthetic or assistive click never sets. Every activation path ends in a
 * click on the command — the machine turns Enter and typeahead into a real
 * `click()` on the highlighted element — so the command's own click handler
 * sees them all exactly once.
 */
export function useMenuSelection() {
  const handlers = useRef(new Map<string, MenuSelectHandler>());

  const registerItem = useCallback(
    (value: string, handler: MenuSelectHandler) => {
      handlers.current.set(value, handler);
      return () => {
        if (handlers.current.get(value) === handler) {
          handlers.current.delete(value);
        }
      };
    },
    [],
  );

  const emit = useCallback((value: string, onSelect?: MenuSelectHandler) => {
    onSelect?.(value);
    handlers.current.get(value)?.(value);
  }, []);

  return { registerItem, emit };
}

/** Identity of the enclosing command, so item slots can ask for their state. */
interface MenuItemContextValue {
  value: string;
  disabled?: boolean;
  checked?: boolean;
}

const MenuItemContext = createContext<MenuItemContextValue | null>(null);

/** Identity of the enclosing `Menu.Group`, so its label can point back at it. */
const MenuGroupContext = createContext<string | null>(null);

/* -------------------------------------------------------------------------- */
/* Triggers                                                                    */
/* -------------------------------------------------------------------------- */

export interface MenuTriggerProps extends HTMLAttributes<HTMLElement> {
  /**
   * The element that opens the menu. A single element child is cloned with the
   * machine's trigger props; anything else is wrapped in a plain button.
   */
  children?: ReactNode;
}

function MenuTrigger({ children, ...rest }: MenuTriggerProps) {
  const { api } = useMenuContext('Menu.Trigger');
  const triggerProps = mergeProps(rest, api.getTriggerProps());
  if (isValidElement(children)) {
    return <>{renderTrigger(children, triggerProps)}</>;
  }
  return (
    <button type="button" {...triggerProps}>
      {children}
    </button>
  );
}

export type ContextMenuTriggerProps = HTMLAttributes<HTMLDivElement>;

/** The region that opens a context menu on right-click (or long-press). */
function ContextMenuTrigger({ className, ...rest }: ContextMenuTriggerProps) {
  const { api } = useMenuContext('ContextMenu.Trigger');
  return (
    <div
      {...mergeProps(rest, api.getContextTriggerProps())}
      className={cx(className)}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Content                                                                     */
/* -------------------------------------------------------------------------- */

export interface MenuContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Props merged onto the positioner that wraps the panel. */
  positionerProps?: HTMLAttributes<HTMLDivElement>;
}

/**
 * The floating panel. Renders nothing while the menu is closed, and portals the
 * open panel out of the trigger's stacking context.
 */
function MenuContent({
  children,
  className,
  positionerProps,
  ...rest
}: MenuContentProps) {
  const {
    api,
    contentProps: rootContentProps,
    contentClassName,
  } = useMenuContext('Menu.Content');
  if (!api.open) return null;
  return (
    <Portal>
      <div {...mergeProps(positionerProps ?? {}, api.getPositionerProps())}>
        <div
          {...mergeProps(rootContentProps ?? {}, rest, api.getContentProps())}
          className={cx(
            rootContentProps?.className,
            contentClassName,
            className,
          )}
        >
          {children}
        </div>
      </div>
    </Portal>
  );
}

/* -------------------------------------------------------------------------- */
/* Command slots                                                               */
/* -------------------------------------------------------------------------- */

export type MenuItemSlotProps = HTMLAttributes<HTMLSpanElement>;

/** Leading icon or affordance on a command. */
function MenuItemIcon({ className, ...rest }: MenuItemSlotProps) {
  return (
    <span
      data-scope="menu"
      data-part="item-icon"
      aria-hidden="true"
      className={cx(className)}
      {...rest}
    />
  );
}

/** The command label. Grows to fill the row so trailing slots align right. */
function MenuItemText({ className, ...rest }: MenuItemSlotProps) {
  const context = useContext(MenuContext);
  const item = useContext(MenuItemContext);
  const machineProps: MenuItemSlotProps =
    context != null && item != null
      ? (context.api.getItemTextProps(item) as MenuItemSlotProps)
      : ({
          'data-scope': 'menu',
          'data-part': 'item-text',
        } as MenuItemSlotProps);
  return <span {...mergeProps(rest, machineProps)} className={cx(className)} />;
}

/** Trailing hint, e.g. a keyboard shortcut. */
function MenuItemShortcut({ className, ...rest }: MenuItemSlotProps) {
  return (
    <span
      data-scope="menu"
      data-part="item-shortcut"
      className={cx(className)}
      {...rest}
    />
  );
}

export interface MenuItemIndicatorProps extends MenuItemSlotProps {
  /** Icon shown while the command is checked. Defaults to a check mark. */
  children?: ReactNode;
}

/** Checked indicator for checkbox and radio commands. */
function MenuItemIndicator({
  children,
  className,
  ...rest
}: MenuItemIndicatorProps) {
  const { api } = useMenuContext('Menu.ItemIndicator');
  const item = useContext(MenuItemContext);
  if (item == null) {
    throw new Error('Menu.ItemIndicator must be rendered inside a menu item.');
  }
  return (
    <span
      {...mergeProps(rest, api.getItemIndicatorProps(item))}
      className={cx(className)}
    >
      {children ?? <CheckIcon />}
    </span>
  );
}

/**
 * Slots a command may lay out itself. When one of them appears among an item's
 * children, the item stops wrapping those children in a text slot and hands the
 * row's layout over to the consumer.
 */
const ITEM_SLOTS = new Set<unknown>([
  MenuItemIcon,
  MenuItemText,
  MenuItemShortcut,
  MenuItemIndicator,
]);

function inspectChildren(children: ReactNode) {
  let hasSlot = false;
  let hasIndicator = false;
  const visit = (node: ReactNode) => {
    if (Array.isArray(node)) {
      node.forEach((child) => visit(child as ReactNode));
      return;
    }
    if (!isValidElement(node)) return;
    if (ITEM_SLOTS.has(node.type)) hasSlot = true;
    if (node.type === MenuItemIndicator) hasIndicator = true;
  };
  visit(children);
  return { hasSlot, hasIndicator };
}

/* -------------------------------------------------------------------------- */
/* Commands                                                                    */
/* -------------------------------------------------------------------------- */

interface MenuItemOwnProps {
  /** Unique value reported to `onSelect`. */
  value: string;
  disabled?: boolean;
  /** Semantic visual tone exposed as `data-tone`. */
  tone?: MenuTone;
  /** Leading icon or affordance. Shorthand for `Menu.ItemIcon`. */
  icon?: ReactNode;
  /** Trailing hint, e.g. a keyboard shortcut. Shorthand for `Menu.ItemShortcut`. */
  shortcut?: ReactNode;
  /** Close the menu once this command is activated. */
  closeOnSelect?: boolean;
  /** Called when this command is activated, alongside the root's `onSelect`. */
  onSelect?: MenuSelectHandler;
}

export interface MenuItemProps
  extends
    MenuItemOwnProps,
    WithDataAttributes<Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'>> {}

export interface MenuCheckboxItemProps extends MenuItemProps {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export type MenuRadioItemProps = MenuCheckboxItemProps;

interface MenuCommandItemProps extends MenuItemProps {
  type?: 'checkbox' | 'radio';
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

function MenuCommandItem({
  type,
  value,
  disabled,
  tone,
  icon,
  shortcut,
  closeOnSelect,
  onSelect,
  checked,
  onCheckedChange,
  children,
  className,
  ...rest
}: MenuCommandItemProps) {
  const { api, registerItem, emitSelect } = useMenuContext('Menu.Item');
  const isOption = type === 'checkbox' || type === 'radio';

  useEffect(() => {
    if (onSelect == null) return;
    return registerItem(value, onSelect);
  }, [registerItem, value, onSelect]);

  const machineItemProps = isOption
    ? api.getOptionItemProps({
        type,
        value,
        checked: checked ?? false,
        disabled,
        closeOnSelect,
        onCheckedChange,
      })
    : api.getItemProps({ value, disabled, closeOnSelect });

  const machineOnClick = machineItemProps.onClick as
    | MouseEventHandler<HTMLDivElement>
    | undefined;
  const { onClick: externalOnClick, ...rootRest } = rest;

  const correctedMachineProps = {
    ...machineItemProps,
    onClick: ((event) => {
      externalOnClick?.(event);
      if (event.defaultPrevented) return;
      if (!disabled) {
        emitSelect(value);
        api.setHighlightedValue(value);
      }
      machineOnClick?.(event);
    }) satisfies MouseEventHandler<HTMLDivElement>,
  };

  const toneProps =
    tone === 'danger'
      ? { 'data-tone': 'danger', 'data-variant': 'danger' }
      : {};

  const { hasSlot, hasIndicator } = inspectChildren(children);
  const itemState: MenuItemContextValue = isOption
    ? { value, disabled, checked: checked ?? false }
    : { value, disabled };

  return (
    <MenuItemContext.Provider value={itemState}>
      <div
        {...mergeProps(rootRest, correctedMachineProps, toneProps)}
        className={cx(className)}
      >
        {icon != null && <MenuItemIcon>{icon}</MenuItemIcon>}
        {hasSlot ? children : <MenuItemText>{children}</MenuItemText>}
        {shortcut != null && <MenuItemShortcut>{shortcut}</MenuItemShortcut>}
        {isOption && !hasIndicator && <MenuItemIndicator />}
      </div>
    </MenuItemContext.Provider>
  );
}

/** A selectable command. */
function MenuItem(props: MenuItemProps) {
  return <MenuCommandItem {...props} />;
}

/** A controlled checkable command, rendered as `menuitemcheckbox`. */
function MenuCheckboxItem(props: MenuCheckboxItemProps) {
  return <MenuCommandItem {...props} type="checkbox" />;
}

/** A controlled radio command, normally rendered inside a labelled group. */
function MenuRadioItem(props: MenuRadioItemProps) {
  return <MenuCommandItem {...props} type="radio" />;
}

/* -------------------------------------------------------------------------- */
/* Grouping                                                                    */
/* -------------------------------------------------------------------------- */

export type MenuGroupProps = HTMLAttributes<HTMLDivElement>;

/** A titled cluster of commands. Pair with `Menu.GroupLabel`. */
function MenuGroup({ id, className, children, ...rest }: MenuGroupProps) {
  const { api } = useMenuContext('Menu.Group');
  const autoId = useId();
  const groupId = id ?? autoId;
  return (
    <MenuGroupContext.Provider value={groupId}>
      <div
        {...mergeProps(rest, api.getItemGroupProps({ id: groupId }))}
        className={cx(className)}
      >
        {children}
      </div>
    </MenuGroupContext.Provider>
  );
}

export type MenuGroupLabelProps = HTMLAttributes<HTMLDivElement>;

/** The heading of a `Menu.Group`. */
function MenuGroupLabel({ className, ...rest }: MenuGroupLabelProps) {
  const { api } = useMenuContext('Menu.GroupLabel');
  const groupId = useContext(MenuGroupContext);
  if (groupId == null) {
    throw new Error('Menu.GroupLabel must be rendered inside a <Menu.Group>.');
  }
  return (
    <div
      {...mergeProps(rest, api.getItemGroupLabelProps({ htmlFor: groupId }))}
      className={cx(className)}
    />
  );
}

export type MenuSeparatorProps = HTMLAttributes<HTMLDivElement>;

/** A divider between clusters of commands. */
function MenuSeparator({ className, ...rest }: MenuSeparatorProps) {
  const { api } = useMenuContext('Menu.Separator');
  return (
    <div
      {...mergeProps(rest, api.getSeparatorProps())}
      className={cx(className)}
    />
  );
}

/** Every part below the trigger, shared by `Menu` and `ContextMenu`. */
export const menuParts = {
  Trigger: MenuTrigger,
  ContextTrigger: ContextMenuTrigger,
  Content: MenuContent,
  Item: MenuItem,
  CheckboxItem: MenuCheckboxItem,
  RadioItem: MenuRadioItem,
  ItemIcon: MenuItemIcon,
  ItemText: MenuItemText,
  ItemShortcut: MenuItemShortcut,
  ItemIndicator: MenuItemIndicator,
  Group: MenuGroup,
  GroupLabel: MenuGroupLabel,
  Separator: MenuSeparator,
};
