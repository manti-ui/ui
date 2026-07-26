import { Textarea } from '@manti-ui/react';

export default function TextareaVariants() {
  return (
    <div
      style={{
        display: 'grid',
        gap: 'var(--manti-space-4)',
        width: '100%',
        maxWidth: 'calc(var(--manti-space-16) * 6)',
      }}
    >
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
