import { Switch } from '@manti-ui/react';

const variants = ['primary', 'secondary', 'tertiary', 'danger', 'outline'] as const;

export default function SwitchVariants() {
  return (
    <>
      {variants.map((variant) => (
        <Switch key={variant} variant={variant} defaultChecked>
          {variant}
        </Switch>
      ))}
    </>
  );
}
