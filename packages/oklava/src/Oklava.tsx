import { useEffect, useState } from 'react';
import { Button, FloatingPanel, ScrollArea } from '@manti-ui/react';

import { ExportDialog } from './ExportDialog';
import { ThemePanel, type ColorScheme } from './ThemePanel';
import { DEFAULT_STORAGE_KEY, readHostFocusRingWidth } from './theme/apply';
import { randomTheme } from './theme/config';
import { initTheme, useOklavaTheme } from './theme/store';
import { ensureStyles, setHostFocusRingWidth } from './styles';

/**
 * The Oklava devtools panel.
 *
 * Drop it into an app built with `@manti-ui/react` and every token knob becomes
 * live: the panel writes an unlayered `<style>` that beats `@layer manti.tokens`,
 * which is the same escape hatch a consumer would use by hand. Nothing here is
 * devtool-only, so what the app looks like with the panel open is what it looks
 * like once the CSS is pasted in.
 *
 * It is meant for development. Guard it so it never reaches a production
 * bundle:
 *
 * ```tsx
 * {import.meta.env.DEV && <Oklava />}
 * ```
 *
 * The package is side-effect free and single-entry, so that branch tree-shakes
 * the whole panel away.
 */

/**
 * The panel's starting size, in pixels.
 *
 * The machine writes width and height as inline styles, so this cannot live in
 * the stylesheet. A rail's worth of width, and a height that leaves the host app
 * visible; both are starting points, since the panel is resizable.
 */
const PANEL_SIZE = { width: 352, height: 560 };
const MIN_SIZE = { width: 288, height: 240 };

const SettingsIcon = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.14.53.57.94 1.11 1.02H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

export interface OklavaProps {
  /** Open the panel on first mount. */
  defaultOpen?: boolean;
  /**
   * Where the theme is remembered between reloads. `false` keeps the panel
   * ephemeral, which is what a shared demo usually wants.
   */
  storageKey?: string | false;
  /**
   * Light/dark value. Omit and Oklava reads `data-theme` on `<html>`, the
   * convention Manti's own surfaces use; with neither, the Appearance control
   * is not rendered, because a devtool should not invent a light/dark mechanism
   * for an app that already has one.
   */
  colorScheme?: ColorScheme;
  /** Called when the Appearance control changes. */
  onColorSchemeChange?: (scheme: ColorScheme) => void;
  /** Path the agent prompt tells an agent to write. */
  themeFile?: string;
  /** Offer the Google Fonts catalogue. Loads a ~90KB chunk on first open. */
  googleFonts?: boolean;
  /** Extra class on the panel content. */
  className?: string;
}

/** Read and write `data-theme` on `<html>` when the host passes no scheme. */
function useDocumentColorScheme(enabled: boolean) {
  const [scheme, setScheme] = useState<ColorScheme | undefined>(undefined);

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    const read = () => {
      const value = root.dataset.theme;
      setScheme(value === 'light' || value === 'dark' ? value : undefined);
    };
    read();
    // The host owns the attribute, so follow it rather than caching a snapshot.
    const observer = new MutationObserver(read);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, [enabled]);

  return {
    scheme,
    setScheme: (next: ColorScheme) => {
      document.documentElement.dataset.theme = next;
      setScheme(next);
    },
  };
}

export function Oklava({
  defaultOpen = false,
  storageKey = DEFAULT_STORAGE_KEY,
  colorScheme,
  onColorSchemeChange,
  themeFile,
  googleFonts = true,
  className,
}: OklavaProps) {
  // Mount-gated: the panel is a browser surface, and rendering nothing on the
  // server keeps a Next.js hydration pass clean.
  const [mounted, setMounted] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const auto = useDocumentColorScheme(mounted && colorScheme === undefined);
  const { set, reset, isDefault } = useOklavaTheme();

  useEffect(() => {
    ensureStyles();
    // Read the host's focus ring before the store paints an override over it.
    setHostFocusRingWidth(readHostFocusRingWidth());
    initTheme(storageKey);
    setMounted(true);
  }, [storageKey]);

  if (!mounted) return null;

  const scheme = colorScheme ?? auto.scheme;
  const setScheme = onColorSchemeChange ?? auto.setScheme;

  return (
    <>
      <FloatingPanel
        title="Oklava"
        defaultOpen={defaultOpen}
        defaultSize={PANEL_SIZE}
        minSize={MIN_SIZE}
        className={['oklava-panel', className].filter(Boolean).join(' ')}
        trigger={
          <Button
            className="oklava-launcher"
            variant="secondary"
            size="sm"
            iconOnly
            aria-label="Open the Oklava theme panel"
          >
            {SettingsIcon}
          </Button>
        }
      >
        <div className="oklava-body">
          <ScrollArea className="oklava-scroll" type="always">
            <ThemePanel
              colorScheme={scheme}
              onColorSchemeChange={setScheme}
              googleFonts={googleFonts}
              footer={
                <div className="oklava-footer">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => set(randomTheme())}
                  >
                    Surprise me
                  </Button>
                  <Button
                    variant="tertiary"
                    size="sm"
                    onClick={reset}
                    disabled={isDefault}
                  >
                    Reset
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setExportOpen(true)}
                  >
                    Take it
                  </Button>
                </div>
              }
            />
          </ScrollArea>
        </div>
      </FloatingPanel>
      <ExportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        themeFile={themeFile}
      />
    </>
  );
}
