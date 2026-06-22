import { Button } from '@manti-ui/react';

const tones = [
  'primary',
  'neutral',
  'success',
  'warning',
  'danger',
  'info',
] as const;

export default function ButtonTones() {
  return (
    <>
      {tones.map((tone) => (
        <Button key={tone} tone={tone}>
          {tone}
        </Button>
      ))}
    </>
  );
}
