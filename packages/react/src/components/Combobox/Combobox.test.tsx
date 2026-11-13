import { useMemo, useState } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Combobox } from './Combobox.js';
import type { ComboboxFilter } from './Combobox.js';

describe('Combobox', () => {
  it('filters options and reports the selected value', async () => {
    const onValueChange = vi.fn();
    render(
      <Combobox
        label="Country"
        items={[
          { value: 'tr', label: 'Türkiye' },
          { value: 'de', label: 'Germany' },
        ]}
        onValueChange={onValueChange}
      />,
    );

    const input = screen.getByRole('combobox', { name: 'Country' });
    fireEvent.click(screen.getByRole('button', { name: 'Toggle options' }));
    fireEvent.change(input, { target: { value: 'ger' } });

    await waitFor(() =>
      expect(screen.getByRole('option', { name: 'Germany' })).toBeVisible(),
    );
    expect(
      screen.queryByRole('option', { name: 'Türkiye' }),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('option', { name: 'Germany' }));
    await waitFor(() => expect(onValueChange).toHaveBeenCalledWith(['de']));
  });
});

const albums = [
  { value: 'ok', label: 'OK Computer' },
  { value: 'kida', label: 'Kid A' },
  { value: 'inrainbows', label: 'In Rainbows' },
];

/** A consumer that filters remotely: `items` is replaced on every edit. */
function RemoteSearch({
  multiple,
  onValueChange,
}: {
  multiple?: boolean;
  onValueChange?: (value: string[]) => void;
}) {
  const [query, setQuery] = useState('');
  // A server match on something other than the label: every album answers
  // any query, and each answer is a fresh set of objects.
  const items = useMemo(
    () => (query ? albums.map((album) => ({ ...album })) : []),
    [query],
  );
  return (
    <Combobox
      label="Album"
      filter={false}
      items={items}
      inputValue={query}
      onInputValueChange={setQuery}
      multiple={multiple}
      onValueChange={onValueChange}
    />
  );
}

/** Focus first, as a user does: the machine ignores edits to an unfocused input. */
const type = (input: HTMLElement, text: string) => {
  fireEvent.focus(input);
  fireEvent.change(input, { target: { value: text } });
};

const optionLabels = () =>
  screen.getAllByRole('option').map((option) => option.textContent);

describe('Combobox consumer-controlled filtering', () => {
  it('reports every edit of the typed text', async () => {
    const onInputValueChange = vi.fn();
    render(
      <Combobox
        label="Album"
        items={albums}
        defaultInputValue="Ki"
        onInputValueChange={onInputValueChange}
      />,
    );
    const input = screen.getByRole('combobox', { name: 'Album' });
    expect(input).toHaveValue('Ki');
    type(input, 'Kid');
    type(input, 'Kid ');
    await waitFor(() =>
      expect(onInputValueChange.mock.calls.map(([text]) => text)).toEqual([
        'Kid',
        'Kid ',
      ]),
    );
  });

  it.each<[string, ComboboxFilter, string[]]>([
    [
      'false renders items as given',
      false,
      ['OK Computer', 'Kid A', 'In Rainbows'],
    ],
    [
      'a function replaces the label match',
      (item, query) => item.value.startsWith(query),
      ['Kid A'],
    ],
  ])('filter: %s', async (_name, filter, expected) => {
    render(<Combobox label="Album" items={albums} filter={filter} />);
    const input = screen.getByRole('combobox', { name: 'Album' });
    type(input, 'kid');
    await waitFor(() => expect(optionLabels()).toEqual(expected));
  });

  it('shows a loading status, then the empty content, joined to the control', async () => {
    const { rerender } = render(
      <Combobox
        label="Album"
        items={[]}
        filter={false}
        loading
        emptyContent="No albums"
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Toggle options' }));
    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent('Loading'),
    );
    expect(screen.queryByText('No albums')).not.toBeInTheDocument();

    rerender(
      <Combobox
        label="Album"
        items={[]}
        filter={false}
        emptyContent="No albums"
      />,
    );
    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent('No albums'),
    );
    const control = screen
      .getByRole('combobox', { name: 'Album' })
      .closest('[data-part="control"]');
    expect(control).toHaveAttribute('data-connected', 'bottom');
  });

  it('keeps the listbox closed until the query reaches minChars', async () => {
    render(<Combobox label="Album" items={albums} minChars={3} />);
    const input = screen.getByRole('combobox', { name: 'Album' });
    type(input, 'Ki');
    await waitFor(() => expect(input).toHaveValue('Ki'));
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
    expect(input).toHaveAttribute('aria-expanded', 'false');

    type(input, 'Kid');
    await waitFor(() =>
      expect(screen.getByRole('option', { name: 'Kid A' })).toBeVisible(),
    );
  });

  it('picks with the keyboard and keeps the pick across the next fetch', async () => {
    const onValueChange = vi.fn();
    render(<RemoteSearch onValueChange={onValueChange} />);
    const input = screen.getByRole('combobox', { name: 'Album' });
    type(input, 'radiohead');
    await waitFor(() => expect(optionLabels()).toHaveLength(3));

    for (const name of ['OK Computer', 'Kid A']) {
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      await waitFor(() =>
        expect(screen.getByRole('option', { name })).toHaveAttribute(
          'data-highlighted',
        ),
      );
    }
    fireEvent.keyDown(input, { key: 'Enter' });
    await waitFor(() => expect(onValueChange).toHaveBeenCalledWith(['kida']));
    // The pick wrote the label into the text, which fetched a new `items`.
    await waitFor(() => expect(input).toHaveValue('Kid A'));
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(onValueChange).toHaveBeenLastCalledWith(['kida']);
  });

  it('picks with the pointer and keeps chip labels across fetches', async () => {
    const onValueChange = vi.fn();
    render(<RemoteSearch multiple onValueChange={onValueChange} />);
    const input = screen.getByRole('combobox', { name: 'Album' });
    type(input, 'radiohead');
    const option = await screen.findByRole('option', { name: 'In Rainbows' });

    fireEvent.pointerDown(option);
    fireEvent.click(option);
    await waitFor(() =>
      expect(onValueChange).toHaveBeenLastCalledWith(['inrainbows']),
    );
    // Multi-select empties the text after a pick, so the next answer is empty.
    await waitFor(() => expect(input).toHaveValue(''));
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Remove In Rainbows' }),
    ).toBeInTheDocument();
  });
});
