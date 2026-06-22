import { TextField } from '@manti-ui/react';

export default function TextFieldBasic() {
  return (
    <div style={{ width: '100%', maxWidth: 'calc(var(--manti-space-16) * 6)' }}>
      <TextField
        label="Recipe name"
        placeholder="Kayseri mantısı"
        hint="Shown to everyone browsing the cookbook."
        tone="primary"
      />
    </div>
  );
}
