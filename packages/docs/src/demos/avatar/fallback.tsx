import { Avatar } from '@manti-ui/react';

export default function AvatarFallback() {
  return (
    <div
      style={{
        display: 'flex',
        gap: 'var(--manti-space-4)',
        alignItems: 'center',
      }}
    >
      <Avatar shape="circle">MU</Avatar>
      <Avatar shape="square">AY</Avatar>
    </div>
  );
}
