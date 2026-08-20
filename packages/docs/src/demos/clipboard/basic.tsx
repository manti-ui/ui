import { Clipboard } from '@manti-ui/react';

export default function ClipboardBasic() {
  return (
    <div className="clipboard-field">
      <Clipboard
        value="npm install @manti-ui/react"
        label="Install command"
        variant="primary"
      />
    </div>
  );
}
