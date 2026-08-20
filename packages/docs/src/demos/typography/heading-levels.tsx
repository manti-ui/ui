import { Heading } from '@manti-ui/react';

const levels = [1, 2, 3, 4, 5, 6] as const;

export default function HeadingLevelsDemo() {
  return (
    <div className="heading-list">
      {levels.map((level) => (
        <Heading key={level} level={level}>
          Level {level} heading
        </Heading>
      ))}
    </div>
  );
}
