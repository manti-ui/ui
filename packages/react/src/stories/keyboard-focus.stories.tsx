import type { Story, StoryDefault } from '@ladle/react';

import { Clipboard } from '../components/Clipboard/Clipboard.js';
import { ColorPicker } from '../components/ColorPicker/ColorPicker.js';
import { Combobox } from '../components/Combobox/Combobox.js';
import { DatePicker } from '../components/DatePicker/DatePicker.js';
import { Editable } from '../components/Editable/Editable.js';
import { Heading } from '../components/Heading/Heading.js';
import { Input } from '../components/Input/Input.js';
import { NumberInput } from '../components/NumberInput/NumberInput.js';
import { PinInput } from '../components/PinInput/PinInput.js';
import { Select } from '../components/Select/Select.js';
import { TagsInput } from '../components/TagsInput/TagsInput.js';
import { Text } from '../components/Text/Text.js';
import { Textarea } from '../components/Textarea/Textarea.js';
import { TimePicker } from '../components/TimePicker/TimePicker.js';

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

export default {
  title: 'Accessibility/Keyboard focus',
  meta: { layout: 'padded' },
} satisfies StoryDefault;

/** Tab through every input-like component to review the focus order and rings. */
export const InputFamily: Story = () => (
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
      <Text size="sm" emphasis="muted">
        Press Tab to move through the family. Composite controls keep one focus
        ring on their primary surface; popup cells and direct triggers own their
        own ring.
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
);
