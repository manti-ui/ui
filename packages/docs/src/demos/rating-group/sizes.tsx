import { RatingGroup } from '@manti-ui/react';

export default function RatingGroupSizes() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--manti-space-4)',
        alignItems: 'flex-start',
      }}
    >
      <RatingGroup size="sm" label="Small" count={5} defaultValue={3} />
      <RatingGroup size="md" label="Medium" count={5} defaultValue={3} />
      <RatingGroup size="lg" label="Large" count={5} defaultValue={3} />
    </div>
  );
}
