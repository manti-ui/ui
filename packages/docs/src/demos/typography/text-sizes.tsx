import { Text } from '@manti-ui/react';

const sizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl'] as const;

export default function TextSizesDemo() {
  return (
    <div className="text-list">
      {sizes.map((size) => (
        <Text key={size} size={size}>
          {size} — the quick brown fox
        </Text>
      ))}
    </div>
  );
}
