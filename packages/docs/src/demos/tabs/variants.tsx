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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--manti-space-6)',
        width: '100%',
        maxWidth: 'calc(var(--manti-space-16) * 8)',
      }}
    >
      {variants.map((variant) => (
        <Tabs key={variant} items={items} variant={variant} tone="primary" />
      ))}
    </div>
  );
}
