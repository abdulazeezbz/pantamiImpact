import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ALL_PROJECTS, fetchOSMGeocode } from '../data/projects';
import CategoryChips from '../components/CategoryChips';
import MapViewContainer from '../components/MapViewContainer';

const GOMBE_REGION = {
  latitude: 10.2897,
  longitude: 11.1673,
  latitudeDelta: 0.65,
  longitudeDelta: 0.65,
};

const PANTAMI_PHOTO = require('../assets/Pantami.jpg');

export default function MapScreen() {
  const { selectedId, search } = useLocalSearchParams();
  const router = useRouter();
  const mapRef = useRef(null);
  const markerRefs = useRef({});

  const [searchQuery, setSearchQuery] = useState(search || '');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const [osmDisplayName, setOsmDisplayName] = useState(null);
  const [loadingOsmAddress, setLoadingOsmAddress] = useState(false);

  // Filter projects by search and category
  const filteredProjects = useMemo(() => {
    return ALL_PROJECTS.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.parastatal.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        activeCategory === 'All' || project.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  // Handle OpenStreetMap Geocoding and Map Camera Adjustments when Searching
  useEffect(() => {
    let isMounted = true;
    const query = searchQuery.trim().toLowerCase();

    if (query.length >= 2 && mapRef.current) {
      const timeoutId = setTimeout(async () => {
        // If search is generic "Gombe" or "Gombe State", zoom out to show all of Gombe State
        if (query === 'gombe' || query === 'gombe state' || query === 'gombe, gombe state') {
          mapRef.current.animateToRegion(
            {
              latitude: 10.2897,
              longitude: 11.1711,
              latitudeDelta: 0.65,
              longitudeDelta: 0.65,
            },
            800
          );
          return;
        }

        // Live OpenStreetMap Nominatim API query
        const osmResult = await fetchOSMGeocode(searchQuery.trim());

        if (!isMounted) return;

        if (osmResult && osmResult.latitude && osmResult.longitude && mapRef.current) {
          mapRef.current.animateToRegion(
            {
              latitude: osmResult.latitude,
              longitude: osmResult.longitude,
              latitudeDelta: 0.04,
              longitudeDelta: 0.04,
            },
            800
          );
        } else if (filteredProjects.length > 0 && mapRef.current) {
          const avgLat =
            filteredProjects.reduce((sum, p) => sum + p.coordinates.latitude, 0) /
            filteredProjects.length;
          const avgLng =
            filteredProjects.reduce((sum, p) => sum + p.coordinates.longitude, 0) /
            filteredProjects.length;

          mapRef.current.animateToRegion(
            {
              latitude: avgLat,
              longitude: avgLng,
              latitudeDelta: filteredProjects.length === 1 ? 0.04 : 0.25,
              longitudeDelta: filteredProjects.length === 1 ? 0.04 : 0.25,
            },
            800
          );
        }

        // Auto-select callout bubble if 1 project matches
        if (filteredProjects.length === 1) {
          const target = filteredProjects[0];
          setSelectedProject(target);
          setTimeout(() => {
            if (markerRefs.current[target.id]) {
              markerRefs.current[target.id].showCallout();
            }
          }, 900);
        }
      }, 400);

      return () => {
        isMounted = false;
        clearTimeout(timeoutId);
      };
    }
  }, [searchQuery, filteredProjects]);

  // Fetch OpenStreetMap 1st result's display_name whenever selectedProject changes
  useEffect(() => {
    let isMounted = true;
    if (selectedProject) {
      setLoadingOsmAddress(true);
      setOsmDisplayName(null);

      fetchOSMGeocode(selectedProject.location).then((osmResult) => {
        if (!isMounted) return;
        if (osmResult && osmResult.displayName) {
          setOsmDisplayName(osmResult.displayName);
        } else {
          setOsmDisplayName(selectedProject.location);
        }
        setLoadingOsmAddress(false);
      });
    } else {
      setOsmDisplayName(null);
      setLoadingOsmAddress(false);
    }

    return () => {
      isMounted = false;
    };
  }, [selectedProject]);

  // Handle selectedId param passed from Project Details ("Locate on Map")
  useEffect(() => {
    if (selectedId) {
      const targetProject = ALL_PROJECTS.find((p) => String(p.id) === String(selectedId));
      if (targetProject && targetProject.coordinates && mapRef.current) {
        setSelectedProject(targetProject);
        mapRef.current.animateToRegion(
          {
            latitude: targetProject.coordinates.latitude,
            longitude: targetProject.coordinates.longitude,
            latitudeDelta: 0.04,
            longitudeDelta: 0.04,
          },
          1000
        );

        setTimeout(() => {
          if (markerRefs.current[targetProject.id]) {
            markerRefs.current[targetProject.id].showCallout();
          }
        }, 1100);
      }
    }
  }, [selectedId]);

  const navigateToDetails = (projectId) => {
    router.push({
      pathname: `/project/${projectId}`,
      params: { from: '/map' },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search address via OpenStreetMap..."
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
      </View>

      {/* Category Filter Chips */}
      <CategoryChips
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* Map or Web Fallback */}
      <MapViewContainer
        mapRef={mapRef}
        markerRefs={markerRefs}
        GOMBE_REGION={GOMBE_REGION}
        PANTAMI_PHOTO={PANTAMI_PHOTO}
        filteredProjects={filteredProjects}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        osmDisplayName={osmDisplayName}
        loadingOsmAddress={loadingOsmAddress}
        navigateToDetails={navigateToDetails}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#008751',
    borderRadius: 30,
    paddingHorizontal: 20,
    height: 48,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
  },
  mapWrapper: {
    flex: 1,
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  calloutContainer: {
    width: 220,
    padding: 6,
  },
  calloutContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  calloutTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  calloutDesc: {
    fontSize: 11,
    color: '#475569',
    marginBottom: 4,
    lineHeight: 15,
  },
  calloutCost: {
    fontSize: 12,
    fontWeight: '700',
    color: '#008751',
    marginBottom: 2,
  },
  calloutActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284C7',
    marginTop: 2,
  },
  floatingBadge: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  floatingBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#008751',
  },
  // Pin Click Floating Card at Bottom
  pinCardContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pinCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  pantamiAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#008751',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  categoryPill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  categoryPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#008751',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  pinCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 20,
  },
  closeBtn: {
    padding: 4,
    alignSelf: 'flex-start',
  },
  pinCardDescription: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 8,
  },
  osmAddressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    padding: 8,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  osmAddressText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#166534',
    flex: 1,
    lineHeight: 15,
  },
  pinCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  pinCardCost: {
    fontSize: 13,
    fontWeight: '800',
    color: '#008751',
  },
  detailsBtn: {
    backgroundColor: '#008751',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  detailsBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
