import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'swipe',
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Content made swipeable.',
    },
    {
      name: 'axis',
      type: `'horizontal' | 'vertical' | 'both'`,
      default: `'both'`,
      description: 'Axis the gesture may travel along.',
    },
    {
      name: 'threshold',
      type: 'number',
      default: '48',
      description:
        'Distance in pixels the pointer must travel to recognize a swipe.',
    },
    {
      name: 'velocityThreshold',
      type: 'number',
      default: '0.5',
      description:
        'Flick velocity (px/ms) that recognizes a swipe regardless of distance.',
    },
    {
      name: 'followPointer',
      type: 'boolean',
      default: 'true',
      description:
        'Translate the content to follow the pointer, then spring back on release.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disable the gesture.',
    },
    {
      name: 'onSwipe',
      type: '(details: SwipeDetails) => void',
      description:
        'Fired when a drag is released past the distance or velocity threshold.',
    },
    {
      name: 'onSwipeStart',
      type: '() => void',
      description: 'Fired when a gesture begins.',
    },
    {
      name: 'onSwipeMove',
      type: '(offset: SwipeVector) => void',
      description:
        'Fired on every move with the current axis-constrained offset.',
    },
    {
      name: 'onSwipeEnd',
      type: '(details: { swiped: boolean }) => void',
      description:
        'Fired when a gesture ends; swiped is true when onSwipe fired.',
    },
  ],
  anatomy: [
    {
      part: 'root',
      description:
        'The swipeable wrapper; exposes data-axis, data-dragging, and data-disabled.',
    },
  ],
};
