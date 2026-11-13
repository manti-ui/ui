export { mantiUi } from './meta.js';
export type { MantiUiMetadata } from './meta.js';

export * from './components/index.js';

export { PortalContainerProvider } from './internal/Portal.js';
export type { PortalContainerProviderProps } from './internal/Portal.js';

// Also available standalone at `@manti-ui/react/shortcut` (no component deps).
export { useShortcut, useShortcuts } from './shortcut/index.js';
export type {
  ShortcutMap,
  ShortcutOptions,
  ShortcutScope,
} from './shortcut/index.js';

export type { MantiBuiltinVariant, MantiVariant } from '@manti-ui/tokens';
