import { GITHUB_URL } from '../data/navigation';

export function Footer() {
  return (
    <footer className="docs-footer">
      <p>
        Built end-to-end with Manti UI components and design tokens. Manti UI is
        a framework-agnostic design system on{' '}
        <a href="https://zagjs.com" target="_blank" rel="noreferrer">
          Zag.js
        </a>
        .
      </p>
      <p>
        <a href={GITHUB_URL} target="_blank" rel="noreferrer">
          GitHub
        </a>
      </p>
    </footer>
  );
}
