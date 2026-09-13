import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface MockMapContainerProps {
  locationName: string;
  condoBuildingName?: string;
  unitParkingBay?: string;
  cityName: string;
  stateName: string;
  onPressPin?: () => void;
}

export default function MockMapContainer({
  locationName,
  condoBuildingName,
  unitParkingBay,
  cityName,
  stateName,
  onPressPin,
}: MockMapContainerProps) {
  return (
    <View style={styles.container}>
      {/* Mock Graphic Map Grid */}
      <View style={styles.mapGrid}>
        <View style={styles.roadHorizontal} />
        <View style={styles.roadVertical} />
        <View style={styles.buildingBlock1} />
        <View style={styles.buildingBlock2} />

        {/* Pin Marker */}
        <TouchableOpacity style={styles.pinContainer} onPress={onPressPin} activeOpacity={0.8}>
          <View style={styles.pinBubble}>
            <Text style={styles.pinBubbleText}>📍 Wash Location</Text>
          </View>
          <View style={styles.pinPoint} />
          <View style={styles.pinShadow} />
        </TouchableOpacity>
      </View>

      {/* Address Info Overlay */}
      <View style={styles.infoOverlay}>
        <Text style={styles.locTitle}>{locationName}</Text>
        <Text style={styles.locSub}>
          {condoBuildingName ? `${condoBuildingName} • ` : ''}{cityName}, {stateName}
        </Text>
        {unitParkingBay && (
          <View style={styles.bayBadge}>
            <Text style={styles.bayBadgeText}>🅿️ Bay: {unitParkingBay}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#e2e8f0',
    marginBottom: 16,
  },
  mapGrid: {
    height: 140,
    backgroundColor: '#cbd5e1',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roadHorizontal: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    height: 24,
    backgroundColor: '#94a3b8',
  },
  roadVertical: {
    position: 'absolute',
    left: '50%',
    marginLeft: -12,
    top: 0,
    bottom: 0,
    width: 24,
    backgroundColor: '#94a3b8',
  },
  buildingBlock1: {
    position: 'absolute',
    top: 10,
    left: 20,
    width: 70,
    height: 40,
    backgroundColor: '#64748b',
    borderRadius: 6,
  },
  buildingBlock2: {
    position: 'absolute',
    bottom: 10,
    right: 20,
    width: 80,
    height: 35,
    backgroundColor: '#64748b',
    borderRadius: 6,
  },
  pinContainer: {
    alignItems: 'center',
    zIndex: 10,
  },
  pinBubble: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 2,
  },
  pinBubbleText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },
  pinPoint: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ef4444',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  pinShadow: {
    width: 16,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.2)',
    marginTop: 2,
  },
  infoOverlay: {
    backgroundColor: '#ffffff',
    padding: 12,
  },
  locTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  locSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  bayBadge: {
    backgroundColor: '#fef08a',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 6,
  },
  bayBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#854d0e',
  },
});
