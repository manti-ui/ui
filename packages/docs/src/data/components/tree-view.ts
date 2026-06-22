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
      name: 'tone',
      type: 'MantiTone',
      default: `'primary'`,
      description: 'Selected-node tone.',
    },
    {
      name: 'selectionMode',
      type: `'single' | 'multiple'`,
      default: `'single'`,
      description: 'Single or multiple selection.',
    },
    {
      name: 'defaultExpandedValue',
      type: 'string[]',
      description: 'Values of branches expanded by default.',
    },
    {
      name: 'defaultSelectedValue',
      type: 'string[]',
      description: 'Values selected by default.',
    },
    {
      name: 'onSelectionChange',
      type: '(value: string[]) => void',
      description: 'Called whenever the selection changes.',
    },
  ],
  anatomy: [
    { part: 'root', description: 'The outer wrapper that owns the tone.' },
    { part: 'label', description: 'The optional heading above the tree.' },
    { part: 'tree', description: 'The tree container.' },
    { part: 'branch', description: 'A node that has children.' },
    { part: 'branch-control', description: 'The clickable row of a branch.' },
    { part: 'branch-indicator', description: 'The expand/collapse chevron.' },
    { part: 'branch-text', description: 'A branch label.' },
    { part: 'branch-content', description: 'The nested children of a branch.' },
    { part: 'item', description: 'A leaf node.' },
    { part: 'item-text', description: 'A leaf label.' },
  ],
};
