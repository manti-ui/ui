import { FileUpload } from '@manti-ui/react';

export default function FileUploadImagesOnly() {
  return (
    <div className="file-upload">
      <FileUpload label="Photos" accept="image/*" maxFiles={3} />
    </div>
  );
}
