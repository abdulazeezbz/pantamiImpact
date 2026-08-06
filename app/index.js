import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ALL_PROJECTS, SUMMARY_STATS } from '../data/projects';
import ProjectCard from '../components/ProjectCard';
import AdBanner from '../components/AdBanner';

export default function DashboardScreen() {
  const router = useRouter();
  const recommendedProjects = ALL_PROJECTS.slice(0, 5);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Summary Banner */}
        <View style={styles.statsBannerContainer}>
          <View style={styles.statsRow}>
            {/* Stat Card 1 */}
            <View style={styles.statCard}>
              <View style={styles.statIconRow}>
                <Ionicons name="folder-open" size={18} color="#A7F3D0" />
                <Text style={styles.statNumber}>{SUMMARY_STATS.totalProjects}</Text>
              </View>
              <Text style={styles.statLabel}>Total Projects</Text>
            </View>

            {/* Stat Card 2 (Real Total Spend) */}
            <View style={styles.statCard}>
              <View style={styles.statIconRow}>
                <Ionicons name="wallet" size={18} color="#A7F3D0" />
                <Text style={styles.statNumber}>{SUMMARY_STATS.totalSpend}</Text>
              </View>
              <Text style={styles.statLabel}>Real Total Spend</Text>
            </View>
          </View>

          {/* Timeline Card */}
          <View style={[styles.statCard, styles.timelineCard]}>
            <View style={styles.timelineHeaderRow}>
              <Ionicons name="time" size={18} color="#FDE047" />
              <Text style={styles.timelineHeaderTitle}>7-Year Impact Timeline</Text>
            </View>

            <View style={styles.timelineProgressRow}>
              {/* Start Year Badge */}
              <View style={styles.yearBadge}>
                <Text style={styles.yearText}>2016</Text>
              </View>

              {/* Timeline Connector Line */}
              <View style={styles.connectorLine}>
                <View style={styles.connectorPulseDot}>
                  <Ionicons name="flash-sharp" size={12} color="#FDE047" />
                </View>
              </View>

              {/* End Year Badge */}
              <View style={styles.yearBadge}>
                <Text style={styles.yearText}>2023</Text>
              </View>
            </View>

            <Text style={styles.statLabel}>Execution Time Frame (2016 – 2023)</Text>
          </View>
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="sparkles" size={18} color="#008751" />
            <Text style={styles.sectionTitle}>Recommended Projects</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/list')}
            style={styles.viewAllBtn}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <Ionicons name="arrow-forward" size={14} color="#008751" />
          </TouchableOpacity>
        </View>

        {/* Compact Recommended Projects List */}
        <View style={styles.projectsContainer}>
          {recommendedProjects.map((project) => (
            <ProjectCard key={project.id} project={project} compact={true} fromRoute="/" />
          ))}
        </View>

        {/* AdMob Banner Ad */}
        <AdBanner />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  statsBannerContainer: {
    backgroundColor: '#ECFDF5',
    padding: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#008751',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.92)',
  },
  timelineCard: {
    flex: 0,
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  timelineHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  timelineHeaderTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  timelineProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  yearBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  yearText: {
    color: '#008751',
    fontWeight: '800',
    fontSize: 13,
  },
  connectorLine: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 8,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectorPulseDot: {
    backgroundColor: '#008751',
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#FDE047',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#008751',
  },
  projectsContainer: {
    paddingHorizontal: 16,
  },
});