import { Button, Dialog } from '@manti-ui/react';

const sizes = ['sm', 'md', 'lg'] as const;

export default function DialogSizes() {
  return (
    <>
      {sizes.map((size) => (
        <Dialog
          key={size}
          size={size}
          trigger={<Button variant="soft">Size {size}</Button>}
          title={`Size ${size}`}
          description="The width preset changes the panel's maximum width."
        >
          Each preset keeps the same frosted panel anatomy, only wider or
          narrower.
        </Dialog>
      ))}
    </>
  );
}
