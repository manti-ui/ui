import { Checkbox } from '@manti-ui/react';

export default function CheckboxBasic() {
  return (
    <div className="checkbox-group">
      <Checkbox defaultChecked={false}>Unchecked</Checkbox>
      <Checkbox defaultChecked>Checked</Checkbox>
      <Checkbox indeterminate>Indeterminate</Checkbox>
      <Checkbox defaultChecked={false} disabled>
        Disabled
      </Checkbox>
    </div>
  );
}
