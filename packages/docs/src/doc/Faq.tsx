import { Heading, Text } from '@manti-ui/react';
import { useLocation } from 'react-router-dom';

import { pageBySlug, slugFromPath } from '../pages';

/**
 * The page's frontmatter `faq:` block, rendered as visible copy.
 *
 * Structured data must describe what a reader can actually see, so the Q&A
 * pairs live in frontmatter once: this component renders them and
 * `seo/head.ts` emits the matching `FAQPage` JSON-LD from the same array. An
 * answer edited in one place can never drift from the other.
 *
 * Questions are real headings with stable ids, so an assistant citing an answer
 * can link straight to it.
 */

function questionId(question: string): string {
  return (
    'faq-' +
    question
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  );
}

export function Faq() {
  const { pathname } = useLocation();
  const page = pageBySlug.get(slugFromPath(pathname));
  const faq = page?.faq;
  if (!faq || faq.length === 0) return null;

  return (
    <section className="docs-faq" id="faq" aria-labelledby="faq-title">
      <Heading level={2} id="faq-title">
        Frequently asked questions
      </Heading>
      {faq.map((entry) => (
        <div className="docs-faq-item" key={entry.q}>
          <Heading level={3} id={questionId(entry.q)}>
            {entry.q}
          </Heading>
          <Text>{entry.a}</Text>
        </div>
      ))}
    </section>
  );
}
