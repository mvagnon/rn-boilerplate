import { Text } from 'react-native';
import BootSplash from 'react-native-bootsplash';
import { SafeAreaView } from 'react-native-safe-area-context';

import Colors from '@/constants/colors.json';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      onLayout={() => void BootSplash.hide({ fade: true })}>
      <Text role="heading" style={{ color: colors.text }}>
        React Native Boilerplate
      </Text>
    </SafeAreaView>
  );
}
