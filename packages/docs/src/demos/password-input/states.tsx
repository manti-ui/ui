import { PasswordInput } from '@manti-ui/react';

export default function PasswordInputStates() {
  return (
    <div
      style={{
        display: 'grid',
        gap: 'var(--manti-space-4)',
        width: '100%',
        maxWidth: 'calc(var(--manti-space-16) * 5)',
      }}
    >
      <PasswordInput
        label="Invalid"
        defaultValue="short"
        error="Password must be at least 8 characters."
      />
      <PasswordInput
        label="Revealed by default"
        defaultValue="forty-to-a-spoon"
        defaultVisible
      />
      <PasswordInput label="Disabled" defaultValue="secret" disabled />
    </div>
  );
}
