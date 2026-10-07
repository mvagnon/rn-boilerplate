import type { Preview } from '@storybook/react-native';

import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemedView style={{ flex: 1, padding: Spacing.three }}>
        <Story />
      </ThemedView>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
