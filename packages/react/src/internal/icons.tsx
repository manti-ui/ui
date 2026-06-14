/** Internal icons shared by adapters. Not part of the public API. */
import type { SVGProps } from 'react';

/** A thin close (×) glyph that inherits `currentColor`. */
export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M4 4 12 12M12 4 4 12" />
    </svg>
  );
}
