import { useId } from 'react';
import type { ReactNode } from 'react';
import { splitter } from '@manti-ui/folds';
import { normalizeProps, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props';

export interface SplitterPanel {
  id: string;
  content: ReactNode;
  minSize?: number;
  maxSize?: number;
  collapsible?: boolean;
}

export interface SplitterProps {
  /** The resizable panels, in order. */
  panels: SplitterPanel[];
  /** Layout direction. */
  orientation?: 'horizontal' | 'vertical';
  /** Controlled panel sizes (percentages). */
  size?: number[];
  /** Initial panel sizes for uncontrolled usage. */
  defaultSize?: number[];
  /** Called while resizing. */
  onResize?: (size: number[]) => void;
  id?: string;
  className?: string;
}

/** A resizable split layout backed by the Zag.js splitter machine. */
export function Splitter({
  panels,
  orientation = 'horizontal',
  size,
  defaultSize,
  onResize,
  id,
  className,
}: SplitterProps) {
  const autoId = useId();
  const service = useMachine(splitter.machine, {
    id: id ?? autoId,
    orientation,
    panels: panels.map(({ id: panelId, minSize, maxSize, collapsible }) => ({
      id: panelId,
      minSize,
      maxSize,
      collapsible,
    })),
    size,
    defaultSize,
    onResize: onResize ? (details) => onResize(details.size) : undefined,
  });
  const api = splitter.connect(service, normalizeProps);

  return (
    <div {...api.getRootProps()} className={cx(className)}>
      {panels.map((panel, index) => (
        <div key={panel.id} style={{ display: 'contents' }}>
          <div {...api.getPanelProps({ id: panel.id })}>{panel.content}</div>
          {index < panels.length - 1 && (
            <div
              {...api.getResizeTriggerProps({
                id: `${panel.id}:${panels[index + 1].id}`,
              })}
            />
          )}
        </div>
      ))}
    </div>
  );
}
