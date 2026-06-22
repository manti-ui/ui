import { Badge } from '@manti-ui/react';

const variants = ['solid', 'soft', 'outline'] as const;

export default function BadgeVariants() {
  return (
    <>
      {variants.map((variant) => (
        <Badge key={variant} variant={variant} tone="primary">
          {variant}
        </Badge>
      ))}
    </>
  );
}
