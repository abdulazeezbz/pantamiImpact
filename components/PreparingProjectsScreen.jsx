import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  Platform,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import { unzipSync } from 'fflate';
import { Ionicons } from '@expo/vector-icons';

const PANTAMI_LOGO = require('../assets/Pantami.jpg');
const ZIP_URL = 'https://abzdatasub.com.ng/pantami/projects_images.zip';
const ASYNC_KEY = '@pantami_images_downloaded_v1';

export default function PreparingProjectsScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Connecting to server...');
  const [errorMsg, setErrorMsg] = useState(null);

  const animatedValue = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Pulsing logo animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Start setup check
    startPreparation();
  }, []);

  const updateProgress = (val, text) => {
    setProgress(val);
    if (text) setStatusText(text);
    Animated.timing(animatedValue, {
      toValue: val,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const startPreparation = async () => {
    try {
      // On Web, skip download & unzip
      if (Platform.OS === 'web') {
        onComplete();
        return;
      }

      // Check if already completed
      const isDownloaded = await AsyncStorage.getItem(ASYNC_KEY);
      if (isDownloaded === 'true') {
        onComplete();
        return;
      }

      updateProgress(10, 'Connecting to Pantami Impact Asset Server...');

      const targetZipPath = `${FileSystem.cacheDirectory}projects_images.zip`;
      const targetExtractDir = `${FileSystem.documentDirectory}projects_images/`;

      // Create target directory if it doesn't exist
      const dirInfo = await FileSystem.getInfoAsync(targetExtractDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(targetExtractDir, { intermediates: true });
      }

      updateProgress(25, 'Downloading high-resolution project gallery zip...');

      // Download file with progress monitoring
      const downloadResumable = FileSystem.createDownloadResumable(
        ZIP_URL,
        targetZipPath,
        {},
        (downloadProgress) => {
          const ratio = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
          const currentPct = 25 + Math.round(ratio * 40); // 25% -> 65%
          updateProgress(currentPct, `Downloading assets... (${Math.round(ratio * 100)}%)`);
        }
      );

      let downloadResult;
      try {
        downloadResult = await downloadResumable.downloadAsync();
      } catch (dlErr) {
        console.warn('Remote download failed, checking offline bundled fallback:', dlErr);
      }

      updateProgress(70, 'Unpacking project images & gallery assets...');

      // Unzip using fflate
      const zipPath = downloadResult?.uri || targetZipPath;
      const fileInfo = await FileSystem.getInfoAsync(zipPath);

      if (fileInfo.exists) {
        // Read zip as base64 and decode with fflate
        const base64Data = await FileSystem.readAsStringAsync(zipPath, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Convert base64 string to Uint8Array
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        const unzippedFiles = unzipSync(bytes);
        updateProgress(88, 'Saving unpacked images to local storage...');

        // Write files to local storage
        for (const filename of Object.keys(unzippedFiles)) {
          if (!filename.endsWith('/')) {
            const cleanName = filename.split('/').pop();
            const fileData = unzippedFiles[filename];
            if (cleanName && fileData) {
              // Convert Uint8Array to base64
              let bin = '';
              for (let j = 0; j < fileData.length; j++) {
                bin += String.fromCharCode(fileData[j]);
              }
              const b64 = btoa(bin);

              await FileSystem.writeAsStringAsync(
                `${targetExtractDir}${cleanName}`,
                b64,
                { encoding: FileSystem.EncodingType.Base64 }
              );
            }
          }
        }
      }

      updateProgress(100, 'Almost done! Preparing your dashboard...');

      // Save complete flag
      await AsyncStorage.setItem(ASYNC_KEY, 'true');

      setTimeout(() => {
        onComplete();
      }, 500);
    } catch (err) {
      console.error('Preparation Error:', err);
      // In case of error, mark complete so app is usable
      await AsyncStorage.setItem(ASYNC_KEY, 'true').catch(() => {});
      updateProgress(100, 'Ready!');
      setTimeout(() => {
        onComplete();
      }, 600);
    }
  };

  const progressWidth = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      {/* Background Graphic */}
      <View style={styles.centerContent}>
        <Animated.View
          style={[
            styles.logoRing,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <Image source={PANTAMI_LOGO} style={styles.logoImage} resizeMode="cover" />
        </Animated.View>

        <Text style={styles.titleText}>Pantami Impact Tracker</Text>
        <Text style={styles.subTitleText}>Preparing infrastructure & ICT project assets</Text>

        {/* Progress Bar Container */}
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
        </View>

        <View style={styles.statusRow}>
          <Text style={styles.statusText}>{statusText}</Text>
          <Text style={styles.pctText}>{progress}%</Text>
        </View>

        <View style={styles.badgeBox}>
          <Ionicons name="sparkles-sharp" size={14} color="#008751" />
          <Text style={styles.badgeText}>First-time setup for offline gallery access</Text>
        </View>

        {errorMsg && (
          <TouchableOpacity
            style={styles.skipBtn}
            onPress={() => {
              AsyncStorage.setItem(ASYNC_KEY, 'true').catch(() => {});
              onComplete();
            }}
          >
            <Text style={styles.skipBtnText}>Skip Setup & Continue →</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#042F2E', // Dark Nigerian Green Accent
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  centerContent: {
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
  },
  logoRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3.5,
    borderColor: '#008751',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#008751',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  logoImage: {
    width: 98,
    height: 98,
    borderRadius: 49,
  },
  titleText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
    textAlign: 'center',
  },
  subTitleText: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 32,
  },
  progressTrack: {
    width: '100%',
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#008751',
    borderRadius: 5,
  },
  statusRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  statusText: {
    fontSize: 12,
    color: '#CBD5E1',
    fontWeight: '600',
    flex: 1,
  },
  pctText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#34D399',
    marginLeft: 8,
  },
  badgeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 135, 81, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 135, 81, 0.4)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6EE7B7',
  },
  skipBtn: {
    marginTop: 24,
    backgroundColor: '#008751',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  skipBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
