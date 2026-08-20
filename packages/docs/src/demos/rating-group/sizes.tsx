import { RatingGroup } from '@manti-ui/react';

export default function RatingGroupSizes() {
  return (
    <div className="rating-group-options">
      <RatingGroup size="sm" label="Small" count={5} defaultValue={3} />
      <RatingGroup size="md" label="Medium" count={5} defaultValue={3} />
      <RatingGroup size="lg" label="Large" count={5} defaultValue={3} />
    </div>
  );
}
