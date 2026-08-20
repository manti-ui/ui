import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { TreeView } from './TreeView';

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
});
