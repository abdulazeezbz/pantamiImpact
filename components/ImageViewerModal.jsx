import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ZoomableImage from './ZoomableImage';
import { ALL_PROJECTS } from '../data/projects';
import { getProjectImageUrls, DEFAULT_PROJECT_BANNER } from '../utils/imageResolver';

export default function ImageViewerModal({
  visible,
  onClose,
  currentProjectId = null,
  initialIndex = 0,
  onNavigateToProject,
}) {
  const { width: windowWidth } = useWindowDimensions();
  const flatListRef = useRef(null);

  // Build global flat list of slides across ALL projects
  const allSlides = useMemo(() => {
    const slides = [];
    ALL_PROJECTS.forEach((p) => {
      const pImages = getProjectImageUrls(p.project_number || p.id);
      pImages.forEach((img, imgIdx) => {
        slides.push({
          key: `p_${p.id}_img_${imgIdx}`,
          projectId: p.id,
          projectNumber: p.project_number,
          projectTitle: p.title,
          image: img,
          imageIndexInProject: imgIdx,
          totalImagesInProject: pImages.length,
        });
      });
    });
    return slides;
  }, []);

  // Calculate starting index in global slides array
  const initialGlobalIndex = useMemo(() => {
    if (!currentProjectId || allSlides.length === 0) return 0;
    const foundIdx = allSlides.findIndex(
      (s) => String(s.projectId) === String(currentProjectId) && s.imageIndexInProject === initialIndex
    );
    return foundIdx !== -1 ? foundIdx : 0;
  }, [currentProjectId, initialIndex, allSlides]);

  const [globalIndex, setGlobalIndex] = useState(initialGlobalIndex);

  useEffect(() => {
    if (visible) {
      setGlobalIndex(initialGlobalIndex);
      setTimeout(() => {
        if (flatListRef.current && initialGlobalIndex > 0 && allSlides.length > initialGlobalIndex) {
          flatListRef.current.scrollToIndex({ index: initialGlobalIndex, animated: false });
        }
      }, 100);
    }
  }, [visible, initialGlobalIndex, allSlides]);

  if (!visible || allSlides.length === 0) {
    return null;
  }

  const activeSlide = allSlides[globalIndex] || allSlides[0];

  const handleScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / slideSize);
    if (index >= 0 && index < allSlides.length && index !== globalIndex) {
      setGlobalIndex(index);
    }
  };

  const handleViewDetails = () => {
    onClose();
    if (onNavigateToProject && activeSlide) {
      onNavigateToProject(activeSlide.projectId);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={styles.modalContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#0B132B" />

        {/* Top Header Bar */}
        <SafeAreaView style={styles.headerSafeArea}>
          <View style={styles.topBar}>
            <View style={styles.headerTitleCol}>
              <View style={styles.projectBadge}>
                <Text style={styles.projectBadgeText}>Project #{activeSlide.projectNumber}</Text>
              </View>
              <Text style={styles.headerTitle} numberOfLines={1}>
                {activeSlide.projectTitle}
              </Text>
            </View>

            {/* Counter Badge & Close Button */}
            <View style={styles.headerRightRow}>
              <View style={styles.counterBadge}>
                <Text style={styles.counterText}>
                  {activeSlide.imageIndexInProject + 1} / {activeSlide.totalImagesInProject}
                </Text>
              </View>

              <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Swipe Hint */}
          <View style={styles.hintBar}>
            <Ionicons name="swap-horizontal-outline" size={13} color="#34D399" />
            <Text style={styles.hintText}>
              Swipe continuously across all projects • Double-tap image to zoom (3x)
            </Text>
          </View>
        </SafeAreaView>

        {/* Continuous Multi-Project Swipeable Carousel */}
        <View style={styles.carouselWrapper}>
          <FlatList
            ref={flatListRef}
            data={allSlides}
            horizontal={true}
            pagingEnabled={true}
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            keyExtractor={(item) => item.key}
            getItemLayout={(_, index) => ({
              length: windowWidth,
              offset: windowWidth * index,
              index,
            })}
            renderItem={({ item }) => (
              <ZoomableImage source={item.image} fallbackSource={DEFAULT_PROJECT_BANNER} />
            )}
          />
        </View>

        {/* Bottom Floating Bar with "View Project Details" Button */}
        <SafeAreaView style={styles.footerSafeArea}>
          <View style={styles.footerBar}>
            <TouchableOpacity
              style={styles.viewDetailsBtn}
              activeOpacity={0.85}
              onPress={handleViewDetails}
            >
              <Ionicons name="information-circle-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.viewDetailsBtnText}>
                View Details for Project #{activeSlide.projectNumber}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#0B132B',
  },
  headerSafeArea: {
    backgroundColor: 'rgba(11, 19, 43, 0.95)',
    zIndex: 10,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerTitleCol: {
    flex: 1,
    marginRight: 12,
  },
  projectBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#008751',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
  },
  projectBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  headerRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  counterBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  counterText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '700',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  hintText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  carouselWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerSafeArea: {
    backgroundColor: 'rgba(11, 19, 43, 0.95)',
    zIndex: 10,
  },
  footerBar: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  viewDetailsBtn: {
    backgroundColor: '#008751',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    width: '100%',
    maxWidth: 360,
    shadowColor: '#008751',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  viewDetailsBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
