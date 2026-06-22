import { SignaturePad } from '@manti-ui/react';

export default function SignaturePadBasic() {
  return (
    <div style={{ width: '100%', maxWidth: 'calc(var(--manti-space-16) * 6)' }}>
      <SignaturePad label="Sign here" tone="primary" />
    </div>
  );
}
