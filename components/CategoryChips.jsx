import React from 'react';
import { StyleSheet, Text, ScrollView, TouchableOpacity, View } from 'react-native';
import { CATEGORIES, ALL_PROJECTS } from '../data/projects';

// Calculate project count for each category
const categoryCounts = (() => {
  const counts = { All: ALL_PROJECTS.length };
  ALL_PROJECTS.forEach((p) => {
    counts[p.category] = (counts[p.category] || 0) + 1;
  });
  return counts;
})();

export default function CategoryChips({ activeCategory, onSelectCategory }) {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          const count = categoryCounts[cat] || 0;
          const label = `${cat} (${count})`;

          return (
            <TouchableOpacity
              key={cat}
              activeOpacity={0.75}
              onPress={() => onSelectCategory(cat)}
              style={[styles.chip, isActive && styles.activeChip]}
            >
              <Text style={[styles.chipText, isActive && styles.activeChipText]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 6,
  },
  container: {
    paddingHorizontal: 16,
    gap: 10,
    alignItems: 'center',
  },
  chip: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  activeChip: {
    backgroundColor: '#008751', // Uniform Brand Green
    borderColor: '#008751',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#008751',
  },
  activeChipText: {
    color: '#FFFFFF',
  },
});
