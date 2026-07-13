import type {
  ShortcutBinding,
  ShortcutControl,
  ShortcutOptions,
  ShortcutStep,
  ShortcutTarget,
} from './shortcut.types';

const DEFAULT_SEQUENCE_TIMEOUT = 1000;

// The most steps any single combo can span, which also caps the recent-key
// buffer — no realistic sequence is longer, and it bounds memory.
const MAX_SEQUENCE_LENGTH = 8;

/** Aliases mapped onto a single canonical key token (both sides normalized). */
const KEY_ALIASES: Record<string, string> = {
  ' ': 'space',
  spacebar: 'space',
  esc: 'escape',
  return: 'enter',
  del: 'delete',
  up: 'arrowup',
  down: 'arrowdown',
  left: 'arrowleft',
  right: 'arrowright',
  plus: '+',
};

/** Modifier key names, so a lone modifier keydown can be ignored. */
const MODIFIER_KEYS = new Set(['control', 'meta', 'shift', 'alt']);

/** Normalize a raw key token (from a combo or `event.key`) to a canonical form. */
function canonicalKey(raw: string): string {
  const key = raw.toLowerCase();
  return KEY_ALIASES[key] ?? key;
}

/** Detect macOS-family platforms so `mod` resolves to ⌘ instead of Ctrl. */
function detectMac(): boolean {
  if (typeof navigator === 'undefined') return false;
  const platform =
    // `userAgentData` is the modern source; `platform`/`userAgent` are fallbacks.
    (navigator as Navigator & { userAgentData?: { platform?: string } })
      .userAgentData?.platform ||
    navigator.platform ||
    navigator.userAgent ||
    '';
  return /mac|iphone|ipad|ipod/i.test(platform);
}

/**
 * Parse a combo string into its ordered steps. `mod` resolves to ⌘ (`meta`) on
 * macOS and Ctrl elsewhere; unknown tokens become the step's key.
 */
export function parseCombo(combo: string, mac: boolean): ShortcutStep[] {
  return combo
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((stepText) => {
      const step: ShortcutStep = {
        ctrl: false,
        meta: false,
        shift: false,
        alt: false,
        key: '',
      };
      for (const rawToken of stepText.split('+')) {
        const token = rawToken.trim().toLowerCase();
        if (!token) continue;
        switch (token) {
          case 'mod':
            if (mac) step.meta = true;
            else step.ctrl = true;
            break;
          case 'ctrl':
          case 'control':
            step.ctrl = true;
            break;
          case 'meta':
          case 'cmd':
          case 'command':
          case 'super':
          case 'win':
            step.meta = true;
            break;
          case 'shift':
            step.shift = true;
            break;
          case 'alt':
          case 'option':
          case 'opt':
            step.alt = true;
            break;
          default:
            step.key = canonicalKey(token);
        }
      }
      return step;
    });
}

/** Snapshot the modifier + key state of a `KeyboardEvent` as a step. */
function stepFromEvent(event: KeyboardEvent): ShortcutStep {
  return {
    ctrl: event.ctrlKey,
    meta: event.metaKey,
    shift: event.shiftKey,
    alt: event.altKey,
    key: canonicalKey(event.key),
  };
}

function stepsEqual(a: ShortcutStep, b: ShortcutStep): boolean {
  return (
    a.ctrl === b.ctrl &&
    a.meta === b.meta &&
    a.shift === b.shift &&
    a.alt === b.alt &&
    a.key === b.key
  );
}

/** Whether `steps` matches the tail of the recently pressed `buffer`. */
function sequenceMatches(steps: ShortcutStep[], buffer: ShortcutStep[]): boolean {
  if (steps.length === 0 || steps.length > buffer.length) return false;
  const offset = buffer.length - steps.length;
  for (let i = 0; i < steps.length; i++) {
    if (!stepsEqual(steps[i], buffer[offset + i])) return false;
  }
  return true;
}

/** Whether focus is in a text-entry element the guard should protect. */
function isFormElement(target: EventTarget | null): boolean {
  if (!target || !(target instanceof Element)) return false;
  const tag = target.tagName.toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
  return (target as HTMLElement).isContentEditable === true;
}

interface CompiledBinding extends ShortcutBinding {
  steps: ShortcutStep[];
}

/**
 * Create a framework-agnostic keyboard-shortcut controller. It owns combo
 * parsing, `keydown` matching (single combos and sequences), the form-element
 * guard, and `preventDefault`/`stopPropagation` — never any layout or styling.
 *
 * SSR-safe: nothing here touches `window`/`navigator` at creation. Call
 * {@link ShortcutControl.attach} from a client-side effect once a target exists.
 */
export function createShortcuts(options: ShortcutOptions = {}): ShortcutControl {
  const sequenceTimeout = options.sequenceTimeout ?? DEFAULT_SEQUENCE_TIMEOUT;
  const mac = options.mac ?? detectMac();

  let compiled: CompiledBinding[] = [];
  let current: ShortcutTarget | null = null;

  // Recent non-modifier presses, kept in time order so sequences (`g d`) can
  // match against the tail. Entries decay after `sequenceTimeout`.
  let buffer: ShortcutStep[] = [];
  let lastPressTime = 0;

  const onKeyDown = (event: KeyboardEvent) => {
    // Ignore lone modifier presses — a combo fires on its final, non-modifier
    // key, and letting modifiers into the buffer would break sequences.
    if (MODIFIER_KEYS.has(event.key.toLowerCase())) return;

    const now =
      typeof event.timeStamp === 'number' && event.timeStamp > 0
        ? event.timeStamp
        : lastPressTime + 1;
    if (now - lastPressTime > sequenceTimeout) buffer = [];
    lastPressTime = now;

    buffer.push(stepFromEvent(event));
    if (buffer.length > MAX_SEQUENCE_LENGTH) {
      buffer = buffer.slice(-MAX_SEQUENCE_LENGTH);
    }

    const inFormElement = isFormElement(event.target);

    for (const binding of compiled) {
      if (binding.enabled === false) continue;
      if (inFormElement && !binding.enableOnFormElements) continue;
      if (!sequenceMatches(binding.steps, buffer)) continue;

      if (binding.preventDefault !== false) event.preventDefault();
      if (binding.stopPropagation) event.stopPropagation();
      binding.handler(event);
    }
  };

  const detach = () => {
    if (current) current.removeEventListener('keydown', onKeyDown as EventListener);
    current = null;
  };

  return {
    setBindings(bindings) {
      compiled = bindings.map((binding) => ({
        ...binding,
        steps: parseCombo(binding.combo, mac),
      }));
    },
    attach(target) {
      if (target === current) return;
      detach();
      current = target;
      if (target) target.addEventListener('keydown', onKeyDown as EventListener);
    },
    destroy: detach,
  };
}
