import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import ProjectCard from './ProjectCard';

export default function MapViewContainer({
  filteredProjects = [],
}) {
  const router = useRouter();

  return (
    <ScrollView style={styles.webContainer} contentContainerStyle={styles.scrollContent}>
      {/* Notice Banner */}
      <View style={styles.noticeCard}>
        <View style={styles.iconCircle}>
          <Ionicons name="map-outline" size={32} color="#008751" />
        </View>
        <Text style={styles.noticeTitle}>Map is not available on Web</Text>
        <Text style={styles.noticeMessage}>
          The interactive map with custom pins is optimized for iOS and Android native devices.
          You can browse all projects in the list view below or switch to the main directory.
        </Text>
        <TouchableOpacity
          style={styles.actionBtn}
          activeOpacity={0.8}
          onPress={() => router.push('/list')}
        >
          <Ionicons name="list" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.actionBtnText}>Switch to List View</Text>
        </TouchableOpacity>
      </View>

      {/* Filtered Projects Section for Web */}
      <View style={styles.projectsHeader}>
        <Text style={styles.projectsHeaderTitle}>
          Filtered Projects ({filteredProjects.length})
        </Text>
      </View>

      {filteredProjects.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={40} color="#94A3B8" />
          <Text style={styles.emptyText}>No matching projects found.</Text>
        </View>
      ) : (
        filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} compact={true} fromRoute="/map" />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  noticeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
  },
  noticeTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  noticeMessage: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 18,
    maxWidth: 480,
  },
  actionBtn: {
    backgroundColor: '#008751',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#008751',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  projectsHeader: {
    marginBottom: 12,
  },
  projectsHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
    color: '#64748B',
  },
});
