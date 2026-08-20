import { Collapsible, Text } from '@manti-ui/react';

export default function CollapsibleBasic() {
  return (
    <div className="collapsible">
      <Collapsible trigger="Show chef's note">
        <Text className="collapsible-note" emphasis="muted">
          Rest the dough for 30 minutes so it rolls out smooth and thin.
        </Text>
      </Collapsible>
    </div>
  );
}
