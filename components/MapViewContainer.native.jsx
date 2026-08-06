import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, Callout, PROVIDER_DEFAULT } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

export default function MapViewContainer({
  mapRef,
  markerRefs,
  GOMBE_REGION,
  PANTAMI_PHOTO,
  filteredProjects,
  selectedProject,
  setSelectedProject,
  osmDisplayName,
  loadingOsmAddress,
  navigateToDetails,
}) {
  return (
    <View style={styles.mapWrapper}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={GOMBE_REGION}
        showsUserLocation={true}
        showsCompass={true}
        onPress={() => setSelectedProject(null)}
      >
        {filteredProjects.map((project) => {
          const isSelected =
            selectedProject && String(selectedProject.id) === String(project.id);
          return (
            <Marker
              key={project.id}
              ref={(ref) => (markerRefs.current[project.id] = ref)}
              coordinate={project.coordinates}
              pinColor={isSelected ? '#0284C7' : '#008751'}
              onPress={() => setSelectedProject(project)}
            >
              <Callout
                style={styles.calloutContainer}
                onPress={() => navigateToDetails(project.id)}
              >
                <View style={styles.calloutContent}>
                  <Text style={styles.calloutTitle} numberOfLines={2}>
                    {project.title}
                  </Text>
                  <Text style={styles.calloutDesc} numberOfLines={2}>
                    {project.description}
                  </Text>
                  <Text style={styles.calloutCost}>{project.cost}</Text>
                  <Text style={styles.calloutActionText}>Tap to view details →</Text>
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>

      {/* Selected Pin Bottom Preview Modal */}
      {selectedProject ? (
        <View style={styles.pinCardContainer}>
          <View style={styles.pinCardHeader}>
            <Image
              source={PANTAMI_PHOTO}
              style={styles.pantamiAvatar}
              resizeMode="cover"
            />
            <View style={{ flex: 1 }}>
              <View style={styles.badgeRow}>
                <View style={styles.categoryPill}>
                  <Text style={styles.categoryPillText}>{selectedProject.category}</Text>
                </View>
                <Text style={styles.statusText}>{selectedProject.status}</Text>
              </View>
              <Text style={styles.pinCardTitle} numberOfLines={2}>
                {selectedProject.title}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setSelectedProject(null)}
              style={styles.closeBtn}
            >
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <Text style={styles.pinCardDescription} numberOfLines={2}>
            {selectedProject.description}
          </Text>

          {/* OpenStreetMap display_name returned for selected project location */}
          <View style={styles.osmAddressBox}>
            <Ionicons name="location" size={14} color="#008751" />
            {loadingOsmAddress ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <ActivityIndicator size="small" color="#008751" />
                <Text style={styles.osmAddressText}>Fetching OpenStreetMap address...</Text>
              </View>
            ) : (
              <Text style={styles.osmAddressText} numberOfLines={2}>
                {osmDisplayName || selectedProject.location}
              </Text>
            )}
          </View>

          <View style={styles.pinCardFooter}>
            <Text style={styles.pinCardCost}>{selectedProject.cost}</Text>
            <TouchableOpacity
              style={styles.detailsBtn}
              activeOpacity={0.8}
              onPress={() => navigateToDetails(selectedProject.id)}
            >
              <Text style={styles.detailsBtnText}>View Full Details →</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        /* Floating Counter Indicator */
        <View style={styles.floatingBadge}>
          <Ionicons name="location" size={16} color="#008751" />
          <Text style={styles.floatingBadgeText}>
            Showing {filteredProjects.length} Projects on Map
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
