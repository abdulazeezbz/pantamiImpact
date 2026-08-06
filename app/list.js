import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ALL_PROJECTS } from '../data/projects';
import CategoryChips from '../components/CategoryChips';
import ProjectCard from '../components/ProjectCard';
import AdBanner from '../components/AdBanner';

export default function AllProjectsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'numbered'

  const filteredProjects = useMemo(() => {
    return ALL_PROJECTS.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.parastatal.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        activeCategory === 'All' || project.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Input Bar & View Mode Toggle */}
      <View style={styles.searchRowContainer}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by category or project..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Ionicons
              name="close-circle"
              size={20}
              color="#94A3B8"
              onPress={() => setSearchQuery('')}
            />
          )}
        </View>

        {/* View Mode Switcher */}
        <View style={styles.viewSwitcher}>
          <TouchableOpacity
            style={[styles.switchBtn, viewMode === 'cards' && styles.activeSwitchBtn]}
            onPress={() => setViewMode('cards')}
          >
            <Ionicons
              name="grid"
              size={18}
              color={viewMode === 'cards' ? '#FFFFFF' : '#008751'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.switchBtn, viewMode === 'numbered' && styles.activeSwitchBtn]}
            onPress={() => setViewMode('numbered')}
          >
            <Ionicons
              name="list"
              size={18}
              color={viewMode === 'numbered' ? '#FFFFFF' : '#008751'}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Chips Filter with Project Counts */}
      <CategoryChips
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* Projects List */}
      <FlatList
        data={filteredProjects}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          if (viewMode === 'cards') {
            return <ProjectCard project={item} fromRoute="/list" />;
          }

          // Numbered List View
          return (
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() =>
                router.push({
                  pathname: `/project/${item.id}`,
                  params: { from: '/list' },
                })
              }
              style={styles.numberedRowContainer}
            >
              <View style={styles.numberBadge}>
                <Text style={styles.numberBadgeText}>#{index + 1}</Text>
              </View>

              <View style={styles.numberedContent}>
                <View style={styles.numberedHeaderRow}>
                  <Text style={styles.numberedTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                </View>

                <Text style={styles.numberedCost}>{item.cost}</Text>

                <View style={styles.numberedFooterRow}>
                  <View style={styles.miniCategoryPill}>
                    <Text style={styles.miniCategoryText}>{item.category}</Text>
                  </View>
                  <Text style={styles.numberedLocation} numberOfLines={1}>
                    📍 {item.location}
                  </Text>
                </View>
              </View>

              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<AdBanner />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color="#94A3B8" />
            <Text style={styles.emptyText}>No matching projects found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  searchRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 4,
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#008751',
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 46,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  viewSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#F0FDF4',
    borderRadius: 24,
    padding: 3,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  switchBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeSwitchBtn: {
    backgroundColor: '#008751',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
  },

  // Numbered Row View Styling
  numberedRowContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  numberBadge: {
    backgroundColor: '#008751',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberBadgeText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
  numberedContent: {
    flex: 1,
  },
  numberedHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  numberedTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  numberedCost: {
    fontSize: 12,
    fontWeight: '700',
    color: '#008751',
    marginBottom: 4,
  },
  numberedFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  miniCategoryPill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  miniCategoryText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#008751',
  },
  numberedLocation: {
    fontSize: 11,
    color: '#64748B',
    flex: 1,
  },
});
