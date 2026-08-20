import { Textarea } from '@manti-ui/react';

export default function TextareaVariants() {
  return (
    <div className="textarea-grid">
      <Textarea
        aria-label="Default message"
        placeholder="Default"
        resize="none"
      />
      <Textarea
        aria-label="Filled message"
        placeholder="Message"
        resize="none"
        variant="fill"
      />
    </div>
  );
}
