export { mantiUi } from './meta.js';
export type { MantiUiMetadata } from './meta.js';

export * from './components/index.js';

// Also available standalone at `@manti-ui/react/shortcut` (no component deps).
export { useShortcut, useShortcuts } from './shortcut/index.js';
export type {
  ShortcutMap,
  ShortcutOptions,
  ShortcutScope,
} from './shortcut/index.js';

export type { MantiBuiltinVariant, MantiVariant } from '@manti-ui/tokens';
