import { Alert } from '@manti-ui/react';

const variants = ['primary', 'secondary', 'success', 'info', 'danger'] as const;

export default function AlertVariants() {
  return (
    <div
      style={{
        display: 'grid',
        gap: 'var(--manti-space-3)',
        width: '100%',
      }}
    >
      {variants.map((variant) => (
        <Alert key={variant} variant={variant} title={`${variant} message`}>
          A smooth, colored status message that calmly explains what happened.
        </Alert>
      ))}
    </div>
  );
}
