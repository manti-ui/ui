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

/** An open-eye glyph (password is visible). Inherits `currentColor`. */
export function EyeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M1.5 8S3.9 3.5 8 3.5 14.5 8 14.5 8 12.1 12.5 8 12.5 1.5 8 1.5 8Z" />
      <circle cx="8" cy="8" r="2" />
    </svg>
  );
}

/** A struck-through eye glyph (password is hidden). Inherits `currentColor`. */
export function EyeOffIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M6.3 3.7A6.3 6.3 0 0 1 8 3.5C12.1 3.5 14.5 8 14.5 8a11 11 0 0 1-2 2.5M3.5 5.5A11 11 0 0 0 1.5 8S3.9 12.5 8 12.5c.7 0 1.3-.1 1.9-.3" />
      <path d="M6.6 6.6a2 2 0 0 0 2.8 2.8" />
      <path d="M2 2 14 14" />
    </svg>
  );
}

/** An upward arrow over a baseline — the universal Caps Lock glyph. */
export function CapsLockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M8 2.5 3 7.5h2.5v3h5v-3H13L8 2.5Z" />
      <path d="M5.5 13.5h5" />
    </svg>
  );
}
