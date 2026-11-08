import type { Story, StoryDefault } from '@ladle/react';

import { QrCode } from './QrCode';
import type { QrCodeProps } from './QrCode';

export default {
  title: 'Components/QrCode',
  args: {
    value: 'https://manti.design',
    size: 160,
  },
  meta: { layout: 'centered' },
} satisfies StoryDefault<QrCodeProps>;

export const Playground: Story<QrCodeProps> = (args) => <QrCode {...args} />;

export const Large: Story<QrCodeProps> = (args) => <QrCode {...args} />;
Large.args = { size: 240, value: 'One dough, countless fillings.' };
