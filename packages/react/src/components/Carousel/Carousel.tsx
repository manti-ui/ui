import { useId } from 'react';
import type { ReactNode } from 'react';
import { carousel } from '@manti-ui/folds';
import { normalizeProps, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props';

export interface CarouselProps {
  /** Slides to render. */
  slides: ReactNode[];
  /** Slides visible per page. */
  slidesPerPage?: number;
  /** Layout direction. */
  orientation?: 'horizontal' | 'vertical';
  /** Wrap from last to first. */
  loop?: boolean;
  /** Controlled active page. */
  page?: number;
  /** Initial active page for uncontrolled usage. */
  defaultPage?: number;
  /** Called whenever the active page changes. */
  onPageChange?: (page: number) => void;
  id?: string;
  className?: string;
}

const arrow = (d: string) => (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
    <path
      d={d}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** A slide carousel backed by the Zag.js carousel machine. */
export function Carousel({
  slides,
  slidesPerPage = 1,
  orientation = 'horizontal',
  loop,
  page,
  defaultPage,
  onPageChange,
  id,
  className,
}: CarouselProps) {
  const autoId = useId();
  const service = useMachine(carousel.machine, {
    id: id ?? autoId,
    slideCount: slides.length,
    slidesPerPage,
    orientation,
    loop,
    page,
    defaultPage,
    onPageChange: onPageChange
      ? (details) => onPageChange(details.page)
      : undefined,
  });
  const api = carousel.connect(service, normalizeProps);

  return (
    <div {...api.getRootProps()} className={cx(className)}>
      <div {...api.getItemGroupProps()}>
        {slides.map((slide, index) => (
          <div key={index} {...api.getItemProps({ index })}>
            {slide}
          </div>
        ))}
      </div>
      <div {...api.getControlProps()}>
        <button {...api.getPrevTriggerProps()} aria-label="Previous slide">
          {arrow('M11 4 6 9l5 5')}
        </button>
        <div {...api.getIndicatorGroupProps()}>
          {api.pageSnapPoints.map((_, index) => (
            <button key={index} {...api.getIndicatorProps({ index })} />
          ))}
        </div>
        <button {...api.getNextTriggerProps()} aria-label="Next slide">
          {arrow('M7 4l5 5-5 5')}
        </button>
      </div>
    </div>
  );
}
