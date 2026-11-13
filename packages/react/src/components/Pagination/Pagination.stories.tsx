import type { Story, StoryDefault } from '@ladle/react';

import { Pagination } from './Pagination.js';
import type { PaginationProps } from './Pagination.js';

export default {
  title: 'Components/Pagination',
  args: {
    count: 200,
    pageSize: 20,
    defaultPage: 3,
    siblingCount: 1,
    size: 'md',
    variant: 'primary',
  },
  argTypes: {
    size: { control: { type: 'inline-radio' }, options: ['sm', 'md', 'lg'] },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary', 'danger', 'outline'],
    },
  },
  meta: { layout: 'centered' },
} satisfies StoryDefault<PaginationProps>;

export const Playground: Story<PaginationProps> = (args) => (
  <Pagination {...args} />
);

export const FewPages: Story<PaginationProps> = (args) => (
  <Pagination {...args} />
);
FewPages.args = { count: 60, pageSize: 20, defaultPage: 1 };

export const ManyPages: Story<PaginationProps> = (args) => (
  <Pagination {...args} />
);
ManyPages.args = {
  count: 1000,
  pageSize: 20,
  defaultPage: 12,
  siblingCount: 2,
};
