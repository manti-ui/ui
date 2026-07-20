import { Button } from '@manti-ui/react';

const variants = [
  'primary',
  'secondary',
  'tertiary',
  'danger',
  'outline',
  'link',
] as const;

export default function ButtonVariants() {
  return (
    <>
      {variants.map((variant) => (
        <Button key={variant} variant={variant}>
          {variant}
        </Button>
      ))}
    </>
  );
}
