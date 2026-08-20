import { Card } from '@manti-ui/react';

export default function CardVariants() {
  return (
    <>
      <Card className="card-panel">
        <Card.Body>
          <Card.Title>Default</Card.Title>
          <Card.Description>A bordered resting surface.</Card.Description>
        </Card.Body>
      </Card>
      <Card elevated className="card-panel">
        <Card.Body>
          <Card.Title>Elevated</Card.Title>
          <Card.Description>
            Raised with a stronger surface tint.
          </Card.Description>
        </Card.Body>
      </Card>
      <Card interactive tabIndex={0} className="card-panel">
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
