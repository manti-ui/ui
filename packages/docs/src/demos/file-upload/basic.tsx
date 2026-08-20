import { FileUpload } from '@manti-ui/react';

export default function FileUploadBasic() {
  return (
    <div className="file-upload">
      <FileUpload label="Attachments" variant="primary" maxFiles={5} />
    </div>
  );
}
