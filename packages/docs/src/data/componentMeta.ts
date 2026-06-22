/**
 * Per-component documentation data. The 8 Phase-1 exemplars carry full props +
 * anatomy; `componentCatalog` lists the whole library for the overview grid.
 *
 * Component tokens are NOT duplicated here — TokenTable reads them straight from
 * the `componentTokens` registry in `@manti-ui/tokens`, the single source of
 * truth, keyed by `scope`.
 */

import type { ComponentMeta } from './component-meta-types';

export type {
  AnatomyPart,
  ComponentMeta,
  PropRow,
} from './component-meta-types';

// The 8 Phase-1 exemplars live inline; every other component ships its own file
// under ./components/<key>.ts, auto-collected and merged below.
const inlineMeta: Record<string, ComponentMeta> = {
  button: {
    scope: 'button',
    props: [
      {
        name: 'variant',
        type: `'solid' | 'soft' | 'outline' | 'ghost'`,
        default: `'solid'`,
        description: 'Visual emphasis level.',
      },
      {
        name: 'tone',
        type: 'MantiTone',
        default: `'neutral'`,
        description: 'Semantic color. Built-ins plus any custom tone.',
      },
      {
        name: 'size',
        type: `'sm' | 'md' | 'lg'`,
        default: `'md'`,
        description: 'Control size.',
      },
      {
        name: 'loading',
        type: 'boolean',
        default: 'false',
        description: 'Show a spinner, block interaction, and preserve width.',
      },
      {
        name: 'fullWidth',
        type: 'boolean',
        default: 'false',
        description: 'Stretch to fill the available inline space.',
      },
      {
        name: 'iconOnly',
        type: 'boolean',
        default: 'false',
        description: 'Render as a square icon button. Provide an aria-label.',
      },
      {
        name: 'leadingIcon',
        type: 'ReactNode',
        description: 'Content placed before the label.',
      },
      {
        name: 'trailingIcon',
        type: 'ReactNode',
        description: 'Content placed after the label.',
      },
    ],
    anatomy: [
      { part: 'root', description: 'The <button> element.' },
      { part: 'spinner', description: 'Loading indicator (when loading).' },
      { part: 'label', description: 'Wraps icons and children.' },
    ],
  },

  switch: {
    scope: 'switch',
    props: [
      {
        name: 'size',
        type: `'sm' | 'md'`,
        default: `'md'`,
        description: 'Control size.',
      },
      {
        name: 'tone',
        type: 'MantiTone',
        default: `'primary'`,
        description: 'Active tone when checked.',
      },
      {
        name: 'checked',
        type: 'boolean',
        description: 'Controlled checked state.',
      },
      {
        name: 'defaultChecked',
        type: 'boolean',
        description: 'Initial checked state when uncontrolled.',
      },
      {
        name: 'onCheckedChange',
        type: '(checked: boolean) => void',
        description: 'Called whenever the checked state changes.',
      },
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Optional trailing label.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        description: 'Disable the control.',
      },
      {
        name: 'name / value',
        type: 'string',
        description: 'Form field name and submitted value when checked.',
      },
    ],
    anatomy: [
      { part: 'root', description: 'The <label> wrapping the control.' },
      { part: 'control', description: 'The track.' },
      { part: 'thumb', description: 'The sliding knob.' },
      { part: 'hidden-input', description: 'Visually hidden checkbox input.' },
      { part: 'label', description: 'Optional trailing label text.' },
    ],
  },

  card: {
    scope: 'card',
    props: [
      {
        name: 'elevated',
        type: 'boolean',
        default: 'false',
        description: 'Lift with a soft shadow instead of a border.',
      },
      {
        name: 'interactive',
        type: 'boolean',
        default: 'false',
        description: 'Apply the smooth hover lift. Pair with real semantics.',
      },
    ],
    anatomy: [
      { part: 'root', description: 'The signature pillowy surface.' },
      {
        part: 'header',
        description: 'Card.Header — title + description region.',
      },
      { part: 'title', description: 'Card.Title — the heading.' },
      {
        part: 'description',
        description: 'Card.Description — supporting copy.',
      },
      { part: 'body', description: 'Card.Body — main content.' },
      { part: 'footer', description: 'Card.Footer — actions / meta.' },
    ],
  },

  badge: {
    scope: 'badge',
    props: [
      {
        name: 'variant',
        type: `'solid' | 'soft' | 'outline'`,
        default: `'soft'`,
        description: 'Visual emphasis level.',
      },
      {
        name: 'tone',
        type: 'MantiTone',
        default: `'neutral'`,
        description: 'Semantic color.',
      },
      {
        name: 'size',
        type: `'sm' | 'md'`,
        default: `'sm'`,
        description: 'Chip size.',
      },
      {
        name: 'dot',
        type: 'boolean',
        default: 'false',
        description: 'Show a leading status dot.',
      },
    ],
    anatomy: [
      { part: 'root', description: 'The chip element.' },
      { part: 'dot', description: 'Leading status indicator (when dot).' },
    ],
  },

  alert: {
    scope: 'alert',
    props: [
      {
        name: 'tone',
        type: 'MantiTone',
        default: `'info'`,
        description: 'Semantic color.',
      },
      {
        name: 'variant',
        type: `'soft' | 'solid'`,
        default: `'soft'`,
        description: 'Fill style.',
      },
      {
        name: 'title',
        type: 'ReactNode',
        description: 'Bold leading line.',
      },
      {
        name: 'icon',
        type: 'ReactNode',
        description: 'Leading status icon.',
      },
      {
        name: 'onDismiss',
        type: '() => void',
        description: 'Show a close button and handle dismissal.',
      },
      {
        name: 'role',
        type: `'status' | 'alert'`,
        description: 'Auto-escalates to alert for danger / warning tones.',
      },
    ],
    anatomy: [
      { part: 'root', description: 'The alert container.' },
      { part: 'icon', description: 'Leading status icon.' },
      { part: 'content', description: 'Title + description wrapper.' },
      { part: 'title', description: 'The bold leading line.' },
      { part: 'description', description: 'Supporting copy.' },
      { part: 'dismiss', description: 'Close button (when onDismiss).' },
    ],
  },

  tabs: {
    scope: 'tabs',
    props: [
      {
        name: 'items',
        type: 'TabItem[]',
        description:
          'Each item: value, label, content, optional icon/disabled.',
      },
      {
        name: 'variant',
        type: `'line' | 'pill' | 'soft'`,
        default: `'line'`,
        description: 'Visual style.',
      },
      {
        name: 'tone',
        type: 'MantiTone',
        default: `'primary'`,
        description: 'Active tone for the selected tab and indicator.',
      },
      {
        name: 'value',
        type: 'string',
        description: 'Controlled selected value.',
      },
      {
        name: 'defaultValue',
        type: 'string',
        description: 'Initial selection (defaults to the first item).',
      },
      {
        name: 'onValueChange',
        type: '(value: string) => void',
        description: 'Called when the selected value changes.',
      },
      {
        name: 'orientation',
        type: `'horizontal' | 'vertical'`,
        description: 'Layout direction.',
      },
    ],
    anatomy: [
      { part: 'root', description: 'The tabs container.' },
      { part: 'list', description: 'The trigger row.' },
      { part: 'trigger', description: 'A tab button.' },
      { part: 'indicator', description: 'The sliding active marker.' },
      { part: 'content', description: 'A tab panel.' },
    ],
  },

  dialog: {
    scope: 'dialog',
    props: [
      {
        name: 'trigger',
        type: 'ReactElement',
        description: 'Element cloned with the open trigger props.',
      },
      {
        name: 'title',
        type: 'ReactNode',
        description: 'Heading shown at the top.',
      },
      {
        name: 'description',
        type: 'ReactNode',
        description: 'Supporting copy under the title.',
      },
      {
        name: 'children',
        type: 'ReactNode | (({ close }) => ReactNode)',
        description: 'Body; accepts a render function receiving { close }.',
      },
      {
        name: 'footer',
        type: 'ReactNode | (({ close }) => ReactNode)',
        description: 'Footer actions; also receives { close }.',
      },
      {
        name: 'size',
        type: `'sm' | 'md' | 'lg'`,
        default: `'md'`,
        description: 'Width preset.',
      },
      {
        name: 'open / defaultOpen',
        type: 'boolean',
        description: 'Controlled / uncontrolled open state.',
      },
      {
        name: 'onOpenChange',
        type: '(open: boolean) => void',
        description: 'Called whenever the open state changes.',
      },
      {
        name: 'modal',
        type: 'boolean',
        default: 'true',
        description: 'Trap pointer interaction and hide content below.',
      },
    ],
    anatomy: [
      { part: 'trigger', description: 'The cloned opener element.' },
      { part: 'backdrop', description: 'The dimmed scrim.' },
      { part: 'positioner', description: 'Centers the content.' },
      { part: 'content', description: 'The frosted panel.' },
      { part: 'title', description: 'The heading.' },
      { part: 'description', description: 'Supporting copy.' },
      { part: 'body', description: 'The main content region.' },
      { part: 'footer', description: 'The actions region.' },
    ],
  },

  tooltip: {
    scope: 'tooltip',
    props: [
      {
        name: 'content',
        type: 'ReactNode',
        description: 'The tooltip content.',
      },
      {
        name: 'children',
        type: 'ReactNode',
        description: 'The trigger (wrapped in an inline trigger).',
      },
      {
        name: 'openDelay',
        type: 'number',
        description: 'Delay before opening, in ms.',
      },
      {
        name: 'closeDelay',
        type: 'number',
        description: 'Delay before closing, in ms.',
      },
      {
        name: 'interactive',
        type: 'boolean',
        description: 'Keep open while hovering the content.',
      },
    ],
    anatomy: [
      { part: 'trigger', description: 'Inline wrapper around the child.' },
      { part: 'positioner', description: 'Positions the floating content.' },
      { part: 'content', description: 'The floating label.' },
    ],
  },
};

// Auto-collect every component meta file. Dropping src/data/components/<key>.ts
// registers that component and flips it to "documented" in the catalog grid.
const fileMeta = Object.fromEntries(
  Object.entries(
    import.meta.glob<{ meta: ComponentMeta }>('./components/*.ts', {
      eager: true,
    }),
  ).map(([path, mod]) => [
    path.replace(/^\.\/components\//, '').replace(/\.ts$/, ''),
    mod.meta,
  ]),
);

export const componentMeta: Record<string, ComponentMeta> = {
  ...inlineMeta,
  ...fileMeta,
};

export interface CatalogEntry {
  name: string;
  /** Documentation slug key; documented entries link to /components/{key}. */
  key: string;
  summary: string;
  documented: boolean;
}

const DOCUMENTED = new Set(Object.keys(componentMeta));

function entry(name: string, key: string, summary: string): CatalogEntry {
  return { name, key, summary, documented: DOCUMENTED.has(key) };
}

/** The whole library, for the Components overview grid. */
export const componentCatalog: CatalogEntry[] = [
  entry('Accordion', 'accordion', 'Stacked, collapsible disclosure sections.'),
  entry('Alert', 'alert', 'Inline status message with tone and dismiss.'),
  entry('Avatar', 'avatar', 'User image with initials fallback.'),
  entry('Badge', 'badge', 'Compact status chip.'),
  entry('Button', 'button', 'The workhorse action, four variants.'),
  entry('Card', 'card', 'The signature pillowy surface.'),
  entry('Carousel', 'carousel', 'Swipeable slide track.'),
  entry('Checkbox', 'checkbox', 'Boolean choice with indeterminate.'),
  entry('Clipboard', 'clipboard', 'Copy-to-clipboard field.'),
  entry('Collapsible', 'collapsible', 'Single show/hide region.'),
  entry('ColorPicker', 'color-picker', 'Area + channel color selection.'),
  entry('Combobox', 'combobox', 'Autocomplete text + listbox.'),
  entry('ContextMenu', 'context-menu', 'Right-click menu surface.'),
  entry('DatePicker', 'date-picker', 'Calendar date selection.'),
  entry('Dialog', 'dialog', 'Modal frosted panel.'),
  entry('Drawer', 'drawer', 'Edge-anchored sliding panel.'),
  entry('Editable', 'editable', 'Click-to-edit inline text.'),
  entry('FileUpload', 'file-upload', 'Drag-and-drop file input.'),
  entry('FloatingPanel', 'floating-panel', 'Draggable floating surface.'),
  entry('HoverCard', 'hover-card', 'Rich preview on hover.'),
  entry('Listbox', 'listbox', 'Selectable option list.'),
  entry('Marquee', 'marquee', 'Continuous scrolling ticker.'),
  entry('Menu', 'menu', 'Dropdown command menu.'),
  entry('NavigationMenu', 'navigation-menu', 'Multi-column nav flyouts.'),
  entry('NumberInput', 'number-input', 'Stepper numeric field.'),
  entry('Pagination', 'pagination', 'Page navigation control.'),
  entry('PasswordInput', 'password-input', 'Password field with reveal toggle.'),
  entry('PinInput', 'pin-input', 'One-character-per-box code input.'),
  entry('Popover', 'popover', 'Floating panel anchored to a trigger.'),
  entry('Progress', 'progress', 'Determinate / indeterminate progress.'),
  entry('QrCode', 'qr-code', 'Rendered QR code.'),
  entry('RadioGroup', 'radio-group', 'Single choice among options.'),
  entry('RatingGroup', 'rating-group', 'Star rating input.'),
  entry('ScrollArea', 'scroll-area', 'Custom-scrollbar scrollable viewport.'),
  entry('SegmentedControl', 'segmented-control', 'Single-select sliding segments.'),
  entry('Select', 'select', 'Single / multi dropdown select.'),
  entry('SignaturePad', 'signature-pad', 'Draw-to-sign canvas.'),
  entry('Slider', 'slider', 'Single or range slider.'),
  entry('Spinner', 'spinner', 'Indeterminate loading indicator.'),
  entry('Splitter', 'splitter', 'Resizable split panes.'),
  entry('Steps', 'steps', 'Multi-step progress indicator.'),
  entry('Swipe', 'swipe', 'Swipe-to-act gesture surface.'),
  entry('Switch', 'switch', 'Smooth on/off toggle.'),
  entry('Tabs', 'tabs', 'Tabbed navigation.'),
  entry('TagsInput', 'tags-input', 'Token / chip text entry.'),
  entry('TextField', 'text-field', 'Labeled text input.'),
  entry('TimePicker', 'time-picker', 'Time selection control.'),
  entry('Timer', 'timer', 'Countdown / count-up timer.'),
  entry('Toast', 'toast', 'Transient notifications.'),
  entry('Toggle', 'toggle', 'Pressable two-state button.'),
  entry('ToggleGroup', 'toggle-group', 'Grouped toggles.'),
  entry('Tooltip', 'tooltip', 'Floating label on hover/focus.'),
  entry('Tour', 'tour', 'Guided product walkthrough.'),
  entry('TreeView', 'tree-view', 'Nested expandable tree.'),
];
