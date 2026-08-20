import { SignaturePad } from '@manti-ui/react';

export default function SignaturePadBasic() {
  return (
    <div className="signature-pad">
      <SignaturePad label="Sign here" variant="primary" />
    </div>
  );
}
