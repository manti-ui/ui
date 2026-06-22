import { useEffect, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, TextField } from '@manti-ui/react';

import { navGroups } from '../data/navigation';
import type { SearchHit } from '../search/SearchProvider';
import { searchDocsByQuery, useSearch } from '../search/SearchProvider';

// Every page, in sidebar order — shown as the default list when the query is
// empty; typing then filters down via the search index.
const allDocs: SearchHit[] = navGroups.flatMap((group) =>
  group.items.map((item) => ({
    slug: item.slug,
    title: item.title,
    group: group.label,
  })),
);

/** ⌘K / Ctrl-K command palette, built from a Manti Dialog + TextField. */
export function SearchDialog() {
  const { open, setOpen } = useSearch();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  const results = query.trim() ? searchDocsByQuery(query) : allDocs;

  useEffect(() => setActive(0), [query]);
  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  function go(slug: string) {
    setOpen(false);
    navigate(slug);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((value) => Math.min(value + 1, results.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((value) => Math.max(value - 1, 0));
    } else if (event.key === 'Enter' && results[active]) {
      event.preventDefault();
      go(results[active].slug);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      title="Search the docs"
      size="md"
    >
      <div onKeyDown={onKeyDown}>
        <TextField
          className="docs-search-field"
          autoFocus
          fullWidth
          type="search"
          placeholder="Search components, foundations, guides…"
          aria-label="Search the docs"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        {results.length === 0 ? (
          <p className="docs-search-empty">No results for “{query}”.</p>
        ) : (
          <ul className="docs-search-results">
            {results.map((hit, index) => (
              <li key={hit.slug}>
                <button
                  type="button"
                  className={
                    index === active
                      ? 'docs-search-hit is-active'
                      : 'docs-search-hit'
                  }
                  onClick={() => go(hit.slug)}
                  onMouseEnter={() => setActive(index)}
                >
                  <span>{hit.title}</span>
                  <small>{hit.group}</small>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Dialog>
  );
}
