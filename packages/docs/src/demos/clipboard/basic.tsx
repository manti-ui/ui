import { Clipboard } from '@manti-ui/react';

export default function ClipboardBasic() {
  return (
    <div style={{ width: '100%', maxWidth: 'calc(var(--manti-space-16) * 6)' }}>
      <Clipboard
        value="npm install @manti-ui/react"
        label="Install command"
        tone="success"
      />
    </div>
  );
}
