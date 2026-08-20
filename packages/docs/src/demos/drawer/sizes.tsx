import { Button, Drawer, Text } from '@manti-ui/react';

const sizes = ['sm', 'md', 'lg'] as const;

export default function DrawerSizes() {
  return (
    <>
      {sizes.map((size) => (
        <Drawer
          key={size}
          size={size}
          trigger={<Button variant="tertiary">{size}</Button>}
          title={`Drawer — ${size}`}
          description="Size sets the panel's width, or its height when the drawer opens from the top or bottom."
        >
          <Text>
            The panel is{' '}
            {size === 'sm' ? '18rem' : size === 'md' ? '24rem' : '32rem'}{' '}
            across.
          </Text>
        </Drawer>
      ))}
    </>
  );
}
