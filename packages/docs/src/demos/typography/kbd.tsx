import { Kbd } from '@manti-ui/react';

export default function KbdDemo() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--manti-space-4)',
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--manti-space-2)',
        }}
      >
        <Kbd>⌘</Kbd>
        <span>+</span>
        <Kbd>K</Kbd>
      </span>
      <Kbd size="md">Enter</Kbd>
    </div>
  );
}
