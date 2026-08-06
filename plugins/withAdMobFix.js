const { withProjectBuildGradle } = require('@expo/config-plugins');

/**
 * Expo Config Plugin to bypass Kotlin metadata version incompatibility check
 * introduced in Google play-services-ads 25.x.
 */
module.exports = function withAdMobFix(config) {
  return withProjectBuildGradle(config, (config) => {
    if (!config.modResults.contents.includes('-Xskip-metadata-version-check')) {
      const skipMetadataCheckSnippet = `
  tasks.withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompile).configureEach {
    kotlinOptions {
      freeCompilerArgs += ["-Xskip-metadata-version-check"]
    }
  }`;

      if (config.modResults.contents.includes('allprojects {')) {
        config.modResults.contents = config.modResults.contents.replace(
          'allprojects {',
          `allprojects {${skipMetadataCheckSnippet}`
        );
      } else {
        config.modResults.contents += `\nallprojects {${skipMetadataCheckSnippet}\n}\n`;
      }
    }
    return config;
  });
};
