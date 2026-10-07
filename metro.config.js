const { getDefaultConfig } = require('expo/metro-config');
const { withStorybook } = require('@storybook/react-native/withStorybook');

module.exports = withStorybook(getDefaultConfig(__dirname));
