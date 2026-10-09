import type { Meta, StoryObj } from '@storybook/react-native';

import { AnimatedBootSplash } from './animated-bootsplash';

const meta = {
  title: 'Components/AnimatedBootSplash',
  component: AnimatedBootSplash,
  args: { ready: false, onHidden: () => {} },
} satisfies Meta<typeof AnimatedBootSplash>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {};
export const Ready: Story = { args: { ready: true } };
