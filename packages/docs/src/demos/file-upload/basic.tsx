import { FileUpload } from '@manti-ui/react';

export default function FileUploadBasic() {
  return (
    <div style={{ width: '100%', maxWidth: 'calc(var(--manti-space-16) * 6)' }}>
      <FileUpload label="Attachments" tone="primary" maxFiles={5} />
    </div>
  );
}
