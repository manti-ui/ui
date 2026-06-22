import { RatingGroup } from '@manti-ui/react';

export default function RatingGroupHalfStars() {
  return (
    <RatingGroup
      label="Rate this recipe"
      count={5}
      defaultValue={3.5}
      allowHalf
      tone="warning"
    />
  );
}
