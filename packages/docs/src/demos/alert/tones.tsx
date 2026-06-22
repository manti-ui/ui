import { Alert } from '@manti-ui/react';

const tones = [
  'info',
  'success',
  'warning',
  'danger',
  'primary',
  'neutral',
] as const;

export default function AlertTones() {
  return (
    <>
      {tones.map((tone) => (
        <Alert key={tone} tone={tone} title={`${tone} message`}>
          A smooth, tonal status message that calmly explains what happened.
        </Alert>
      ))}
    </>
  );
}
