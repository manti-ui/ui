import { useId } from 'react';
import type {
  HTMLAttributes,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactElement,
  ReactNode,
} from 'react';
import { menu } from '@manti-ui/folds';
import { mergeProps, normalizeProps, Portal, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props';
import type { WithDataAttributes } from '../../internal/props';
import { renderTrigger } from '../../internal/floating';
import type { Placement } from '../../internal/floating';
import { CheckIcon } from '../../internal/icons';

export type MenuPlacement = Placement | 'bottom-center';

export type MenuItemRootProps = WithDataAttributes<
  Omit<HTMLAttributes<HTMLDivElement>, 'children'>
>;

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
  tone?: 'default' | 'danger';
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

export interface MenuProps {
  /** Element that opens the menu. Cloned with the machine's trigger props. */
  trigger: ReactElement;
  /** The menu contents. */
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
  id?: string;
  className?: string;
  contentProps?: Omit<HTMLAttributes<HTMLDivElement>, 'children'>;
  getItemProps?: (item: MenuCommand) => MenuItemRootProps;
}

/**
 * A dropdown command menu backed by the Zag.js menu machine. The machine owns
 * keyboard navigation, typeahead, and dismissal; this adapter renders the
 * translucent panel and its items through a portal.
 */
export function Menu({
  trigger,
  items,
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

  const renderCommand = (item: MenuCommand) => {
    const isOption = item.type === 'checkbox' || item.type === 'radio';
    const machineItemProps = isOption
      ? api.getOptionItemProps({
          type: item.type,
          value: item.value,
          checked: item.checked,
          disabled: item.disabled,
          closeOnSelect: item.closeOnSelect,
          onCheckedChange: item.onCheckedChange,
        })
      : api.getItemProps({ value: item.value, disabled: item.disabled });
    const machineOnClick = machineItemProps.onClick as
      | MouseEventHandler<HTMLElement>
      | undefined;
    const machineOnKeyDown = machineItemProps.onKeyDown as
      | KeyboardEventHandler<HTMLElement>
      | undefined;
    const externalItemProps = mergeProps(
      item.itemProps ?? {},
      getItemProps?.(item) ?? {},
    );
    const externalOnClick = externalItemProps.onClick as
      | MouseEventHandler<HTMLElement>
      | undefined;
    const externalOnKeyDown = externalItemProps.onKeyDown as
      | KeyboardEventHandler<HTMLElement>
      | undefined;
    const externalRootProps = { ...externalItemProps };
    delete externalRootProps.onClick;
    delete externalRootProps.onKeyDown;
    const correctedMachineProps = {
      ...machineItemProps,
      onClick: ((event) => {
        externalOnClick?.(event);
        // Zag 1.41.x selects from prior highlighted state. A synthetic/AT click
        // may not emit pointerdown first, so synchronize the clicked value.
        if (!event.defaultPrevented && !item.disabled) {
          onSelect?.(item.value);
          api.setHighlightedValue(item.value);
        }
        if (!event.defaultPrevented) machineOnClick?.(event);
      }) satisfies MouseEventHandler<HTMLElement>,
      onKeyDown: ((event) => {
        externalOnKeyDown?.(event);
        if (
          !event.defaultPrevented &&
          !item.disabled &&
          (event.key === 'Enter' || event.key === ' ')
        ) {
          onSelect?.(item.value);
        }
        if (!event.defaultPrevented) machineOnKeyDown?.(event);
      }) satisfies KeyboardEventHandler<HTMLElement>,
    };
    const mergedItemProps = mergeProps(
      externalRootProps,
      correctedMachineProps,
    );

    return (
      <div
        key={item.value}
        {...mergedItemProps}
        data-tone={item.tone === 'danger' ? 'danger' : undefined}
        data-variant={item.tone === 'danger' ? 'danger' : undefined}
      >
        {item.icon != null && (
          <span data-scope="menu" data-part="item-icon" aria-hidden="true">
            {item.icon}
          </span>
        )}
        <span data-scope="menu" data-part="item-text">
          {item.label}
        </span>
        {item.shortcut != null && (
          <span data-scope="menu" data-part="item-shortcut">
            {item.shortcut}
          </span>
        )}
        {isOption && (
          <span
            {...api.getItemIndicatorProps({
              value: item.value,
              checked: item.checked,
              disabled: item.disabled,
            })}
          >
            <CheckIcon />
          </span>
        )}
      </div>
    );
  };

  return (
    <>
      {renderTrigger(trigger, api.getTriggerProps())}
      {api.open && (
        <Portal>
          <div {...api.getPositionerProps()}>
            <div
              {...mergeProps(contentProps ?? {}, api.getContentProps())}
              className={cx(contentProps?.className, className)}
            >
              {items.map((item, index) => {
                if ('type' in item && item.type === 'separator') {
                  return (
                    <div
                      key={`separator-${index}`}
                      {...api.getSeparatorProps()}
                    />
                  );
                }
                if ('type' in item && item.type === 'group') {
                  const groupId = `${baseId}-group-${index}`;
                  return (
                    <div
                      key={groupId}
                      {...api.getItemGroupProps({ id: groupId })}
                    >
                      <div
                        {...api.getItemGroupLabelProps({ htmlFor: groupId })}
                      >
                        {item.label}
                      </div>
                      {item.items.map(renderCommand)}
                    </div>
                  );
                }
                return renderCommand(item as MenuCommand);
              })}
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}
