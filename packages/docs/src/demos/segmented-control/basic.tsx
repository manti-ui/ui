import { SegmentedControl } from '@manti-ui/react';

const items = [
  { value: 'list', label: 'List' },
  { value: 'grid', label: 'Grid' },
  { value: 'board', label: 'Board' },
];

export default function SegmentedControlBasic() {
  return <SegmentedControl items={items} defaultValue="grid" />;
}
