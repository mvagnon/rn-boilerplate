import type { Meta, StoryObj } from '@storybook/react-native';

import { HintRow } from './hint-row';

const meta = {
  title: 'Components/HintRow',
  component: HintRow,
  argTypes: {
    title: { control: 'text' },
    hint: { control: 'text' },
  },
} satisfies Meta<typeof HintRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Custom: Story = { args: { title: 'Start Storybook', hint: 'bun run storybook' } };
