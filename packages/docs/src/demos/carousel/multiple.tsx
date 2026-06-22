import { Carousel } from '@manti-ui/react';

const slide = (label: string) => (
  <div
    style={{
      display: 'grid',
      placeItems: 'center',
      height: 'calc(var(--manti-space-16) * 3)',
      borderRadius: 'var(--manti-radius-lg)',
      background: 'var(--manti-surface)',
      color: 'var(--manti-text)',
      fontSize: 'var(--manti-text-lg)',
      fontWeight: 'var(--manti-weight-semibold)',
    }}
  >
    {label}
  </div>
);

const slides = [
  'Dough',
  'Filling',
  'Folding',
  'Boiling',
  'Serving',
  'Yogurt',
].map((label) => slide(label));

export default function CarouselMultiple() {
  return (
    <div style={{ width: '100%', maxWidth: 'calc(var(--manti-space-16) * 9)' }}>
      <Carousel slides={slides} tone="primary" slidesPerPage={2} loop />
    </div>
  );
}
