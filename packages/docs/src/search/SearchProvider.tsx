import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useShortcut } from '@manti-ui/react/shortcut';
import MiniSearch from 'minisearch';

import searchDocs from 'virtual:manti-search';

interface SearchContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SearchContext = createContext<SearchContextValue | null>(null);

/** Prebuilt index over the build-time content text (see vite-plugin-search). */
export const searchIndex = (() => {
  const index = new MiniSearch({
    fields: ['title', 'text', 'group'],
    storeFields: ['title', 'group', 'slug'],
    searchOptions: {
      boost: { title: 3, group: 1 },
      prefix: true,
      fuzzy: 0.2,
    },
  });
  index.addAll(searchDocs.map((doc, id) => ({ id, ...doc })));
  return index;
})();

export interface SearchHit {
  slug: string;
  title: string;
  group: string;
}

export function searchDocsByQuery(query: string, limit = 8): SearchHit[] {
  if (!query.trim()) return [];
  return searchIndex.search(query).slice(0, limit) as unknown as SearchHit[];
}

export function SearchProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  // ⌘K / Ctrl+K toggles search from anywhere (preventDefault is on by default,
  // so the browser's own ⌘K doesn't also fire). See @manti-ui/react/shortcut.
  useShortcut('mod+k', () => setOpen((value) => !value));

  const value = useMemo(() => ({ open, setOpen }), [open]);
  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

export function useSearch(): SearchContextValue {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error('useSearch must be used within a SearchProvider');
  return ctx;
}
