import { Badge, Button, Card } from '@manti-ui/react';

export default function CardBasic() {
  return (
    <Card className="card-panel">
      <Card.Header>
        <div className="card-header">
          <Card.Title>Kayseri Mantısı</Card.Title>
          <Badge variant="primary" dot>
            Fresh
          </Badge>
        </div>
        <Card.Description>
          Tiny dumplings, garlic yogurt, paprika butter.
        </Card.Description>
      </Card.Header>
      <Card.Body>
        Hand-folded four-corner parcels, simmered until tender and finished with
        a smooth drizzle of warm chili oil.
      </Card.Body>
      <Card.Footer>
        <Button size="sm">Cook now</Button>
        <Button size="sm" variant="tertiary">
          Save
        </Button>
      </Card.Footer>
    </Card>
  );
}
