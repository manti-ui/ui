import { Input } from '@manti-ui/react';

export default function InputPassword() {
  return (
    <div className="input-field">
      <Input
        type="password"
        label="Password"
        placeholder="••••••••"
        hint="Use at least 8 characters. Toggle Caps Lock to see the warning."
        autoComplete="new-password"
      />
    </div>
  );
}
