import { fireEvent, render, screen } from '@testing-library/react';
import { useRef } from 'react';
import type { ReactNode, RefObject } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { PortalContainerProvider } from './Portal.js';
import { Menu } from '../components/Menu/Menu.js';
import { Tooltip } from '../components/Tooltip/Tooltip.js';

function Layer({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div ref={ref} data-testid="layer">
      <PortalContainerProvider container={ref}>
        {children}
      </PortalContainerProvider>
    </div>
  );
}

const items = [{ value: 'build', label: 'Build' }];

async function openMenu() {
  fireEvent.click(screen.getByRole('button', { name: 'Open' }));
  const menu = await screen.findByRole('menu');
  const positioner = menu.parentElement;
  expect(positioner).toHaveAttribute('data-part', 'positioner');
  return positioner as HTMLElement;
}

describe('Portal container', () => {
  it('mounts an overlay inside the provided container', async () => {
    render(
      <Layer>
        <Menu trigger={<button type="button">Open</button>} items={items} />
      </Layer>,
    );

    const positioner = await openMenu();
    expect(screen.getByTestId('layer')).toContainElement(positioner);
    expect(positioner.parentElement).not.toBe(document.body);
  });

  it('mounts an overlay under document.body without a provider', async () => {
    render(
      <div data-testid="local-tree">
        <Menu trigger={<button type="button">Open</button>} items={items} />
      </div>,
    );

    const positioner = await openMenu();
    expect(positioner.parentElement).toBe(document.body);
    expect(screen.getByTestId('local-tree')).not.toContainElement(positioner);
  });

  it('lets an explicit container win over the provider', () => {
    function Explicit() {
      const own = useRef<HTMLDivElement>(null);
      return (
        <>
          <div ref={own} data-testid="own" />
          <Layer>
            <Tooltip
              content="Details"
              open
              portalled
              portalContainer={own as RefObject<HTMLElement>}
            >
              <button type="button">Info</button>
            </Tooltip>
          </Layer>
        </>
      );
    }
    const { rerender } = render(<Explicit />);
    // The ref attaches on commit; render again so the portal reads it.
    rerender(<Explicit />);

    const tooltip = screen.getByRole('tooltip');
    expect(screen.getByTestId('own')).toContainElement(tooltip);
    expect(screen.getByTestId('layer')).not.toContainElement(tooltip);
  });

  it('renders nothing on the server, inside a provider or not', () => {
    const open = (
      <Menu
        trigger={<button type="button">Open</button>}
        defaultOpen
        items={items}
      />
    );
    const plain = renderToString(open);
    const provided = renderToString(<Layer>{open}</Layer>);

    for (const html of [plain, provided]) {
      expect(html).toContain('Open');
      expect(html).not.toContain('data-part="positioner"');
      expect(html).not.toContain('Build');
    }
  });
});
