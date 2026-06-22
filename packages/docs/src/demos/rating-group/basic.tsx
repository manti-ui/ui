import { RatingGroup } from '@manti-ui/react';

export default function RatingGroupBasic() {
  return (
    <RatingGroup
      label="Rate this recipe"
      count={5}
      defaultValue={3}
      tone="warning"
    />
  );
}
