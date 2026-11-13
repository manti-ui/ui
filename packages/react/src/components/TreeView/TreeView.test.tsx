import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { TreeView } from './TreeView.js';

describe('TreeView', () => {
  it('expands branches, renders icon state, and reports selection', async () => {
    const onSelectionChange = vi.fn();
    render(
      <TreeView
        label="Files"
        defaultExpandedValue={['src']}
        onSelectionChange={onSelectionChange}
        icon={(node, state) => `${node.label}:${state.depth}`}
        items={[
          {
            value: 'src',
            label: 'src',
            children: [{ value: 'app', label: 'App.tsx' }],
          },
        ]}
      />,
    );

    expect(screen.getByText('src:1')).toBeInTheDocument();
    const app = screen.getByText('App.tsx');
    fireEvent.click(app);

    await waitFor(() =>
      expect(onSelectionChange).toHaveBeenCalledWith(['app']),
    );
    expect(app).toBeInTheDocument();
  });

  it('follows controlled expandedValue and selectedValue without a remount', async () => {
    const items = [
      {
        value: 'src',
        label: 'src',
        children: [{ value: 'app', label: 'App.tsx' }],
      },
      {
        value: 'docs',
        label: 'docs',
        children: [{ value: 'readme', label: 'README.md' }],
      },
    ];
    const onExpandedChange = vi.fn();
    const { rerender } = render(
      <TreeView
        label="Files"
        items={items}
        expandedValue={[]}
        selectedValue={[]}
        onExpandedChange={onExpandedChange}
      />,
    );

    const tree = screen.getByRole('tree');
    const branch = (name: string) =>
      screen.getByText(name).closest('[data-part="branch"]');
    const item = (name: string) =>
      screen.getByText(name).closest('[data-part="item"]');

    expect(branch('src')).toHaveAttribute('aria-expanded', 'false');
    expect(branch('docs')).toHaveAttribute('aria-expanded', 'false');

    rerender(
      <TreeView
        label="Files"
        items={items}
        expandedValue={['src', 'docs']}
        selectedValue={['readme']}
        onExpandedChange={onExpandedChange}
      />,
    );

    await waitFor(() =>
      expect(branch('src')).toHaveAttribute('aria-expanded', 'true'),
    );
    expect(branch('docs')).toHaveAttribute('aria-expanded', 'true');
    expect(item('README.md')).toHaveAttribute('aria-selected', 'true');
    expect(item('App.tsx')).not.toHaveAttribute('aria-selected', 'true');
    // Same DOM node: the tree updated in place rather than remounting.
    expect(screen.getByRole('tree')).toBe(tree);

    rerender(
      <TreeView
        label="Files"
        items={items}
        expandedValue={['docs']}
        selectedValue={['app']}
        onExpandedChange={onExpandedChange}
      />,
    );

    await waitFor(() =>
      expect(branch('src')).toHaveAttribute('aria-expanded', 'false'),
    );
    expect(item('App.tsx')).toHaveAttribute('aria-selected', 'true');
    expect(item('README.md')).not.toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tree')).toBe(tree);

    const control = screen
      .getByText('src')
      .closest('[data-part="branch-control"]');
    if (control == null) throw new Error('missing branch control');
    fireEvent.click(control);

    await waitFor(() =>
      expect(onExpandedChange).toHaveBeenCalledWith(['docs', 'src']),
    );
  });
});
