import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { getPrimaryProjectImage } from '../utils/imageResolver';

export default function ProjectCard({ project, compact = false, fromRoute = '/list' }) {
  const router = useRouter();
  const { id, project_number, title, cost, status, tags, category } = project;
  const tagList = tags && tags.length ? tags : [category || 'Infrastructure'];
  const coverImage = getPrimaryProjectImage(project_number || id);

  const handlePress = () => {
    router.push({
      pathname: `/project/${id}`,
      params: { from: fromRoute },
    });
  };

  if (compact) {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handlePress}
        style={styles.simpleCompactContainer}
      >
        <Image
          source={typeof coverImage === 'number' ? coverImage : { uri: coverImage.uri }}
          style={styles.simpleCompactImage}
          resizeMode="cover"
        />
        <View style={styles.simpleCompactContent}>
          <View style={styles.simpleHeaderRow}>
            <View style={styles.simpleCategoryBadge}>
              <Text style={styles.simpleCategoryText} numberOfLines={1}>{category}</Text>
            </View>
            <Text style={styles.simpleStatusText} numberOfLines={1}>{status || 'Completed'}</Text>
          </View>
          <Text style={styles.simpleTitle} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.simpleCost} numberOfLines={1}>{cost}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={handlePress}
      style={styles.cardContainer}
    >
      <View style={styles.imageContainer}>
        <Image
          source={typeof coverImage === 'number' ? coverImage : { uri: coverImage.uri }}
          style={styles.bannerImage}
          resizeMode="cover"
        />
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{status || 'Completed'}</Text>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.titleText} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.costText}>{cost}</Text>

        <View style={styles.tagsRow}>
          {tagList.map((tag, index) => (
            <View key={index} style={styles.tagBadge}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Full Card Styling (Uniform #008751 Green)
  cardContainer: {
    backgroundColor: '#008751',
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    width: '100%',
  },
  imageContainer: {
    height: 135,
    width: '100%',
    position: 'relative',
    backgroundColor: '#042F2E',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#008751',
    fontWeight: '700',
    fontSize: 12,
  },
  contentContainer: {
    padding: 16,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    lineHeight: 22,
  },
  costText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E0F2FE',
    marginBottom: 12,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#008751',
  },

  // Simple Compact Card Styling (Width Constrained)
  simpleCompactContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    width: '100%',
    maxWidth: '100%',
    overflow: 'hidden',
  },
  simpleCompactImage: {
    width: 68,
    height: 68,
    borderRadius: 10,
    marginRight: 12,
  },
  simpleCompactContent: {
    flex: 1,
    width: 0,
    justifyContent: 'center',
  },
  simpleHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  simpleCategoryBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    maxWidth: '70%',
  },
  simpleCategoryText: {
    color: '#008751',
    fontWeight: '700',
    fontSize: 10,
  },
  simpleStatusText: {
    color: '#64748B',
    fontWeight: '600',
    fontSize: 10,
  },
  simpleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  simpleCost: {
    fontSize: 12,
    fontWeight: '700',
    color: '#008751',
  },
});
