import { useCallback, useEffect, useState } from 'react';
import type { FocusEventHandler, PointerEventHandler } from 'react';

let keyboardModality = true;
let activeInstances = 0;

const markKeyboardModality = (event: KeyboardEvent) => {
  if (event.metaKey || event.altKey || event.ctrlKey) return;
  keyboardModality = true;
};

const markPointerModality = () => {
  keyboardModality = false;
};

const subscribeToModality = () => {
  if (typeof document === 'undefined') return () => {};

  if (activeInstances === 0) {
    document.addEventListener('keydown', markKeyboardModality, true);
    document.addEventListener('pointerdown', markPointerModality, true);
  }
  activeInstances += 1;

  return () => {
    activeInstances -= 1;
    if (activeInstances !== 0) return;

    document.removeEventListener('keydown', markKeyboardModality, true);
    document.removeEventListener('pointerdown', markPointerModality, true);
  };
};

export interface FocusVisibleProps<T extends HTMLElement> {
  'data-focus-visible': 'true' | 'false';
  onFocusCapture: FocusEventHandler<T>;
  onBlurCapture: FocusEventHandler<T>;
  onPointerDownCapture: PointerEventHandler<T>;
}

/**
 * Tracks whether the focus inside a visual owner came from the keyboard.
 * Browsers intentionally match `:focus-visible` for text inputs after a mouse
 * click, so input-like controls need this small modality bridge to keep their
 * outer ring keyboard-only while preserving the focused border.
 */
export function useFocusVisible<T extends HTMLElement>(): FocusVisibleProps<T> {
  const [focusVisible, setFocusVisible] = useState(false);

  useEffect(() => subscribeToModality(), []);

  const onFocusCapture = useCallback<FocusEventHandler<T>>(() => {
    setFocusVisible(keyboardModality);
  }, []);

  const onBlurCapture = useCallback<FocusEventHandler<T>>((event) => {
    const relatedTarget = event.relatedTarget;
    if (
      relatedTarget instanceof Node &&
      event.currentTarget.contains(relatedTarget)
    ) {
      return;
    }
    setFocusVisible(false);
  }, []);

  const onPointerDownCapture = useCallback<PointerEventHandler<T>>(() => {
    keyboardModality = false;
    setFocusVisible(false);
  }, []);

  return {
    'data-focus-visible': focusVisible ? 'true' : 'false',
    onFocusCapture,
    onBlurCapture,
    onPointerDownCapture,
  };
}
