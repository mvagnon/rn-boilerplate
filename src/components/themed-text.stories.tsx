import type { Meta, StoryObj } from '@storybook/react-native';

import { ThemedText } from './themed-text';

const meta = {
  title: 'Components/ThemedText',
  component: ThemedText,
  args: { children: 'Hello from React Native' },
  argTypes: {
    children: { control: 'text' },
    type: {
      control: 'select',
      options: ['default', 'title', 'small', 'smallBold', 'subtitle', 'link', 'linkPrimary', 'code'],
    },
    themeColor: {
      control: 'select',
      options: ['text', 'textSecondary'],
    },
  },
} satisfies Meta<typeof ThemedText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Title: Story = { args: { type: 'title' } };
export const Subtitle: Story = { args: { type: 'subtitle' } };
export const Code: Story = { args: { type: 'code' } };
