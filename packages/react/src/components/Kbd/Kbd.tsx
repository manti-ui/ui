import { forwardRef, useSyncExternalStore } from 'react';
import type { HTMLAttributes } from 'react';

import { cx } from '../../internal/props';

export type KbdSize = 'sm' | 'md';

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  /** Visual size of the key cap. */
  size?: KbdSize;
}

const subscribeToPlatform = () => () => {};
const getServerPlatform = () => false;

/** Detect Apple platforms without reading browser globals during SSR. */
function detectMacPlatform(): boolean {
  if (typeof navigator === 'undefined') return false;

  const platform =
    (navigator as Navigator & { userAgentData?: { platform?: string } })
      .userAgentData?.platform ||
    navigator.platform ||
    navigator.userAgent ||
    '';

  return /mac|iphone|ipad|ipod/i.test(platform);
}

function useIsMacPlatform(): boolean {
  return useSyncExternalStore(
    subscribeToPlatform,
    detectMacPlatform,
    getServerPlatform,
  );
}

function resolvePlatformShortcut(
  children: KbdProps['children'],
  isMac: boolean,
): KbdProps['children'] {
  if (isMac || typeof children !== 'string') return children;
  return children.replaceAll('⌘', 'Ctrl');
}

/** A semantic keyboard-input label styled as a compact key cap. */
export const Kbd = forwardRef<HTMLElement, KbdProps>(function Kbd(
  { size = 'sm', className, children, ...rest },
  ref,
) {
  const isMac = useIsMacPlatform();

  return (
    <kbd
      {...rest}
      ref={ref}
      data-scope="kbd"
      data-part="root"
      data-size={size}
      className={cx(className)}
    >
      {resolvePlatformShortcut(children, isMac)}
    </kbd>
  );
});
