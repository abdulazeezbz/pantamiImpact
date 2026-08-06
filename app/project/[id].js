import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  BackHandler,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ALL_PROJECTS } from '../../data/projects';

const DEFAULT_BANNER = require('../../assets/project_banner.png');

export default function ProjectDetailScreen() {
  const { id, from } = useLocalSearchParams();
  const router = useRouter();

  const project = ALL_PROJECTS.find((p) => String(p.id) === String(id)) || ALL_PROJECTS[0];

  const handleBackPress = () => {
    if (from === '/list' || from === '/map' || from === '/index') {
      router.navigate(from);
      return true;
    }
    if (router.canGoBack()) {
      router.back();
      return true;
    }
    router.navigate('/list');
    return true;
  };

  // Listen for physical phone hardware back button on Android
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => subscription.remove();
  }, [from]);

  const handleLocateOnMap = () => {
    router.push({
      pathname: '/map',
      params: { selectedId: String(project.id) },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Header Bar showing Project #Number and Back Action */}
      <View style={styles.topHeaderBar}>
        <TouchableOpacity
          onPress={handleBackPress}
          activeOpacity={0.7}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.topHeaderTitle}>Project #{project.project_number}</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Banner Image */}
        <View style={styles.imageContainer}>
          <Image
            source={DEFAULT_BANNER}
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>{project.status}</Text>
          </View>
        </View>

        {/* Details Card */}
        <View style={styles.card}>
          <View style={styles.categoryHeaderRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{project.category}</Text>
            </View>
            <Text style={styles.projectNumberBadge}>Item #{project.project_number} of {ALL_PROJECTS.length}</Text>
          </View>

          <Text style={styles.title}>{project.title}</Text>
          <Text style={styles.costText}>{project.cost}</Text>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview & Impact</Text>
            <Text style={styles.descriptionText}>{project.description}</Text>
          </View>

          {/* Location */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location-sharp" size={20} color="#008751" />
              <Text style={styles.locationText}>{project.location}</Text>
            </View>
          </View>

          {/* Metadata Grid */}
          <View style={styles.metadataGrid}>
            <View style={styles.metaBox}>
              <Text style={styles.metaLabel}>Parastatal / Agency</Text>
              <Text style={styles.metaValue}>{project.parastatal}</Text>
            </View>

            <View style={styles.metaBox}>
              <Text style={styles.metaLabel}>Execution Year</Text>
              <Text style={styles.metaValue}>{project.year}</Text>
            </View>
          </View>

          {/* Notes if available */}
          {project.notes && (
            <View style={styles.notesBox}>
              <Ionicons name="information-circle-outline" size={18} color="#0284C7" />
              <Text style={styles.notesText}>{project.notes}</Text>
            </View>
          )}

          {/* Primary Action: Locate on Map */}
          <TouchableOpacity
            style={styles.mapButton}
            activeOpacity={0.85}
            onPress={handleLocateOnMap}
          >
            <Ionicons name="map" size={22} color="#FFFFFF" />
            <Text style={styles.mapButtonText}>Locate on Map</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topHeaderBar: {
    backgroundColor: '#008751',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  backButton: {
    padding: 4,
  },
  topHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  imageContainer: {
    height: 180,
    width: '100%',
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  statusBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  statusBadgeText: {
    color: '#008751',
    fontWeight: '700',
    fontSize: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  categoryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    color: '#008751',
    fontWeight: '700',
    fontSize: 12,
  },
  projectNumberBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 28,
    marginBottom: 8,
  },
  costText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#008751',
    marginBottom: 20,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 15,
    color: '#334155',
    lineHeight: 24,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F1F5F9',
    padding: 12,
    borderRadius: 12,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    flex: 1,
  },
  metadataGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  metaBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  metaLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  notesBox: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#F0F9FF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  notesText: {
    fontSize: 13,
    color: '#0369A1',
    flex: 1,
    lineHeight: 18,
  },
  mapButton: {
    backgroundColor: '#008751',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 30,
    marginTop: 8,
    shadowColor: '#008751',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  mapButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
