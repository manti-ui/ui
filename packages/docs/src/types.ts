/** Frontmatter shape every content `.mdx` declares (see remark-mdx-frontmatter). */
export interface DocFrontmatter {
  title: string;
  /** Route path, e.g. `/components/button`. Home is `/`. */
  slug: string;
  /** Sidebar group label, e.g. `Foundations`. */
  group?: string;
  /** Sort order within the group. */
  order?: number;
  description?: string;
}

/** A heading entry from `@stefanprobst/rehype-extract-toc`. */
export interface TocEntry {
  value: string;
  depth: number;
  id?: string;
  children?: TocEntry[];
}
