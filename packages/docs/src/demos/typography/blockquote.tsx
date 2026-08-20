import { Blockquote } from '@manti-ui/react';

export default function BlockquoteDemo() {
  return (
    <div className="blockquote-list">
      <Blockquote>
        Components should preserve the meaning of the HTML they render.
      </Blockquote>
      <Blockquote size="lg">
        A shared token language makes every new primitive feel at home.
      </Blockquote>
    </div>
  );
}
