import { useEffect, useMemo, useState } from 'react';

import type { TocEntry } from '../types';

interface FlatTocItem {
  id: string;
  value: string;
  depth: number;
}

function flatten(entries: TocEntry[]): FlatTocItem[] {
  const out: FlatTocItem[] = [];
  const walk = (list: TocEntry[]) => {
    for (const entry of list) {
      if (entry.id && entry.depth >= 2 && entry.depth <= 3) {
        out.push({ id: entry.id, value: entry.value, depth: entry.depth });
      }
      if (entry.children) walk(entry.children);
    }
  };
  walk(entries);
  return out;
}

/** On-page heading rail with scroll-spy, fed by rehype-extract-toc output. */
export function TableOfContents({ toc }: { toc: TocEntry[] }) {
  const items = useMemo(() => flatten(toc), [toc]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: '0px 0px -70% 0px', threshold: [0, 1] },
    );
    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return <div className="docs-toc" aria-hidden />;

  return (
    <aside className="docs-toc">
      <p className="docs-toc-label">On this page</p>
      <ul className="docs-toc-list">
        {items.map((item) => {
          const className = [
            'docs-toc-link',
            item.depth === 3 && 'is-depth-3',
            item.id === activeId && 'is-active',
          ]
            .filter(Boolean)
            .join(' ');
          return (
            <li key={item.id}>
              <a href={`#${item.id}`} className={className}>
                {item.value}
              </a>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
