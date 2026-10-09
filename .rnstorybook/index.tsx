import { registerRootComponent } from 'expo';
import { View } from 'react-native';
import BootSplash from 'react-native-bootsplash';

import { view } from './storybook.requires';

const StorybookUI = view.getStorybookUI();

function StorybookRoot() {
  return (
    <View style={{ flex: 1 }} onLayout={() => void BootSplash.hide({ fade: true })}>
      <StorybookUI />
    </View>
  );
}

registerRootComponent(StorybookRoot);
