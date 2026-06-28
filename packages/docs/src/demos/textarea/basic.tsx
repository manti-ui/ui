import { Textarea } from '@manti-ui/react';

export default function TextareaBasic() {
  return (
    <div style={{ width: '100%', maxWidth: 'calc(var(--manti-space-16) * 6)' }}>
      <Textarea
        label="Recipe notes"
        placeholder="Add preparation notes"
        description="Shown below the field while there is no error."
        tone="primary"
      />
    </div>
  );
}
