import { Alert } from '@manti-ui/react';

const variants = ['primary', 'secondary', 'tertiary', 'danger', 'outline'] as const;

export default function AlertVariants() {
  return (
    <>
      {variants.map((variant) => (
        <Alert key={variant} variant={variant} title={`${variant} message`}>
          A smooth, colored status message that calmly explains what happened.
        </Alert>
      ))}
    </>
  );
}
