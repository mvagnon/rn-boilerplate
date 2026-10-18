const { AndroidConfig, withAppBuildGradle, withGradleProperties } = require('expo/config-plugins');

/**
 * Enables R8 optimization, obfuscation and resource shrinking for Android release builds.
 * @type {import('expo/config-plugins').ConfigPlugin}
 */
module.exports = (config) => {
  config = withGradleProperties(config, (mod) => {
    for (const key of [
      'android.enableMinifyInReleaseBuilds',
      'android.enableShrinkResourcesInReleaseBuilds',
    ]) {
      mod.modResults = AndroidConfig.BuildProperties.updateAndroidBuildProperty(
        mod.modResults, key, 'true',
      );
    }
    return mod;
  });
  return withAppBuildGradle(config, (mod) => {
    mod.modResults.contents = mod.modResults.contents.replaceAll(
      '"proguard-android.txt"',
      '"proguard-android-optimize.txt"',
    );
    return mod;
  });
};
