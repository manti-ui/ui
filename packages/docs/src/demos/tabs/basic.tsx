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
    <div
      style={{
        width: '100%',
        maxWidth: 'calc(var(--manti-space-16) * 8)',
      }}
    >
      <Tabs items={items} tone="primary" />
    </div>
  );
}
