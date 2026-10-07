import { registerRootComponent } from 'expo';

import { view } from './storybook.requires';

const StorybookUI = view.getStorybookUI();

registerRootComponent(StorybookUI);
