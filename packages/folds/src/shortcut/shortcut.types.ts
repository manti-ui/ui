/**
 * Shortcut — a Manti-original, framework-agnostic keyboard-shortcut primitive.
 * Like `swipe`, it is not backed by a Zag.js machine (Zag has no shortcut
 * component); it is plain DOM + TypeScript so any renderer — or any plain JS
 * consumer — can bind key combinations to actions.
 */

/** A DOM target a shortcut listener can attach to. */
export type ShortcutTarget = Window | Document | HTMLElement;

/** A single normalized combo step: required modifier state + the resolved key. */
export interface ShortcutStep {
  ctrl: boolean;
  meta: boolean;
  shift: boolean;
  alt: boolean;
  /** Canonical, lower-cased key token (e.g. `k`, `escape`, `arrowup`, `space`). */
  key: string;
}

/** A single keyboard binding registered on a controller. */
export interface ShortcutBinding {
  /**
   * The combo to match. Modifiers `mod` (⌘ on macOS / Ctrl elsewhere), `ctrl`,
   * `shift`, `alt`/`option`, `meta`/`cmd`. Single combos (`mod+k`,
   * `ctrl+shift+p`) or space-separated sequences (`g d`).
   */
  combo: string;
  /** Fired when the combo matches. Receives the raw `KeyboardEvent`. */
  handler: (event: KeyboardEvent) => void;
  /**
   * Call `event.preventDefault()` on match so browser combos (⌘R/⌘S/⌘P/⌘F)
   * don't fire their native action. @default true
   */
  preventDefault?: boolean;
  /** Call `event.stopPropagation()` on match. @default false */
  stopPropagation?: boolean;
  /** Toggle the binding off without removing it. @default true */
  enabled?: boolean;
  /**
   * Allow the combo to fire while focus is in an `input`/`textarea`/`select`
   * or a `contenteditable` region. @default false
   */
  enableOnFormElements?: boolean;
}

/** Configuration for {@link createShortcuts}. */
export interface ShortcutOptions {
  /**
   * How long, in milliseconds, a multi-key sequence (`g d`) may pause between
   * steps before it resets. @default 1000
   */
  sequenceTimeout?: number;
  /**
   * Force macOS `mod` resolution (⌘). Detected from the platform by default;
   * override for tests or non-DOM environments.
   */
  mac?: boolean;
}

/** A bound shortcut controller. Drive it from a renderer's effect. */
export interface ShortcutControl {
  /**
   * Replace the live binding list. Read at event time, so this never re-binds
   * the underlying `keydown` listener — safe to call on every render.
   */
  setBindings(bindings: ShortcutBinding[]): void;
  /**
   * Attach the `keydown` listener to `target`. Idempotent: passing the same
   * target again is a no-op; a different (or `null`) target detaches the old
   * one first. `null` — e.g. an unmounted ref or SSR — simply detaches.
   */
  attach(target: ShortcutTarget | null): void;
  /** Detach any current listener. Idempotent; safe on unmount and in SSR. */
  destroy(): void;
}
