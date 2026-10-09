const { withBootSplash } = require('react-native-bootsplash/expo');
const { AndroidConfig, withAndroidColorsNight, withDangerousMod } = require('expo/config-plugins');
const fs = require('node:fs/promises');
const path = require('node:path');
const Colors = require('../src/constants/colors.json');

/**
 * Keeps the generated native splash and JS overlay in sync with the app's theme.
 * @param {import('expo/config-plugins').ExportedConfigWithProps} config
 */
async function writeAppearance(config) {
  const { projectRoot, platformProjectRoot, projectName, platform } = config.modRequest;
  const manifestPath = path.join(projectRoot, 'assets/bootsplash/manifest.json');
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  await fs.writeFile(manifestPath, `${JSON.stringify({
    ...manifest,
    darkBackground: Colors.dark.background,
  }, null, 2)}\n`);

  if (platform === 'ios') {
    const colors = path.join(platformProjectRoot, projectName, 'Colors.xcassets');
    const backgroundName = (await fs.readdir(colors)).find((name) =>
      name.startsWith('BootSplashBackground-'),
    );
    if (!backgroundName) throw new Error('Missing native BootSplash background');
    const colorPath = path.join(colors, backgroundName, 'Contents.json');
    const colorSet = JSON.parse(await fs.readFile(colorPath, 'utf8'));
    const [red, green, blue] = Colors.dark.background.slice(1).match(/.{2}/g)
      .map((hex) => (parseInt(hex, 16) / 255).toFixed(14));
    colorSet.colors.push({
      idiom: 'universal',
      appearances: [{ appearance: 'luminosity', value: 'dark' }],
      color: {
        'color-space': 'srgb',
        components: { red, green, blue, alpha: '1.000' },
      },
    });
    await fs.writeFile(colorPath, `${JSON.stringify(colorSet, null, 2)}\n`);
  }
  return config;
}

/**
 * Extends the official Expo plugin with device-themed backgrounds, without a web HTML template.
 * @type {typeof withBootSplash}
 */
module.exports = (config, options) => {
  const platforms = config.platforms;
  for (const platform of ['ios', 'android']) {
    config = withDangerousMod(config, [platform, writeAppearance]);
  }
  config = withAndroidColorsNight(config, (mod) => {
    mod.modResults = AndroidConfig.Colors.assignColorValue(mod.modResults, {
      name: 'bootsplash_background',
      value: Colors.dark.background,
    });
    return mod;
  });
  return {
    ...withBootSplash(
      { ...config, platforms: ['android', 'ios'] },
      { ...options, background: Colors.light.background },
    ),
    platforms,
  };
};
