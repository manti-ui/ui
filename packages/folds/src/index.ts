export * as toggle from '@zag-js/toggle';
export * as switchMachine from '@zag-js/switch';
export * as checkbox from '@zag-js/checkbox';
export * as radioGroup from '@zag-js/radio-group';
export * as collapsible from '@zag-js/collapsible';
export * as accordion from '@zag-js/accordion';
export * as tabs from '@zag-js/tabs';
export * as tooltip from '@zag-js/tooltip';
export * as dialog from '@zag-js/dialog';
export * as popover from '@zag-js/popover';
export * as hoverCard from '@zag-js/hover-card';
export * as menu from '@zag-js/menu';
export * as toast from '@zag-js/toast';
export * as numberInput from '@zag-js/number-input';
export * as pinInput from '@zag-js/pin-input';
export * as slider from '@zag-js/slider';
export * as tagsInput from '@zag-js/tags-input';
export * as editable from '@zag-js/editable';
export * as toggleGroup from '@zag-js/toggle-group';
export * as select from '@zag-js/select';
export * as combobox from '@zag-js/combobox';
export * as listbox from '@zag-js/listbox';
export * as treeView from '@zag-js/tree-view';
export * as pagination from '@zag-js/pagination';
export * as avatar from '@zag-js/avatar';
export * as progress from '@zag-js/progress';
export * as ratingGroup from '@zag-js/rating-group';
export * as carousel from '@zag-js/carousel';
export * as qrCode from '@zag-js/qr-code';
export * as clipboard from '@zag-js/clipboard';
export * as fileUpload from '@zag-js/file-upload';
export * as signaturePad from '@zag-js/signature-pad';
export * as datePicker from '@zag-js/date-picker';
export * as timePicker from '@zag-js/time-picker';
export * as timer from '@zag-js/timer';
export * as steps from '@zag-js/steps';
export * as tour from '@zag-js/tour';
export * as splitter from '@zag-js/splitter';
export * as colorPicker from '@zag-js/color-picker';
export * as navigationMenu from '@zag-js/navigation-menu';
export * as floatingPanel from '@zag-js/floating-panel';

/**
 * Manti-original behaviors. Not from Zag.js — these are framework-agnostic
 * primitives Manti UI authors directly to fill gaps in the Zag catalog.
 */
export * as swipe from './swipe';

/**
 * Headless data behaviors. Not from Zag.js — Zag has no table machine, so the
 * Data Table is built on TanStack `table-core`, the same headless/agnostic shape
 * (logic-only brain + per-framework adapter). The shared column/types contract
 * lives here; renderers add their framework adapter (`@tanstack/react-table`, …).
 */
export * as table from './table';

export const mantiBehaviorContract = {
  packageName: '@manti-ui/folds',
  engine: 'Zag.js',
  status: 'design-system',
} as const;

export type MantiBehaviorContract = typeof mantiBehaviorContract;
