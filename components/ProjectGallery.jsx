import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ImageViewerModal from './ImageViewerModal';

export default function ProjectGallery({
  images = [],
  projectId = null,
  onNavigateToProject,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const openViewer = (index) => {
    setSelectedIdx(index);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* Gallery Header Bar */}
      <View style={styles.headerRow}>
        <View style={styles.titleWithIcon}>
          <Ionicons name="images" size={18} color="#008751" />
          <Text style={styles.sectionTitle}>Project Photo Gallery</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countBadgeText}>
            {images.length} {images.length === 1 ? 'Photo' : 'Photos'}
          </Text>
        </View>
      </View>

      {/* Clean Thumbnail Slider / Grid */}
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.thumbnailScroll}
      >
        {images.map((img, idx) => (
          <TouchableOpacity
            key={`thumb_${idx}`}
            activeOpacity={0.85}
            style={styles.thumbWrapper}
            onPress={() => openViewer(idx)}
          >
            <Image
              source={typeof img === 'number' ? img : { uri: img.uri }}
              style={styles.thumbImage}
              resizeMode="cover"
            />
            <View style={styles.expandOverlay}>
              <Ionicons name="expand" size={14} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Full-Screen Image Viewer Modal */}
      <ImageViewerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        currentProjectId={projectId}
        initialIndex={selectedIdx}
        onNavigateToProject={onNavigateToProject}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  countBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#008751',
  },
  thumbnailScroll: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 2,
  },
  thumbWrapper: {
    width: 84,
    height: 84,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F1F5F9',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  expandOverlay: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
