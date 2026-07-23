import { Input } from '@manti-ui/react';

export default function InputBasic() {
  return (
    <div style={{ width: '100%', maxWidth: 'calc(var(--manti-space-16) * 6)' }}>
      <Input
        label="Recipe name"
        placeholder="Kayseri mantısı"
        hint="Shown to everyone browsing the cookbook."
        variant="primary"
      />
    </div>
  );
}
