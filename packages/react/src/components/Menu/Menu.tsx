import { useId } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { menu } from '@manti-ui/folds';
import { normalizeProps, Portal, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props';
import { renderTrigger } from '../../internal/floating';
import type { Placement } from '../../internal/floating';

/** A selectable command in the menu. */
export interface MenuCommand {
  type?: 'item';
  /** Unique value reported to `onSelect`. */
  value: string;
  /** Visible label. */
  label: ReactNode;
  /** Leading icon or affordance. */
  icon?: ReactNode;
  /** Trailing hint, e.g. a keyboard shortcut. */
  shortcut?: ReactNode;
  disabled?: boolean;
}

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
  /** Placement relative to the trigger. */
  placement?: Placement;
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
}

/**
 * A dropdown command menu backed by the Zag.js menu machine. The machine owns
 * keyboard navigation, typeahead, and dismissal; this adapter renders the
 * frosted panel and its items through a portal.
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
}: MenuProps) {
  const autoId = useId();
  const baseId = id ?? autoId;
  const service = useMachine(menu.machine, {
    id: baseId,
    positioning: { placement },
    open,
    defaultOpen,
    onOpenChange: onOpenChange
      ? (details) => onOpenChange(details.open)
      : undefined,
    onSelect: onSelect
      ? (details) => onSelect(details.value)
      : undefined,
  });
  const api = menu.connect(service, normalizeProps);

  const renderCommand = (item: MenuCommand) => (
    <div
      key={item.value}
      {...api.getItemProps({ value: item.value, disabled: item.disabled })}
    >
      {item.icon != null && (
        <span data-scope="menu" data-part="item-icon">
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
    </div>
  );

  return (
    <>
      {renderTrigger(trigger, api.getTriggerProps())}
      {api.open && (
        <Portal>
          <div {...api.getPositionerProps()}>
            <div {...api.getContentProps()} className={cx(className)}>
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
                      <div {...api.getItemGroupLabelProps({ htmlFor: groupId })}>
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
