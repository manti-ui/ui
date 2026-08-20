import { TagsInput } from '@manti-ui/react';

export default function TagsInputStates() {
  return (
    <div className="tags-input-grid">
      <TagsInput
        label="Default"
        defaultValue={['lamb', 'onion']}
        placeholder="Add a filling…"
      />
      <TagsInput
        label="Invalid"
        defaultValue={['lamb', 'onion']}
        placeholder="Add a filling…"
        invalid
      />
      <TagsInput
        label="Up to 3 tags"
        defaultValue={['lamb', 'onion']}
        placeholder="Add a filling…"
        max={3}
      />
    </div>
  );
}
