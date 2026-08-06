import React, { useState } from 'react';
import { StyleSheet, View, Platform, Text } from 'react-native';
import { ADMOB_CONFIG, getBannerAdUnitId } from '../config/admob';

let BannerAd, BannerAdSize, TestIds;
if (Platform.OS !== 'web') {
  try {
    const mobileAds = require('react-native-google-mobile-ads');
    BannerAd = mobileAds.BannerAd;
    BannerAdSize = mobileAds.BannerAdSize;
    TestIds = mobileAds.TestIds;
  } catch (e) {
    console.warn('AdMob SDK unavailable on this platform/build:', e);
  }
}

export default function AdBanner({ style }) {
  const [adFailed, setAdFailed] = useState(false);

  // On Web, render a subtle non-intrusive container or hide
  if (Platform.OS === 'web') {
    return null;
  }

  // If Mobile Ads SDK is not present or ad failed to load, collapse gracefully
  if (!BannerAd || adFailed) {
    return null;
  }

  const adUnitId = ADMOB_CONFIG.USE_TEST_ADS
    ? (Platform.OS === 'ios' ? TestIds?.BANNER : TestIds?.BANNER) || getBannerAdUnitId()
    : getBannerAdUnitId();

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
