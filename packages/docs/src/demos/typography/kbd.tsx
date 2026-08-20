import { Kbd } from '@manti-ui/react';

export default function KbdDemo() {
  return (
    <div className="kbd-list">
      <span className="kbd-item">
        <Kbd>⌘</Kbd>
        <span>+</span>
        <Kbd>K</Kbd>
      </span>
      <Kbd size="md">Enter</Kbd>
    </div>
  );
}
