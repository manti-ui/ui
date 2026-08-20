import { Accordion } from '@manti-ui/react';

const items = [
  {
    value: 'shape',
    title: 'How small should they be?',
    content: 'Traditionally tiny — a good cook fits many on a single spoon.',
  },
  {
    value: 'serve',
    title: 'What goes on top?',
    content: 'Garlic yogurt, melted chili butter, dried mint, and sumac.',
  },
  {
    value: 'freeze',
    title: 'Can I freeze them?',
    content: 'Yes — freeze raw on a tray, then bag once solid.',
  },
];

export default function AccordionBasic() {
  return (
    <div className="accordion">
      <Accordion items={items} defaultValue={['shape']} />
    </div>
  );
}
