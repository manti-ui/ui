import { useEffect, useMemo } from 'react';
import type { RefObject } from 'react';
import { shortcut } from '@manti-ui/folds';

/**
 * Where a shortcut listens. `'global'` binds to `window`, so the combo fires
 * regardless of focus and needs zero wiring on any element. A ref scopes firing
 * to that element's subtree — the combo only fires while focus is inside it.
 */
export type ShortcutScope = 'global' | RefObject<HTMLElement | null>;

export interface ShortcutOptions {
  /** Where the combo listens. @default 'global' */
  scope?: ShortcutScope;
  /**
   * Call `event.preventDefault()` on match so browser combos (⌘R/⌘S/⌘P/⌘F)
   * don't trigger their native action. Opt out with `false`. @default true
   */
  preventDefault?: boolean;
  /** Toggle the binding without unmounting. @default true */
  enabled?: boolean;
  /**
   * Fire even while focus is in an `input`/`textarea`/`select` or a
   * `contenteditable` region. @default false
   */
  enableOnFormElements?: boolean;
  /** Also call `event.stopPropagation()` on match. @default false */
  stopPropagation?: boolean;
  /**
   * How long, in ms, a multi-key sequence (`g d`) may pause between steps
   * before it resets. @default 1000
   */
  sequenceTimeout?: number;
}

/** A combo → handler map for {@link useShortcuts}. */
export type ShortcutMap = Record<string, (event: KeyboardEvent) => void>;

function resolveTarget(scope: ShortcutScope): shortcut.ShortcutTarget | null {
  if (scope === 'global') {
    return typeof window !== 'undefined' ? window : null;
  }
  return scope.current;
}

/**
 * Bind one or more keyboard combos to handlers on any component — Manti UI or
 * your own — via the framework-agnostic engine in `@manti-ui/folds`. The engine
 * is created once; bindings refresh every render (so handlers stay current)
 * without ever re-binding the `keydown` listener.
 *
 * SSR-safe: the listener is only attached inside an effect, never at module
 * load. Prefer {@link useShortcut}/{@link useShortcuts}; this is the shared core.
 */
function useShortcutEngine(
  bindings: shortcut.ShortcutBinding[],
  options: ShortcutOptions,
) {
  const { scope = 'global', sequenceTimeout } = options;
  // Created once; live config flows through `setBindings`/`attach` below,
  // matching the Toast adapter's pattern. `sequenceTimeout` is read at creation.
  const control = useMemo(
    () => shortcut.createShortcuts({ sequenceTimeout }),
    [sequenceTimeout],
  );

  // Refresh bindings + target every render so the listener reads the latest
  // handlers and scope. `setBindings` never re-binds the listener, and `attach`
  // no-ops when the target is unchanged — so this is cheap on every render.
  useEffect(() => {
    control.setBindings(bindings);
    control.attach(resolveTarget(scope));
  });

  useEffect(() => () => control.destroy(), [control]);
}

/**
 * Bind a single keyboard combo to a handler.
 *
 * @example
 * useShortcut('mod+k', () => setOpen(true)); // global, preventDefault by default
 *
 * @example
 * const ref = useRef<HTMLDivElement>(null);
 * useShortcut('mod+s', save, { scope: ref }); // only while focus is inside `ref`
 */
export function useShortcut(
  combo: string,
  handler: (event: KeyboardEvent) => void,
  options: ShortcutOptions = {},
): void {
  const { preventDefault, enabled, enableOnFormElements, stopPropagation } =
    options;
  useShortcutEngine(
    [
      {
        combo,
        handler,
        preventDefault,
        enabled,
        enableOnFormElements,
        stopPropagation,
      },
    ],
    options,
  );
}

/**
 * Bind a map of combos to handlers in one call. Options apply to every binding.
 *
 * @example
 * useShortcuts({ 'mod+k': openSearch, 'mod+/': toggleHelp, 'g d': goDashboard });
 */
export function useShortcuts(
  map: ShortcutMap,
  options: ShortcutOptions = {},
): void {
  const { preventDefault, enabled, enableOnFormElements, stopPropagation } =
    options;
  const bindings = Object.entries(map).map(([combo, handler]) => ({
    combo,
    handler,
    preventDefault,
    enabled,
    enableOnFormElements,
    stopPropagation,
  }));
  useShortcutEngine(bindings, options);
}
