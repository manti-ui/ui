import { useEffect, useState } from 'react';

/**
 * The Google Fonts catalogue, for browsing only.
 *
 * It is a committed file (`pnpm gen:fonts` rewrites it) rather than a runtime
 * fetch: the catalogue endpoint is not part of Google's documented API, and a
 * devtool should not require a host app to widen its CSP to open a font list.
 * It is also ~90KB of names nobody needs until the font field is opened, so it
 * is loaded through a dynamic import and cached for the session.
 */

export interface GoogleFont {
  name: string;
  /** The CSS generic this family falls back to. */
  generic: string;
}

let pending: Promise<GoogleFont[]> | null = null;

export function loadGoogleFonts(): Promise<GoogleFont[]> {
  pending ??= import('../data/google-fonts').then((module) =>
    module.default.split('\n').map((row) => {
      const [name, generic] = row.split('|');
      return { name, generic };
    }),
  );
  return pending;
}

/**
 * The catalogue, empty until the chunk lands. Pass `false` to skip the import
 * entirely, which leaves the panel with the built-in stacks alone.
 */
export function useGoogleFonts(enabled = true): GoogleFont[] {
  const [fonts, setFonts] = useState<GoogleFont[]>([]);

  useEffect(() => {
    if (!enabled) return;
    let live = true;
    void loadGoogleFonts().then((list) => {
      if (live) setFonts(list);
    });
    return () => {
      live = false;
    };
  }, [enabled]);

  return fonts;
}
