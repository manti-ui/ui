import { Badge } from '@manti-ui/react';

const tones = [
  'primary',
  'neutral',
  'success',
  'warning',
  'danger',
  'info',
] as const;

export default function BadgeTones() {
  return (
    <>
      {tones.map((tone) => (
        <Badge key={tone} tone={tone}>
          {tone}
        </Badge>
      ))}
    </>
  );
}
