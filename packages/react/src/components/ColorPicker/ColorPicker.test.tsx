import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ColorPicker } from './ColorPicker';

describe('ColorPicker formats', () => {
  it('keeps the existing rgba output as the default format', () => {
    render(<ColorPicker defaultValue="#7c3aed" />);

    expect(screen.getByText('rgba(124, 58, 237, 1)')).toBeInTheDocument();
  });

  it('serializes HSLA and HSBA output through the Zag color model', () => {
    render(
      <>
        <ColorPicker label="HSL" format="hsla" defaultValue="#ff0000" />
        <ColorPicker label="HSB" format="hsba" defaultValue="#ff0000" />
      </>,
    );

    expect(screen.getByText('hsla(0, 100%, 50%, 1)')).toBeInTheDocument();
    expect(screen.getByText('hsba(0, 100%, 100%, 1)')).toBeInTheDocument();
  });

  it('uses the selected format for trigger text and the initial copy tab', async () => {
    render(
      <ColorPicker
        format="oklch"
        defaultValue="#ff0000"
        formats={['hex', 'oklch']}
      />,
    );

    const trigger = screen.getByRole('button', {
      name: 'Select color. Current color is oklch(0.628 0.258 29.2)',
    });
    fireEvent.click(trigger);
    await waitFor(() =>
      expect(trigger).toHaveAttribute('aria-expanded', 'true'),
    );
    expect(screen.getByText('oklch(0.628 0.258 29.2)')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'OKLCH' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('keeps palette keyboard interaction in native OKLCH channels', async () => {
    const onValueChange = vi.fn();
    render(
      <ColorPicker
        colorSpace="oklch"
        format="oklch"
        defaultValue="oklch(0.5 0.1 40)"
        onValueChange={onValueChange}
      />,
    );

    const trigger = screen.getByRole('button', {
      name: 'Select color. Current color is oklch(0.5 0.1 40)',
    });
    fireEvent.click(trigger);
    await waitFor(() =>
      expect(trigger).toHaveAttribute('aria-expanded', 'true'),
    );

    const areaThumb = screen.getByRole('slider', {
      name: 'chroma and lightness',
    });
    expect(areaThumb).toHaveAttribute(
      'aria-valuetext',
      'chroma 0.1, lightness 0.5',
    );

    fireEvent.keyDown(areaThumb, { key: 'ArrowRight' });

    await waitFor(() =>
      expect(onValueChange).toHaveBeenLastCalledWith('oklch(0.5 0.101 40)'),
    );
  });

  it('maps pointer selection directly to native OKLCH area channels', async () => {
    const onValueChange = vi.fn();
    render(
      <ColorPicker
        colorSpace="oklch"
        format="oklch"
        defaultValue="oklch(0.5 0.1 40)"
        onValueChange={onValueChange}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Select color. Current color is oklch(0.5 0.1 40)',
      }),
    );
    const area = document.querySelector<HTMLElement>(
      "[data-scope='color-picker'][data-part='area']",
    );
    if (!area) throw new Error('Native color area was not rendered');
    Object.defineProperty(area, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        left: 0,
        top: 0,
        width: 100,
        height: 100,
        right: 100,
        bottom: 100,
      }),
    });

    fireEvent.pointerDown(area, {
      button: 0,
      clientX: 50,
      clientY: 25,
      pointerId: 1,
    });

    await waitFor(() =>
      expect(onValueChange).toHaveBeenLastCalledWith('oklch(0.75 0.2 40)'),
    );
  });

  it('reports format-tab changes and emits values in the selected format', async () => {
    const onFormatChange = vi.fn();
    const onValueChange = vi.fn();
    render(
      <ColorPicker
        defaultValue="#ff0000"
        formats={['rgba', 'oklch']}
        onFormatChange={onFormatChange}
        onValueChange={onValueChange}
      />,
    );

    const trigger = screen.getByRole('button', {
      name: 'Select color. Current color is rgba(255, 0, 0, 1)',
    });
    fireEvent.click(trigger);
    await waitFor(() =>
      expect(trigger).toHaveAttribute('aria-expanded', 'true'),
    );
    fireEvent.click(screen.getByRole('tab', { name: 'OKLCH' }));

    await waitFor(() => expect(onFormatChange).toHaveBeenCalledWith('oklch'));
    expect(screen.getByText('oklch(0.628 0.258 29.2)')).toBeInTheDocument();

    fireEvent.change(screen.getByRole('textbox', { name: 'Color value' }), {
      target: { value: 'oklch(0.7 0.15 270)' },
    });

    await waitFor(() =>
      expect(onValueChange).toHaveBeenCalledWith('oklch(0.7 0.15 270)'),
    );
  });

  it('serializes translucent hex colors with an alpha byte', () => {
    render(
      <ColorPicker
        format="hex"
        defaultValue="rgba(255, 0, 0, 0.5)"
        formats={['hex']}
      />,
    );

    expect(screen.getByText('#FF000080')).toBeInTheDocument();
  });

  it('does not commit invalid or half-typed values', async () => {
    const onValueChange = vi.fn();
    render(
      <ColorPicker
        format="oklch"
        defaultValue="#ff0000"
        onValueChange={onValueChange}
      />,
    );

    const trigger = screen.getByRole('button', {
      name: 'Select color. Current color is oklch(0.628 0.258 29.2)',
    });
    fireEvent.click(trigger);
    await waitFor(() =>
      expect(trigger).toHaveAttribute('aria-expanded', 'true'),
    );
    const input = screen.getByRole('textbox', { name: 'Color value' });
    fireEvent.change(input, { target: { value: 'oklch(' } });

    await waitFor(() => {
      expect(screen.getByText('oklch(0.628 0.258 29.2)')).toBeInTheDocument();
    });
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
