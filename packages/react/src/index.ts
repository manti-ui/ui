export { mantiUi } from './meta';
export type { MantiUiMetadata } from './meta';

export * from './components';

// Also available standalone at `@manti-ui/react/shortcut` (no component deps).
export { useShortcut, useShortcuts } from './shortcut';
export type {
  ShortcutMap,
  ShortcutOptions,
  ShortcutScope,
} from './shortcut';

export type { MantiBuiltinTone, MantiTone } from '@manti-ui/tokens';
