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

const folderClosed = (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
    <path
      d="M1.75 4.5c0-.69.56-1.25 1.25-1.25h2.84c.4 0 .77.18 1 .5l.66.86c.24.31.6.49 1 .49h4.5c.69 0 1.25.56 1.25 1.25v5.4c0 .69-.56 1.25-1.25 1.25H3c-.69 0-1.25-.56-1.25-1.25V4.5Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
  </svg>
);

const folderOpen = (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
    <path
      d="M1.75 5V4c0-.69.56-1.25 1.25-1.25h2.84c.4 0 .77.18 1 .5l.66.86c.24.31.6.49 1 .49h4c.69 0 1.25.56 1.25 1.25v.65"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <path
      d="M2.6 6.5h11.2c.42 0 .73.4.63.81l-.97 4.2c-.13.57-.64.99-1.23.99H3.2c-.59 0-1.1-.42-1.23-.99l-.97-4.2c-.1-.41.21-.81.63-.81H2.6Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
  </svg>
);

const file = (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
    <path
      d="M4 1.75h4.3c.27 0 .52.1.71.3l3.2 3.2c.19.18.29.43.29.7v8c0 .69-.56 1.25-1.25 1.25H4c-.69 0-1.25-.56-1.25-1.25V3c0-.69.56-1.25 1.25-1.25Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <path
      d="M8.5 2v3c0 .41.34.75.75.75h3"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function TreeViewBasic() {
  return (
    <TreeView
      items={tree}
      label="Cookbook"
      tone="primary"
      selectionMode="single"
      defaultExpandedValue={['recipes', 'steamed']}
      icon={(_node, { isBranch, expanded }) =>
        isBranch ? (expanded ? folderOpen : folderClosed) : file
      }
    />
  );
}
