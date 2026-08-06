import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { INFO_CONTENT } from '../data/projects';

const PANTAMI_PHOTO = require('../assets/Pantami.jpg');

export default function InfoScreen() {
  const { profile, keyMetrics, legislativeActs, zonalHeadquarters } = INFO_CONTENT;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Card Header */}
        <View style={styles.profileCard}>
          <Image
            source={PANTAMI_PHOTO}
            style={styles.profileImage}
            resizeMode="cover"
          />
          <View style={styles.profileDetails}>
            <Text style={styles.profileName}>{profile.name}</Text>
            <Text style={styles.profileTitles}>{profile.titles}</Text>
            <Text style={styles.profileRole}>{profile.role}</Text>
            <View style={styles.honorBadge}>
              <Ionicons name="ribbon-outline" size={14} color="#047857" />
              <Text style={styles.honorText}>{profile.honor}</Text>
            </View>
          </View>
        </View>

        {/* Leadership Appointments */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeaderTitle}>Key Appointments & Honors</Text>
          {profile.tenures.map((tenure, idx) => (
            <View key={idx} style={styles.listItemRow}>
              <Ionicons name="checkmark-circle" size={18} color="#10B981" />
              <Text style={styles.listItemText}>{tenure}</Text>
            </View>
          ))}
        </View>

        {/* Impact Metrics Grid */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeaderTitle}>National & Regional Impacts</Text>
          <View style={styles.metricsGrid}>
            {keyMetrics.map((item, idx) => (
              <View key={idx} style={styles.metricItemCard}>
                <Text style={styles.metricValue}>{item.value}</Text>
                <Text style={styles.metricLabel}>{item.label}</Text>
                <Text style={styles.metricSubtext}>{item.subtext}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* North-East Zonal Headquarters in Gombe */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeaderTitle}>North-East Regional Headquarters</Text>
          <Text style={styles.bodyParagraph}>
            Under Prof. Pantami's strategic leadership, Gombe State was designated as the central North-East headquarters for Nigeria’s key digital economy institutions:
          </Text>
          {zonalHeadquarters.map((headquarter, idx) => (
            <View key={idx} style={styles.zonalCard}>
              <Ionicons name="business" size={24} color="#047857" />
              <View style={{ flex: 1 }}>
                <Text style={styles.zonalName}>{headquarter.name}</Text>
                <Text style={styles.zonalCost}>{headquarter.cost}</Text>
              </View>
              <View style={styles.zonalBadge}>
                <Text style={styles.zonalBadgeText}>{headquarter.status}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Legislative Acts */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeaderTitle}>Landmark Legislation</Text>
          {legislativeActs.map((act, idx) => (
            <View key={idx} style={styles.listItemRow}>
              <Ionicons name="document-text" size={18} color="#0284C7" />
              <Text style={styles.listItemText}>{act}</Text>
            </View>
          ))}
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
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#10B981',
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  profileTitles: {
    fontSize: 12,
    fontWeight: '600',
    color: '#047857',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 12,
    color: '#475569',
    marginBottom: 8,
  },
  honorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  honorText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#047857',
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  bodyParagraph: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 12,
  },
  listItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  listItemText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metricItemCard: {
    width: '48%',
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#047857',
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  metricSubtext: {
    fontSize: 10,
    color: '#64748B',
  },
  zonalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  zonalName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  zonalCost: {
    fontSize: 12,
    color: '#0284C7',
    fontWeight: '600',
  },
  zonalBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  zonalBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0369A1',
  },
});
