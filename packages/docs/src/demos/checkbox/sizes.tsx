import { Checkbox } from '@manti-ui/react';

export default function CheckboxSizes() {
  return (
    <div className="checkbox-row">
      <Checkbox defaultChecked size="sm">
        Small
      </Checkbox>
      <Checkbox defaultChecked size="md">
        Medium
      </Checkbox>
      <Checkbox defaultChecked size="lg">
        Large
      </Checkbox>
    </div>
  );
}
