import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'tree-view',
  props: [
    {
      name: 'items',
      type: 'TreeNode[]',
      description: 'Top-level nodes. Branches carry a `children` array.',
    },
    {
      name: 'label',
      type: 'ReactNode',
      description: 'Optional label above the tree.',
    },
    {
      name: 'variant',
      type: 'MantiVariant',
      default: `'primary'`,
      description: 'Selected-node variant.',
    },
    {
      name: 'icon',
      type: '(node: TreeNode, state: TreeNodeState) => ReactNode',
      description:
        'Render an icon before each node label, e.g. folder/file icons. Receives the node and its live state (`isBranch`, `expanded`, `selected`).',
    },
    {
      name: 'selectionMode',
      type: `'single' | 'multiple'`,
      default: `'single'`,
      description: 'Single or multiple selection.',
    },
    {
      name: 'expandedValue',
      type: 'string[]',
      description:
        'Controlled values of the expanded branches. Pair with `onExpandedChange` to let the parent own which rows are open.',
    },
    {
      name: 'defaultExpandedValue',
      type: 'string[]',
      description:
        'Values of branches expanded by default, for uncontrolled usage.',
    },
    {
      name: 'onExpandedChange',
      type: '(value: string[]) => void',
      description:
        'Called whenever a branch opens or closes, with the new expanded values.',
    },
    {
      name: 'selectedValue',
      type: 'string[]',
      description:
        'Controlled values of the selected nodes. Pair with `onSelectionChange` to let the parent own the selection.',
    },
    {
      name: 'defaultSelectedValue',
      type: 'string[]',
      description: 'Values selected by default, for uncontrolled usage.',
    },
    {
      name: 'onSelectionChange',
      type: '(value: string[]) => void',
      description: 'Called whenever the selection changes.',
    },
  ],
  anatomy: [
    { part: 'root', description: 'The outer wrapper that owns the variant.' },
    { part: 'label', description: 'The optional heading above the tree.' },
    { part: 'tree', description: 'The tree container.' },
    { part: 'branch', description: 'A node that has children.' },
    { part: 'branch-control', description: 'The clickable row of a branch.' },
    { part: 'branch-indicator', description: 'The expand/collapse chevron.' },
    {
      part: 'node-icon',
      description: 'The optional leading icon rendered by the `icon` prop.',
    },
    { part: 'branch-text', description: 'A branch label.' },
    { part: 'branch-content', description: 'The nested children of a branch.' },
    { part: 'item', description: 'A leaf node.' },
    { part: 'item-text', description: 'A leaf label.' },
  ],
};
