import { Carousel } from '@manti-ui/react';

const slide = (label: string) => (
  <div className="carousel-slide">{label}</div>
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
    <div className="carousel">
      <Carousel slides={slides} variant="primary" slidesPerPage={2} loop />
    </div>
  );
}
