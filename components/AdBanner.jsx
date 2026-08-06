import React, { useState } from 'react';
import { StyleSheet, View, Platform, NativeModules } from 'react-native';
import { getBannerAdUnitId } from '../config/admob';

let BannerAd, BannerAdSize;
if (Platform.OS === 'android' && NativeModules.RNGoogleMobileAdsModule) {
  try {
    const mobileAds = require('react-native-google-mobile-ads');
    BannerAd = mobileAds.BannerAd;
    BannerAdSize = mobileAds.BannerAdSize;
  } catch (e) {
    // Safe fallback
  }
}

export default function AdBanner({ style }) {
  const [adFailed, setAdFailed] = useState(false);

  // Only render on Android platform
  if (Platform.OS !== 'android') {
    return null;
  }

  // If Mobile Ads SDK is not present or ad failed to load, collapse gracefully
  if (!BannerAd || adFailed) {
    return null;
  }

  const adUnitId = getBannerAdUnitId();

  return (
    <View style={[styles.adContainer, style]}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdFailedToLoad={(error) => {
          console.log('AdMob Banner load error:', error);
          setAdFailed(true);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  adContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 8,
    backgroundColor: 'transparent',
  },
});
