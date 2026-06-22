import { Card } from '@manti-ui/react';

const cardStyle = { width: 'calc(var(--manti-space-16) * 5)' };

export default function CardVariants() {
  return (
    <>
      <Card style={cardStyle}>
        <Card.Body>
          <Card.Title>Default</Card.Title>
          <Card.Description>A bordered resting surface.</Card.Description>
        </Card.Body>
      </Card>
      <Card elevated style={cardStyle}>
        <Card.Body>
          <Card.Title>Elevated</Card.Title>
          <Card.Description>Lifted with a soft shadow.</Card.Description>
        </Card.Body>
      </Card>
      <Card interactive tabIndex={0} style={cardStyle}>
        <Card.Body>
          <Card.Title>Interactive</Card.Title>
          <Card.Description>
            Lifts smoothly on hover and focus.
          </Card.Description>
        </Card.Body>
      </Card>
    </>
  );
}
