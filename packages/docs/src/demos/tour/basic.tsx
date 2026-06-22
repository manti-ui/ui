import { Button, Tour } from '@manti-ui/react';

// A real onboarding tour: every step spotlights an actual part of this
// documentation site's chrome — exactly how you'd guide a first-time user
// through your own app.
const steps = [
  {
    id: 'welcome',
    title: 'Welcome to Manti UI',
    description:
      'Take a quick tour of the docs. Move with Back / Next or the arrow keys.',
    placement: 'center' as const,
  },
  {
    id: 'brand',
    target: '.docs-brand',
    title: 'Always one click home',
    description: 'The logo brings you back to the landing page from anywhere.',
    placement: 'bottom-start' as const,
  },
  {
    id: 'nav',
    target: '.docs-nav-primary',
    title: 'Find your way around',
    description:
      'Getting Started, Foundations, Components and Guides — the four corners of the docs.',
    placement: 'bottom' as const,
  },
  {
    id: 'sidebar',
    target: '.docs-sidebar',
    title: 'The full catalog',
    description:
      'Every component Manti adapts from Zag.js is listed in this sidebar.',
    placement: 'right' as const,
  },
  {
    id: 'actions',
    target: '.docs-nav-actions',
    title: 'Search & theme',
    description: 'Jump anywhere with search, or switch between light and dark.',
    placement: 'bottom-end' as const,
  },
  {
    id: 'toc',
    target: '.docs-toc',
    title: 'On this page',
    description: 'Every section of the page you are reading, one click away.',
    placement: 'left' as const,
  },
];

export default function TourBasic() {
  return (
    <Tour
      steps={steps}
      trigger={<Button tone="primary">Take a tour of the docs</Button>}
    />
  );
}
