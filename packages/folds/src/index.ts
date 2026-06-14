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

export const mantiBehaviorContract = {
  packageName: '@manti-ui/folds',
  engine: 'Zag.js',
  status: 'design-system',
} as const;

export type MantiBehaviorContract = typeof mantiBehaviorContract;
