const { withProjectBuildGradle } = require('@expo/config-plugins');

/**
 * Expo Config Plugin to force play-services-ads version to 23.6.0.
 * This fixes the Kotlin compiler 2.3.0 metadata incompatibility bug in play-services-ads 25.4.0.
 */
module.exports = function withAdMobFix(config) {
  return withProjectBuildGradle(config, (config) => {
    if (!config.modResults.contents.includes('play-services-ads:23.6.0')) {
      config.modResults.contents += `
allprojects {
    configurations.all {
        resolutionStrategy {
            force 'com.google.android.gms:play-services-ads:23.6.0'
        }
    }
}
`;
    }
    return config;
  });
};
