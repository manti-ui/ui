import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Card } from './Card';

describe('Card', () => {
  it('renders the composable anatomy and state attributes', () => {
    render(
      <Card elevated interactive>
        <Card.Header>Header</Card.Header>
        <Card.Title>Title</Card.Title>
        <Card.Description>Description</Card.Description>
        <Card.Body>Body</Card.Body>
        <Card.Footer>Footer</Card.Footer>
      </Card>,
    );

    const card = screen.getByText('Body').closest('[data-part="root"]');
    expect(card).toHaveAttribute('data-part', 'root');
    expect(card).toHaveAttribute('data-elevated', 'true');
    expect(card).toHaveAttribute('data-interactive', 'true');
    expect(screen.getByText('Header')).toHaveAttribute('data-part', 'header');
    expect(screen.getByText('Title')).toHaveAttribute('data-part', 'title');
    expect(screen.getByText('Description')).toHaveAttribute(
      'data-part',
      'description',
    );
    expect(screen.getByText('Footer')).toHaveAttribute('data-part', 'footer');
  });
});
