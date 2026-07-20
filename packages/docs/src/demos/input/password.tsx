import { Input } from '@manti-ui/react';

export default function InputPassword() {
  return (
    <div style={{ width: '100%', maxWidth: 'calc(var(--manti-space-16) * 5)' }}>
      <Input
        type="password"
        label="Password"
        placeholder="••••••••"
        hint="Use at least 8 characters. Toggle Caps Lock to see the warning."
        autoComplete="new-password"
        variant="primary"
      />
    </div>
  );
}
