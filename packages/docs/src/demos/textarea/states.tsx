import { Textarea } from '@manti-ui/react';

export default function TextareaStates() {
  return (
    <div
      style={{
        display: 'grid',
        gap: 'var(--manti-space-4)',
        width: '100%',
        maxWidth: 'calc(var(--manti-space-16) * 6)',
      }}
    >
      <Textarea label="Small" size="sm" placeholder="Add a short note" />
      <Textarea label="Medium" size="md" placeholder="Add a note" />
      <Textarea label="Large" size="lg" placeholder="Add a longer note" />
      <Textarea
        label="Auto-resize"
        autoResize
        maxHeight="calc(var(--manti-space-16) * 2)"
        defaultValue="This field grows with content until it reaches its maximum height."
      />
      <Textarea
        label="Recipe notes"
        defaultValue="Too short"
        error="Please add at least three sentences."
      />
      <Textarea label="Locked notes" defaultValue="Locked notes" disabled />
    </div>
  );
}
