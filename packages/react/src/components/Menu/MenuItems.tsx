/**
 * The recursive item renderer shared by {@link Menu} and {@link ContextMenu}.
 * Public components expose one declarative model; the parts below are internal
 * adapters around Zag.js anatomy and behavior.
 */
import { useEffect, useId } from 'react';
import type { ReactNode } from 'react';
import { menu } from '@manti-ui/folds';
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props';
import { SubmenuIcon } from '../../internal/icons';
import { MenuProvider, menuParts, useMenuContext } from './MenuParts';
import type { MenuItemRootProps, MenuTone } from './MenuParts';

interface MenuEntryBase {
  /** Unique value reported to `onSelect`. */
  value: string;
  /** Visible label. */
  label: ReactNode;
  /** Leading icon or affordance. */
  icon?: ReactNode;
  /** Trailing hint, e.g. a keyboard shortcut. */
  shortcut?: ReactNode;
  disabled?: boolean;
  /** Semantic visual tone exposed as `data-tone`. */
  tone?: MenuTone;
  /** Props merged onto the actual menu item root. */
  itemProps?: MenuItemRootProps;
  /** Called when this command is selected, after the root `onSelect`. */
  onSelect?: (value: string) => void;
}

/** A selectable action in the menu. */
export interface MenuActionCommand extends MenuEntryBase {
  type?: 'item';
}

/** A controlled checkable menu item. */
export interface MenuCheckboxCommand extends MenuEntryBase {
  type: 'checkbox';
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  closeOnSelect?: boolean;
}

/** A controlled radio menu item, normally rendered inside a labelled group. */
export interface MenuRadioCommand extends MenuEntryBase {
  type: 'radio';
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  closeOnSelect?: boolean;
}

export type MenuCommand =
  | MenuActionCommand
  | MenuCheckboxCommand
  | MenuRadioCommand;

/** A command that opens another menu rendered by the same recursive API. */
export interface MenuSubmenu extends Omit<MenuEntryBase, 'onSelect'> {
  type: 'submenu';
  /** Nested menu contents. Submenus may contain more submenus. */
  items: MenuItem[];
  /** Accessible name when `label` is not plain text. */
  ariaLabel?: string;
}

export type MenuEntry = MenuCommand | MenuSubmenu;

/** A horizontal divider between groups of items. */
export interface MenuSeparator {
  type: 'separator';
}

/** A titled cluster of commands. */
export interface MenuGroup {
  type: 'group';
  label: ReactNode;
  items: MenuEntry[];
}

export type MenuItem = MenuCommand | MenuSubmenu | MenuSeparator | MenuGroup;

export type MenuGetItemProps = (item: MenuEntry) => MenuItemRootProps;

function renderCommand(item: MenuCommand, getItemProps?: MenuGetItemProps) {
  const externalProps = mergeProps(
    item.itemProps ?? {},
    getItemProps?.(item) ?? {},
  ) as MenuItemRootProps;
  const shared = {
    value: item.value,
    disabled: item.disabled,
    tone: item.tone,
    icon: item.icon,
    shortcut: item.shortcut,
    onSelect: item.onSelect,
    ...externalProps,
  };

  if (item.type === 'checkbox' || item.type === 'radio') {
    const Option =
      item.type === 'checkbox' ? menuParts.CheckboxItem : menuParts.RadioItem;
    return (
      <Option
        key={item.value}
        {...shared}
        checked={item.checked}
        onCheckedChange={item.onCheckedChange}
        closeOnSelect={item.closeOnSelect}
      >
        {item.label}
      </Option>
    );
  }

  return (
    <menuParts.Item key={item.value} {...shared}>
      {item.label}
    </menuParts.Item>
  );
}

interface MenuItemsProps {
  items: MenuItem[];
  getItemProps?: MenuGetItemProps;
}

interface MenuEntryRendererProps {
  item: MenuEntry;
  getItemProps?: MenuGetItemProps;
}

function MenuEntryRenderer({ item, getItemProps }: MenuEntryRendererProps) {
  if (item.type === 'submenu') {
    return <MenuSubmenuItem item={item} getItemProps={getItemProps} />;
  }
  return renderCommand(item, getItemProps);
}

function MenuSubmenuItem({
  item,
  getItemProps,
}: MenuEntryRendererProps & {
  item: MenuSubmenu;
}) {
  const parent = useMenuContext('Menu submenu');
  const autoId = useId();
  const service = useMachine(menu.machine, {
    id: `${autoId}-${item.value}`,
    'aria-label':
      item.ariaLabel ??
      (typeof item.label === 'string' ? item.label : undefined),
  });
  const api = menu.connect(service, normalizeProps);

  useEffect(() => {
    menu.connect(parent.service, normalizeProps).setChild(service);
    menu.connect(service, normalizeProps).setParent(parent.service);
  }, [parent.service, service]);

  const externalProps = mergeProps(
    item.itemProps ?? {},
    getItemProps?.(item) ?? {},
  ) as MenuItemRootProps;
  const machineProps = parent.api.getTriggerItemProps(api);
  const toneProps =
    item.tone === 'danger'
      ? { 'data-tone': 'danger', 'data-variant': 'danger' }
      : {};
  const disabledProps = item.disabled
    ? { 'aria-disabled': true, 'data-disabled': '' }
    : {};
  const mergedProps = mergeProps(
    externalProps,
    machineProps,
    toneProps,
    disabledProps,
  );

  return (
    <>
      <div {...mergedProps} className={cx(mergedProps.className)}>
        {item.icon != null && (
          <menuParts.ItemIcon>{item.icon}</menuParts.ItemIcon>
        )}
        <menuParts.ItemText>{item.label}</menuParts.ItemText>
        {item.shortcut != null && (
          <menuParts.ItemShortcut>{item.shortcut}</menuParts.ItemShortcut>
        )}
        <SubmenuIcon data-scope="menu" data-part="submenu-indicator" />
      </div>
      <MenuProvider
        value={{
          api,
          service,
          nested: true,
          registerItem: parent.registerItem,
          emitSelect: parent.emitSelect,
        }}
      >
        <menuParts.Content>
          <MenuItems items={item.items} getItemProps={getItemProps} />
        </menuParts.Content>
      </MenuProvider>
    </>
  );
}

/** Render the declarative menu model, including recursive submenus. */
export function MenuItems({ items, getItemProps }: MenuItemsProps) {
  return items.map((item, index) => {
    if ('type' in item && item.type === 'separator') {
      return <menuParts.Separator key={`separator-${index}`} />;
    }
    if ('type' in item && item.type === 'group') {
      return (
        <menuParts.Group key={`group-${index}`}>
          <menuParts.GroupLabel>{item.label}</menuParts.GroupLabel>
          {item.items.map((entry) => (
            <MenuEntryRenderer
              key={entry.value}
              item={entry}
              getItemProps={getItemProps}
            />
          ))}
        </menuParts.Group>
      );
    }
    const entry = item as MenuEntry;
    return (
      <MenuEntryRenderer
        key={entry.value}
        item={entry}
        getItemProps={getItemProps}
      />
    );
  });
}
