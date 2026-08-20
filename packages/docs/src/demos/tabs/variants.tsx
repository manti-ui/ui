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

const variants = ['line', 'pill', 'soft'] as const;

export default function TabsVariants() {
  return (
    <div className="tabs-stack">
      {variants.map((variant) => (
        <Tabs key={variant} items={items} variant={variant} />
      ))}
    </div>
  );
}
