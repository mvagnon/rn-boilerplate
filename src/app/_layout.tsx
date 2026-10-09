import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { useCallback, useState } from 'react';
import { Platform, useColorScheme, View } from 'react-native';

import { AnimatedBootSplash } from '@/components/animated-bootsplash';
import AppTabs from '@/components/app-tabs';
import { Colors } from '@/constants/theme';
import { StartupReadyContext } from '@/hooks/use-startup-ready';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(Platform.OS !== 'web');
  const onReady = useCallback(() => setReady(true), []);
  const onHidden = useCallback(() => setVisible(false), []);
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StartupReadyContext value={onReady}>
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          <AppTabs />
          {visible && <AnimatedBootSplash ready={ready} onHidden={onHidden} />}
        </View>
      </StartupReadyContext>
    </ThemeProvider>
  );
}
