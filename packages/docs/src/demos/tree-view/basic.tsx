import { TreeView } from '@manti-ui/react';

const tree = [
  {
    value: 'recipes',
    label: 'recipes',
    children: [
      {
        value: 'steamed',
        label: 'steamed',
        children: [
          { value: 'manti', label: 'manti.md' },
          { value: 'momo', label: 'momo.md' },
        ],
      },
      {
        value: 'boiled',
        label: 'boiled',
        children: [{ value: 'pelmeni', label: 'pelmeni.md' }],
      },
    ],
  },
  {
    value: 'sauces',
    label: 'sauces',
    children: [
      { value: 'yogurt', label: 'garlic-yogurt.md' },
      { value: 'chili-oil', label: 'chili-oil.md' },
    ],
  },
  { value: 'README', label: 'README.md' },
];

export default function TreeViewBasic() {
  return (
    <TreeView
      items={tree}
      label="Cookbook"
      tone="primary"
      selectionMode="single"
      defaultExpandedValue={['recipes', 'steamed']}
    />
  );
}
