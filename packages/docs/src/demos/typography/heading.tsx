import { Heading, Text } from '@manti-ui/react';

export default function HeadingDemo() {
  return (
    <div className="heading-list-wide">
      <Heading level={2}>Design tokens are mandatory</Heading>
      <Text emphasis="muted">
        Every visual value comes from the token contract, so a consumer can
        restyle a component without forking it.
      </Text>
    </div>
  );
}
