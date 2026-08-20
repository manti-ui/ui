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

export default function TabsBasic() {
  return (
    <div className="tabs">
      <Tabs items={items} />
    </div>
  );
}
