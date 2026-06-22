import { TagsInput } from '@manti-ui/react';

export default function TagsInputBasic() {
  return (
    <div style={{ width: '100%', maxWidth: 'calc(var(--manti-space-16) * 7)' }}>
      <TagsInput
        label="Fillings"
        tone="primary"
        defaultValue={['lamb', 'onion', 'pepper']}
        placeholder="Add a filling…"
      />
    </div>
  );
}
