import type { Meta, StoryObj } from '@storybook/react-vite';

import { Clipboard } from '../components/Clipboard/Clipboard';
import { ColorPicker } from '../components/ColorPicker/ColorPicker';
import { Combobox } from '../components/Combobox/Combobox';
import { DatePicker } from '../components/DatePicker/DatePicker';
import { Editable } from '../components/Editable/Editable';
import { Heading } from '../components/Heading/Heading';
import { Input } from '../components/Input/Input';
import { NumberInput } from '../components/NumberInput/NumberInput';
import { PinInput } from '../components/PinInput/PinInput';
import { Select } from '../components/Select/Select';
import { TagsInput } from '../components/TagsInput/TagsInput';
import { Text } from '../components/Text/Text';
import { Textarea } from '../components/Textarea/Textarea';
import { TimePicker } from '../components/TimePicker/TimePicker';

const regions = [
  { value: 'kayseri', label: 'Kayseri' },
  { value: 'bukhara', label: 'Bukhara' },
  { value: 'kashgar', label: 'Kashgar' },
];

const spices = [
  { value: 'sumac', label: 'Sumac' },
  { value: 'paprika', label: 'Paprika' },
  { value: 'cumin', label: 'Cumin' },
];

const meta = {
  title: 'Accessibility/Keyboard focus',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Press Tab to move through the family. Composite controls keep one focus ring on their primary surface; popup cells and direct triggers own their own ring.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Tab through every input-like component to review the focus order and rings. */
export const InputFamily: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gap: 'var(--manti-space-6)',
        maxWidth: 'calc(var(--manti-space-16) * 8)',
      }}
    >
      <div>
        <Heading level={1} size="2xl">
          Keyboard focus rings
        </Heading>
        <Text size="sm" emphasis="muted">
          Use Tab and Shift+Tab to inspect the focus order in both themes.
        </Text>
      </div>

      <div
        style={{
          display: 'grid',
          gap: 'var(--manti-space-4)',
        }}
      >
        <Input label="Input" placeholder="Recipe name" />
        <Textarea label="Textarea" placeholder="Preparation notes" rows={2} />
        <Select label="Select" items={regions} placeholder="Choose a region" />
        <Combobox label="Combobox" items={spices} placeholder="Search spices" />
        <NumberInput label="Number input" defaultValue="2" min={0} max={9} />
        <PinInput label="Pin input" length={4} />
        <TagsInput
          label="Tags input"
          defaultValue={['lamb', 'onion']}
          placeholder="Add a tag"
        />
        <Editable label="Editable" defaultValue="Recipe name" />
        <DatePicker label="Date picker" defaultValue={['2026-08-20']} />
        <TimePicker label="Time picker" defaultValue="12:30" />
        <ColorPicker label="Color picker" defaultValue="#7c3aed" />
        <Clipboard label="Clipboard" value="pnpm add @manti-ui/react" />
      </div>
    </div>
  ),
};
