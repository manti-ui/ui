import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'calendar',
  props: [
    {
      name: 'tone',
      type: 'MantiTone',
      default: `'primary'`,
      description: 'Tone for the today chip and the selection highlight.',
    },
    {
      name: 'selectionMode',
      type: `'single' | 'multiple' | 'range'`,
      default: `'single'`,
      description: 'Single, multiple, or range selection.',
    },
    {
      name: 'value',
      type: 'string[]',
      description: 'Controlled value as ISO date strings (YYYY-MM-DD).',
    },
    {
      name: 'defaultValue',
      type: 'string[]',
      description: 'Initial value for uncontrolled usage.',
    },
    {
      name: 'onValueChange',
      type: '(value: string[]) => void',
      description: 'Called whenever the value changes; emits ISO date strings.',
    },
    {
      name: 'locale',
      type: 'string',
      description: 'BCP-47 locale for weekday labels, week start, and formatting.',
    },
    {
      name: 'startOfWeek',
      type: 'number',
      description: 'Day the week starts on: 0 (Sunday) – 6 (Saturday). Defaults to the locale.',
    },
    {
      name: 'fixedWeeks',
      type: 'boolean',
      default: 'true',
      description: 'Always render six week rows so the grid height stays constant.',
    },
    {
      name: 'min',
      type: 'string',
      description: 'Earliest selectable date (ISO YYYY-MM-DD); earlier days render disabled.',
    },
    {
      name: 'max',
      type: 'string',
      description: 'Latest selectable date (ISO YYYY-MM-DD); later days render disabled.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      description: 'Disable the whole calendar.',
    },
    {
      name: 'readOnly',
      type: 'boolean',
      description: 'Render the month but block selection (display-only).',
    },
    {
      name: 'name',
      type: 'string',
      description: 'Form field name for the hidden input.',
    },
    {
      name: 'renderDay',
      type: '(day: CalendarDayValue) => ReactNode',
      description: 'Render custom content (e.g. events) below the day number.',
    },
  ],
  anatomy: [
    { part: 'root', description: 'The calendar wrapper; carries data-tone.' },
    {
      part: 'heading',
      description: 'The month/year label between the prev/next buttons.',
    },
    {
      part: 'day-label',
      description: 'The day number in each cell; the today chip when data-today.',
    },
    {
      part: 'day-content',
      description: 'Per-day content slot below the number (renderDay output).',
    },
  ],
};
