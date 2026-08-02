import { Blockquote } from '@manti-ui/react';

export default function BlockquoteDemo() {
  return (
    <div
      style={{
        display: 'grid',
        gap: 'var(--manti-space-6)',
        maxWidth: 'calc(var(--manti-space-16) * 10)',
      }}
    >
      <Blockquote>
        Components should preserve the meaning of the HTML they render.
      </Blockquote>
      <Blockquote size="lg">
        A shared token language makes every new primitive feel at home.
      </Blockquote>
    </div>
  );
}
