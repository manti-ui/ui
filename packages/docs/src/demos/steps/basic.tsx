import { Steps } from '@manti-ui/react';

const items = [
  { title: 'Dough', description: 'Knead & rest', content: 'Make the dough.' },
  { title: 'Fill', description: 'Spoon & fold', content: 'Fill the wrappers.' },
  { title: 'Steam', description: 'Cook through', content: 'Steam until done.' },
];

export default function StepsBasic() {
  return (
    <div style={{ width: '100%' }}>
      <Steps items={items} tone="primary" orientation="horizontal" />
    </div>
  );
}
