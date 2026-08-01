/**
 * The declarative `items` shorthand for {@link Menu} and {@link ContextMenu}.
 * It is a thin descriptor layer over the compound parts — everything here
 * renders through `menuParts`, so both API shapes produce the same markup and
 * the same behavior.
 */
import type { ReactNode } from 'react';
import { mergeProps } from '@zag-js/react';

import { menuParts } from './MenuParts';
import type { MenuItemRootProps, MenuTone } from './MenuParts';

interface MenuCommandBase {
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
}

/** A selectable action in the menu. */
export interface MenuActionCommand extends MenuCommandBase {
  type?: 'item';
}

/** A controlled checkable menu item. */
export interface MenuCheckboxCommand extends MenuCommandBase {
  type: 'checkbox';
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  closeOnSelect?: boolean;
}

/** A controlled radio menu item, normally rendered inside a labelled group. */
export interface MenuRadioCommand extends MenuCommandBase {
  type: 'radio';
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  closeOnSelect?: boolean;
}

export type MenuCommand =
  | MenuActionCommand
  | MenuCheckboxCommand
  | MenuRadioCommand;

/** A horizontal divider between groups of items. */
export interface MenuSeparator {
  type: 'separator';
}

/** A titled cluster of commands. */
export interface MenuGroup {
  type: 'group';
  label: ReactNode;
  items: MenuCommand[];
}

export type MenuItem = MenuCommand | MenuSeparator | MenuGroup;

export type MenuGetItemProps = (item: MenuCommand) => MenuItemRootProps;

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

/** Render the declarative `items` shorthand through the compound parts. */
export function renderMenuItems(
  items: MenuItem[],
  getItemProps?: MenuGetItemProps,
) {
  return items.map((item, index) => {
    if ('type' in item && item.type === 'separator') {
      return <menuParts.Separator key={`separator-${index}`} />;
    }
    if ('type' in item && item.type === 'group') {
      return (
        <menuParts.Group key={`group-${index}`}>
          <menuParts.GroupLabel>{item.label}</menuParts.GroupLabel>
          {item.items.map((command) => renderCommand(command, getItemProps))}
        </menuParts.Group>
      );
    }
    return renderCommand(item as MenuCommand, getItemProps);
  });
}
