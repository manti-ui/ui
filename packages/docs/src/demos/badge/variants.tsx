import { Badge } from '@manti-ui/react';

const variants = ['primary', 'secondary', 'danger', 'outline'] as const;

export default function BadgeVariants() {
  return (
    <>
      {variants.map((variant) => (
        <Badge key={variant} variant={variant}>
          {variant}
        </Badge>
      ))}
    </>
  );
}
