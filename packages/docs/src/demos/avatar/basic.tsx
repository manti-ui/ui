import { Avatar } from '@manti-ui/react';

export default function AvatarBasic() {
  return (
    <div
      style={{
        display: 'flex',
        gap: 'var(--manti-space-4)',
        alignItems: 'center',
      }}
    >
      <Avatar src="https://i.pravatar.cc/120?img=12" alt="A person" size="sm">
        MU
      </Avatar>
      <Avatar src="https://i.pravatar.cc/120?img=12" alt="A person" size="md">
        MU
      </Avatar>
      <Avatar src="https://i.pravatar.cc/120?img=12" alt="A person" size="lg">
        MU
      </Avatar>
      <Avatar src="https://i.pravatar.cc/120?img=12" alt="A person" size="xl">
        MU
      </Avatar>
    </div>
  );
}
