import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { Story, StoryDefault } from '@ladle/react';

import { Combobox } from './Combobox.js';
import type { ComboboxItem, ComboboxProps } from './Combobox.js';

const spices = [
  { value: 'sumac', label: 'Sumac' },
  { value: 'paprika', label: 'Paprika' },
  { value: 'cumin', label: 'Cumin' },
  { value: 'mint', label: 'Dried mint' },
  { value: 'pepper', label: 'Black pepper' },
  { value: 'chili', label: 'Chili flakes' },
  { value: 'coriander', label: 'Coriander' },
];

export default {
  title: 'Components/Combobox',
  args: {
    items: spices,
    label: 'Spice',
    placeholder: 'Search spices…',
    variant: 'default',
    size: 'md',
    multiple: false,
  },
  argTypes: {
    size: { control: { type: 'inline-radio' }, options: ['sm', 'md', 'lg'] },
    variant: {
      control: { type: 'select' },
      options: ['default', 'fill'],
    },
  },
  meta: { layout: 'centered' },
} satisfies StoryDefault<ComboboxProps>;

export const Playground: Story<ComboboxProps> = (args) => (
  <Combobox {...args} />
);

export const Filled: Story<ComboboxProps> = (args) => <Combobox {...args} />;
Filled.args = { variant: 'fill', label: undefined };

export const Multiple: Story<ComboboxProps> = (args) => <Combobox {...args} />;
Multiple.args = {
  multiple: true,
  label: 'Spices',
  defaultValue: ['sumac', 'mint'],
};

/**
 * A catalogue far longer than the listbox can usefully render: 2,000 options,
 * of which `maxVisibleItems` (25 here, 200 by default) reach the DOM. Typing
 * filters the whole set, and the line under the rows says how many matches are
 * still hidden.
 */
export const LongCatalogue: Story<ComboboxProps> = (args) => (
  <Combobox {...args} />
);
LongCatalogue.args = {
  label: 'Entry',
  placeholder: 'Search 2,000 entries…',
  maxVisibleItems: 25,
  items: Array.from({ length: 2000 }, (_, index) => ({
    value: `entry-${index}`,
    label: `Entry ${String(index + 1).padStart(4, '0')}`,
  })),
};

const albums = [
  { value: 'ok-computer', label: 'OK Computer', artist: 'Radiohead' },
  { value: 'kid-a', label: 'Kid A', artist: 'Radiohead' },
  { value: 'in-rainbows', label: 'In Rainbows', artist: 'Radiohead' },
  { value: 'blue', label: 'Blue', artist: 'Joni Mitchell' },
  { value: 'hejira', label: 'Hejira', artist: 'Joni Mitchell' },
  { value: 'kind-of-blue', label: 'Kind of Blue', artist: 'Miles Davis' },
  { value: 'bitches-brew', label: 'Bitches Brew', artist: 'Miles Davis' },
  { value: 'vespertine', label: 'Vespertine', artist: 'Björk' },
  { value: 'homogenic', label: 'Homogenic', artist: 'Björk' },
];

/** A stand-in for a server: matches title or artist, answers after a delay. */
function searchAlbums(query: string, signal: AbortSignal) {
  return new Promise<ComboboxItem[]>((resolve, reject) => {
    const timer = setTimeout(() => {
      const q = query.trim().toLowerCase();
      resolve(
        albums
          .filter(
            (album) =>
              album.label.toLowerCase().includes(q) ||
              album.artist.toLowerCase().includes(q),
          )
          .map(({ value, label }) => ({ value, label })),
      );
    }, 600);
    signal.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(signal.reason);
    });
  });
}

/**
 * Type, fetch, pick. The text is controlled, `filter={false}` renders the
 * server's answer as given (try an artist: "joni" finds albums whose titles do
 * not contain it), and the popup carries a loading row while a request is out
 * and the empty content when one comes back with nothing. Requests are
 * debounced by 250 ms and wait for two characters. Arrow keys and Enter pick,
 * and the pick stays while the next request replaces the results.
 */
export const AsyncSearch: Story<ComboboxProps> = (args) => {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<ComboboxItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setItems([]);
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    const debounce = setTimeout(() => {
      searchAlbums(query, controller.signal).then(
        (result) => {
          setItems(result);
          setLoading(false);
        },
        () => {},
      );
    }, 250);
    return () => {
      clearTimeout(debounce);
      controller.abort();
    };
  }, [query]);

  return (
    <Combobox
      {...args}
      items={items}
      filter={false}
      inputValue={query}
      onInputValueChange={setQuery}
      loading={loading}
      minChars={2}
      emptyContent={
        query.trim().length < 2
          ? 'Type two characters to search.'
          : `No albums match “${query.trim()}”.`
      }
    />
  );
};
AsyncSearch.args = {
  label: 'Album',
  placeholder: 'Search albums or artists…',
};

/** Opens its Combobox on mount, so a popup state can be looked at directly. */
function OpenOnMount({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current
      ?.querySelector<HTMLButtonElement>(
        '[data-scope="combobox"][data-part="trigger"]',
      )
      ?.click();
  }, []);
  return <div ref={ref}>{children}</div>;
}

/** The popup while the first request is out: the loading row alone. */
export const LoadingState: Story<ComboboxProps> = (args) => (
  <OpenOnMount>
    <Combobox {...args} />
  </OpenOnMount>
);
LoadingState.args = {
  label: 'Album',
  placeholder: 'Search albums or artists…',
  items: [],
  filter: false,
  loading: true,
};

/** The popup after a request came back with nothing: the empty content. */
export const EmptyState: Story<ComboboxProps> = (args) => (
  <OpenOnMount>
    <Combobox {...args} />
  </OpenOnMount>
);
EmptyState.args = {
  label: 'Album',
  placeholder: 'Search albums or artists…',
  items: [],
  filter: false,
  emptyContent: 'No albums match this search.',
};
