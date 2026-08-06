/**
 * Google AdMob Android Configuration
 */
export const ADMOB_CONFIG = {
  // Your Production AdMob App ID (admob.google.com -> App Settings)
  APP_ID_ANDROID: 'ca-app-pub-4816714934569245~7254666844',

  // Your Production Banner Ad Unit ID (admob.google.com -> Ad units)
  BANNER_ID_ANDROID: 'ca-app-pub-4816714934569245/5750013483',
};

/**
 * Returns the Banner Ad Unit ID for Android.
 */
export function getBannerAdUnitId() {
  return ADMOB_CONFIG.BANNER_ID_ANDROID;
}
