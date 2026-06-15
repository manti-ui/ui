import { useId, useMemo } from 'react';
import type { ReactNode } from 'react';
import { treeView } from '@manti-ui/folds';
import type { MantiTone } from '@manti-ui/tokens';
import { normalizeProps, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props';

export interface TreeNode {
  value: string;
  label: string;
  children?: TreeNode[];
}

export interface TreeViewProps {
  /** Top-level nodes. Branches carry a `children` array. */
  items: TreeNode[];
  /** Optional label above the tree. */
  label?: ReactNode;
  /** Selected-node tone. */
  tone?: MantiTone;
  /** Single or multiple selection. */
  selectionMode?: 'single' | 'multiple';
  /** Values of branches expanded by default. */
  defaultExpandedValue?: string[];
  /** Values selected by default. */
  defaultSelectedValue?: string[];
  /** Called whenever the selection changes. */
  onSelectionChange?: (value: string[]) => void;
  id?: string;
  className?: string;
}

const chevron = (
  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
    <path
      d="M5 3l4 4-4 4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** A nested, keyboard-navigable tree backed by the Zag.js tree-view machine. */
export function TreeView({
  items,
  label,
  tone = 'primary',
  selectionMode = 'single',
  defaultExpandedValue,
  defaultSelectedValue,
  onSelectionChange,
  id,
  className,
}: TreeViewProps) {
  const autoId = useId();
  const collection = useMemo(
    () =>
      treeView.collection<TreeNode>({
        rootNode: { value: 'ROOT', label: '', children: items },
        nodeToValue: (node) => node.value,
        nodeToString: (node) => node.label,
        nodeToChildren: (node) => node.children ?? [],
      }),
    [items],
  );
  const service = useMachine(treeView.machine, {
    id: id ?? autoId,
    collection,
    selectionMode,
    defaultExpandedValue,
    defaultSelectedValue,
    onSelectionChange: onSelectionChange
      ? (details) => onSelectionChange(details.selectedValue)
      : undefined,
  });
  const api = treeView.connect(service, normalizeProps);

  const renderNode = (node: TreeNode, indexPath: number[]): ReactNode => {
    const nodeProps = { node, indexPath };
    const children = node.children;
    if (children != null && children.length > 0) {
      return (
        <div key={node.value} {...api.getBranchProps(nodeProps)}>
          <div {...api.getBranchControlProps(nodeProps)}>
            <span {...api.getBranchIndicatorProps(nodeProps)}>{chevron}</span>
            <span {...api.getBranchTextProps(nodeProps)}>{node.label}</span>
          </div>
          <div {...api.getBranchContentProps(nodeProps)}>
            {children.map((child, index) =>
              renderNode(child, [...indexPath, index]),
            )}
          </div>
        </div>
      );
    }
    return (
      <div key={node.value} {...api.getItemProps(nodeProps)}>
        <span {...api.getItemTextProps(nodeProps)}>{node.label}</span>
      </div>
    );
  };

  return (
    <div {...api.getRootProps()} data-tone={tone} className={cx(className)}>
      {label != null && <h3 {...api.getLabelProps()}>{label}</h3>}
      <div {...api.getTreeProps()}>
        {items.map((node, index) => renderNode(node, [index]))}
      </div>
    </div>
  );
}
