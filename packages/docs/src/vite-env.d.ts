/// <reference types="vite/client" />

// Kept import-free at the top level so the `declare module` blocks register as
// ambient declarations. Shared interfaces live in ./types.

declare module '*.mdx' {
  const frontmatter: import('./types').DocFrontmatter;
  const tableOfContents: import('./types').TocEntry[];
  const MDXComponent: import('react').ComponentType<Record<string, unknown>>;
  export { frontmatter, tableOfContents };
  export default MDXComponent;
}

declare module 'virtual:manti-search' {
  const docs: {
    slug: string;
    title: string;
    group: string;
    text: string;
  }[];
  export default docs;
}

/** Published Manti UI version, injected at build time (see vite.config.ts). */
declare const __MANTI_VERSION__: string;
