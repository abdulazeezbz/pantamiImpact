import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import imageMap from '../data/project_images_map.json';

const REMOTE_IMAGE_BASE = 'https://abzdatasub.com.ng/pantami/images';
const LOCAL_PROJECT_DIR = FileSystem.documentDirectory ? `${FileSystem.documentDirectory}projects_images/` : null;

// Fallback banner
export const DEFAULT_PROJECT_BANNER = require('../assets/project_banner.png');

/**
 * Returns an array of image URIs for a given project_number.
 * @param {number|string} projectNumber 
 * @returns {Array<{uri: string}|number>} Array of image sources suitable for React Native <Image source={...} />
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

    // On Native mobile: check if unzipped local file exists
    const localUri = `${LOCAL_PROJECT_DIR}${filename}`;
    // Return local file URI or fallback to remote web URL
    return { uri: localUri };
  });
}

/**
 * Returns the primary (cover) image source for a given project_number.
 * @param {number|string} projectNumber 
 * @returns {{uri: string}|number} Image source object or require reference
 */
export function getPrimaryProjectImage(projectNumber) {
  const urls = getProjectImageUrls(projectNumber);
  return urls[0] || DEFAULT_PROJECT_BANNER;
}
