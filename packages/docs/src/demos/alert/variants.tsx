import { Alert } from '@manti-ui/react';

const tones = ['info', 'danger'] as const;
const variants = ['soft', 'solid'] as const;

export default function AlertVariants() {
  return (
    <>
      {tones.flatMap((tone) =>
        variants.map((variant) => (
          <Alert
            key={`${tone}-${variant}`}
            tone={tone}
            variant={variant}
            title={`${tone} · ${variant}`}
          >
            {variant === 'soft'
              ? 'A tinted surface for a calm, low-emphasis message.'
              : 'A filled surface for a higher-emphasis message.'}
          </Alert>
        )),
      )}
    </>
  );
}
