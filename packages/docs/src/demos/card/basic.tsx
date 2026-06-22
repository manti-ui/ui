import { Badge, Button, Card } from '@manti-ui/react';

export default function CardBasic() {
  return (
    <Card
      style={{ width: '100%', maxWidth: 'calc(var(--manti-space-16) * 8)' }}
    >
      <Card.Header>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Card.Title>Kayseri Mantısı</Card.Title>
          <Badge tone="success" dot>
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
        <Button size="sm" variant="ghost" tone="neutral">
          Save
        </Button>
      </Card.Footer>
    </Card>
  );
}
