/**
 * Compatibility re-exports for the React adapter. Color parsing and color
 * space math live in the framework-agnostic folds package so native palette
 * interaction does not cross through a React-side conversion layer.
 */
export {
  COLOR_PICKER_FORMATS,
  formatHexColor,
  formatOklchColor,
  parseOklchColor,
} from '@manti-ui/folds';
export type { ColorPickerFormat, RgbColor } from '@manti-ui/folds';
