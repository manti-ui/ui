import { Button } from '@manti-ui/react';

const variants = ['solid', 'soft', 'outline', 'ghost'] as const;

export default function ButtonVariants() {
  return (
    <>
      {variants.map((variant) => (
        <Button key={variant} variant={variant} tone="primary">
          {variant}
        </Button>
      ))}
    </>
  );
}
