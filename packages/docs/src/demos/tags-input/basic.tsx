import { TagsInput } from '@manti-ui/react';

export default function TagsInputBasic() {
  return (
    <div className="tags-input">
      <TagsInput
        label="Fillings"
        variant="primary"
        defaultValue={['lamb', 'onion', 'pepper']}
        placeholder="Add a filling…"
      />
    </div>
  );
}
