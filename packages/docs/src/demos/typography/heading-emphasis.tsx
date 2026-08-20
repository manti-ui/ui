import { Heading } from '@manti-ui/react';

export default function HeadingEmphasisDemo() {
  return (
    <div className="heading-list">
      <Heading level={3}>Default title</Heading>
      <Heading level={3} emphasis="muted">
        Muted title
      </Heading>
      <Heading level={3} variant="danger">
        Danger title
      </Heading>
    </div>
  );
}
