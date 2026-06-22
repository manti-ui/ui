import { FileUpload } from '@manti-ui/react';

export default function FileUploadImagesOnly() {
  return (
    <div style={{ width: '100%', maxWidth: 'calc(var(--manti-space-16) * 6)' }}>
      <FileUpload label="Photos" accept="image/*" maxFiles={3} />
    </div>
  );
}
