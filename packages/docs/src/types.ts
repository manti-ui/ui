/** Frontmatter shape every content `.mdx` declares (see remark-mdx-frontmatter). */
export interface DocFrontmatter {
  title: string;
  /** Route path, e.g. `/components/button`. Home is `/`. */
  slug: string;
  /** Sidebar group label, e.g. `Foundations`. */
  group?: string;
  /** Sort order within the group. */
  order?: number;
  /** Small sidebar tag for the page, e.g. `New` or `Beta`. */
  badge?: string;
  description?: string;
  /** Release date (ISO, quoted in frontmatter), used by update pages. */
  date?: string;
  /**
   * Question/answer pairs. Single source of truth: `<Faq />` renders them on the
   * page and `seo/head.ts` emits the matching `FAQPage` JSON-LD, so the visible
   * copy and the structured data can never disagree.
   */
  faq?: FaqEntry[];
  /** Step-by-step instructions, emitted as `HowTo` JSON-LD. */
  howto?: HowTo;
}

/** One question/answer pair from a page's `faq:` frontmatter. */
export interface FaqEntry {
  q: string;
  a: string;
}

/** One step of a page's `howto:` frontmatter. `anchor` is a heading id. */
export interface HowToStep {
  name: string;
  text: string;
  anchor?: string;
}

export interface HowTo {
  name: string;
  description?: string;
  /** ISO 8601 duration, e.g. `PT5M`. */
  totalTime?: string;
  tool?: string[];
  supply?: string[];
  step: HowToStep[];
}

/** A heading entry from `@stefanprobst/rehype-extract-toc`. */
export interface TocEntry {
  value: string;
  depth: number;
  id?: string;
  children?: TocEntry[];
}
