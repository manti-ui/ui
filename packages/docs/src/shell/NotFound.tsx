import { Link } from 'react-router-dom';
import { Button } from '@manti-ui/react';

export function NotFound() {
  return (
    <div className="docs-prose">
      <h1>Page not found</h1>
      <p className="docs-lede">
        That page has not been kneaded yet. Check the navigation, or head back
        to the introduction.
      </p>
      <Link to="/">
        <Button variant="solid" tone="primary">
          Back to home
        </Button>
      </Link>
    </div>
  );
}
