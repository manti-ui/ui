import { Checkbox } from '@manti-ui/react';

export default function CheckboxBasic() {
  return (
    <div style={{ display: 'grid', gap: 'var(--manti-space-3)' }}>
      <Checkbox defaultChecked={false}>Unchecked</Checkbox>
      <Checkbox defaultChecked>Checked</Checkbox>
      <Checkbox indeterminate>Indeterminate</Checkbox>
      <Checkbox defaultChecked={false} disabled>
        Disabled
      </Checkbox>
    </div>
  );
}
