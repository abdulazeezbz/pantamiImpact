import { Platform } from 'react-native';

/**
 * Google AdMob Central Configuration
 * Toggle `USE_TEST_ADS` to false and replace production IDs when publishing to Play Store / App Store.
 */
export const ADMOB_CONFIG = {
  // Set to `false` when using real production AdMob IDs
  USE_TEST_ADS: true,

  // Your Production AdMob App IDs (admob.google.com -> App Settings)
  PROD_APP_ID_ANDROID: 'ca-app-pub-4816714934569245~7254666844',
  PROD_APP_ID_IOS: 'ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX',

  // Your Production Banner Ad Unit IDs (admob.google.com -> Ad units)
  PROD_BANNER_ID_ANDROID: 'ca-app-pub-4816714934569245/5750013483',
  PROD_BANNER_ID_IOS: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',

  // Google Official Test IDs (Do not change)
  TEST_APP_ID_ANDROID: 'ca-app-pub-3940256099942544~3347511713',
  TEST_APP_ID_IOS: 'ca-app-pub-3940256099942544~1458002511',
  TEST_BANNER_ID_ANDROID: 'ca-app-pub-3940256099942544/6300978111',
  TEST_BANNER_ID_IOS: 'ca-app-pub-3940256099942544/2934735716',
};

/**
 * Returns the appropriate Banner Ad Unit ID based on platform and configuration.
 */
export function getBannerAdUnitId() {
  if (ADMOB_CONFIG.USE_TEST_ADS) {
    return Platform.OS === 'ios'
      ? ADMOB_CONFIG.TEST_BANNER_ID_IOS
      : ADMOB_CONFIG.TEST_BANNER_ID_ANDROID;
  }

  return Platform.OS === 'ios'
    ? ADMOB_CONFIG.PROD_BANNER_ID_IOS
    : ADMOB_CONFIG.PROD_BANNER_ID_ANDROID;
}
