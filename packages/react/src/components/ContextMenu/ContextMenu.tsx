import { useId } from 'react';
import type { ReactNode } from 'react';
import { menu } from '@manti-ui/folds';
import { normalizeProps, Portal, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props';
import type { MenuCommand, MenuItem } from '../Menu/Menu';

export interface ContextMenuProps {
  /** The region that opens the menu on right-click (or long-press on touch). */
  children: ReactNode;
  /** The menu contents. */
  items: MenuItem[];
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
 * A right-click (or long-press) context menu backed by the same Zag.js menu
 * machine as {@link Menu}, opened at the pointer via its context trigger. The
 * machine owns keyboard navigation, typeahead, positioning, and dismissal; this
 * adapter wraps the target region and renders the frosted panel through a portal.
 * It reuses the `menu` style scope, so its panel matches the dropdown menu.
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
}: ContextMenuProps) {
  const autoId = useId();
  const baseId = id ?? autoId;
  const service = useMachine(menu.machine, {
    id: baseId,
    open,
    defaultOpen,
    onOpenChange: onOpenChange
      ? (details) => onOpenChange(details.open)
      : undefined,
    onSelect: onSelect ? (details) => onSelect(details.value) : undefined,
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
      <div {...api.getContextTriggerProps()}>{children}</div>
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
