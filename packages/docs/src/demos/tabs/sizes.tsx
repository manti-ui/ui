import { Tabs } from '@manti-ui/react';

const items = [
  {
    value: 'dough',
    label: 'Dough',
    content: 'Flour, egg, water, and a pinch of salt.',
  },
  {
    value: 'filling',
    label: 'Filling',
    content: 'Beef or lamb, grated onion, and spice.',
  },
  {
    value: 'sauce',
    label: 'Sauce',
    content: 'Garlic yogurt under warm paprika butter.',
  },
];

export default function TabsSizes() {
  return (
    <div className="tabs-stack">
      <Tabs size="sm" items={items} />
      <Tabs size="md" items={items} />
    </div>
  );
}
