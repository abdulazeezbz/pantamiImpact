import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import imageMap from '../data/project_images_map.json';

const REMOTE_IMAGE_BASE = 'https://abzdatasub.com.ng/pantami';
export const DEFAULT_PROJECT_BANNER = require('../assets/project_banner.png');

const CACHE_DIR = FileSystem.cacheDirectory ? `${FileSystem.cacheDirectory}pantami_images/` : null;
const cachedFilesSet = new Set();

// Initialize cache directory & existing files index on Native mobile
if (Platform.OS !== 'web' && CACHE_DIR) {
  FileSystem.getInfoAsync(CACHE_DIR)
    .then(async ({ exists }) => {
      if (!exists) {
        await FileSystem.makeDirectoryAsync(CACHE_DIR, { intermediates: true }).catch(() => {});
      } else {
        const files = await FileSystem.readDirectoryAsync(CACHE_DIR).catch(() => []);
        files.forEach((f) => cachedFilesSet.add(f));
      }
    })
    .catch(() => {});
}

/**
 * Background cache helper: downloads remote image to local device storage for offline viewing.
 */
export async function cacheImageLocally(filename) {
  if (Platform.OS === 'web' || !CACHE_DIR || cachedFilesSet.has(filename)) return;

  try {
    const localUri = `${CACHE_DIR}${filename}`;
    const remoteUrl = `${REMOTE_IMAGE_BASE}/${filename}`;
    const downloadRes = await FileSystem.downloadAsync(remoteUrl, localUri);
    if (downloadRes && downloadRes.status === 200) {
      cachedFilesSet.add(filename);
    }
  } catch (err) {
    // Fail gracefully if offline; will retry next time
  }
}

/**
 * Returns an array of image URIs for a given project_number.
 * @param {number|string} projectNumber 
 * @returns {Array<{uri: string}|number>} Array of image sources for <Image source={...} />
 */
export function getProjectImageUrls(projectNumber) {
  const numStr = String(projectNumber);
  const filenames = imageMap[numStr];

  if (!filenames || filenames.length === 0) {
    return [DEFAULT_PROJECT_BANNER];
  }

  return filenames.map((filename) => {
    if (Platform.OS === 'web') {
      return { uri: `${REMOTE_IMAGE_BASE}/${filename}` };
    }

    // On Native mobile: if already cached locally, use local file URI immediately (offline ready!)
    if (CACHE_DIR && cachedFilesSet.has(filename)) {
      return { uri: `${CACHE_DIR}${filename}` };
    }

    // Trigger background download to local storage for offline use
    cacheImageLocally(filename);

    // Return remote URL for instant display
    return { uri: `${REMOTE_IMAGE_BASE}/${filename}` };
  });
}

/**
 * Returns the primary (cover) image source for a given project_number.
 * @param {number|string} projectNumber 
 * @returns {{uri: string}|number}
 */
export function getPrimaryProjectImage(projectNumber) {
  const urls = getProjectImageUrls(projectNumber);
  return urls[0] || DEFAULT_PROJECT_BANNER;
}
