import { Checkbox } from '@manti-ui/react';

export default function CheckboxSizes() {
  return (
    <div
      style={{
        display: 'flex',
        gap: 'var(--manti-space-6)',
        alignItems: 'center',
      }}
    >
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
