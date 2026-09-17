import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import { colors, borderRadius, shadows, spacing } from '../theme';

interface GoogleMapContainerProps {
  latitude?: number;
  longitude?: number;
  locationName: string;
  address: string;
  condoBuildingName?: string;
  unitParkingBay?: string;
  washerLatitude?: number;
  washerLongitude?: number;
  washerName?: string;
  height?: number;
  showOpenInAppBtn?: boolean;
}

export default function GoogleMapContainer({
  latitude = 3.1390,
  longitude = 101.6869,
  locationName,
  address,
  condoBuildingName,
  unitParkingBay,
  washerLatitude,
  washerLongitude,
  washerName = 'Amir Hazim',
  height = 240,
  showOpenInAppBtn = true,
}: GoogleMapContainerProps) {

  const handleOpenGoogleMaps = () => {
    let url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    if (washerLatitude && washerLongitude) {
      url = `https://www.google.com/maps/dir/?api=1&origin=${washerLatitude},${washerLongitude}&destination=${latitude},${longitude}`;
    }
    Linking.openURL(url).catch((err) => {
      console.error('Could not open Google Maps link:', err);
      alert('Opening Google Maps...');
    });
  };

  // Google Maps embed URL for web
  const embedUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;

  return (
    <View style={[styles.container, shadows.medium]}>
      
      {/* MAP VIEWPORT */}
      <View style={[styles.mapViewport, { height }]}>
        {Platform.OS === 'web' ? (
          // @ts-ignore - Web iframe container
          <iframe
            title="Google Maps Location"
            width="100%"
            height="100%"
            style={{ border: 0, width: '100%', height: '100%' }}
            loading="lazy"
            allowFullScreen
            src={embedUrl}
          />
        ) : (
          /* Simulated Fallback Graphic Map for Native Platforms */
          <View style={styles.nativeFallbackMap}>
            <View style={styles.roadH} />
            <View style={styles.roadV} />
            
            {/* Customer Pin */}
            <View style={styles.pinBox}>
              <View style={styles.pinBubble}>
                <Text style={styles.pinBubbleText}>📍 {locationName}</Text>
              </View>
              <View style={styles.pinDotRed} />
            </View>

            {washerLatitude && (
              <View style={styles.washerPinBox}>
                <Text style={{ fontSize: 24 }}>🛵</Text>
                <View style={styles.washerBubble}>
                  <Text style={styles.washerBubbleText}>{washerName}</Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* GPS COORDINATES BADGE OVERLAY */}
        <View style={styles.gpsBadgeOverlay}>
          <Text style={styles.gpsDot}>🟢</Text>
          <Text style={styles.gpsBadgeText}>
            GPS: {latitude.toFixed(4)}, {longitude.toFixed(4)}
          </Text>
        </View>
      </View>

      {/* ADDRESS OVERLAY & GOOGLE MAPS TRIGGER */}
      <View style={styles.infoOverlay}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={styles.locTitle}>{locationName}</Text>
            <View style={styles.googleTag}>
              <Text style={styles.googleTagText}>Google Maps</Text>
            </View>
          </View>
          <Text style={styles.locSub} numberOfLines={1}>{address}</Text>
          {condoBuildingName && (
            <Text style={styles.condoText}>
              🏢 {condoBuildingName} ({unitParkingBay || 'N/A'})
            </Text>
          )}
        </View>

        {showOpenInAppBtn && (
          <TouchableOpacity
            style={styles.openMapsBtn}
            onPress={handleOpenGoogleMaps}
            activeOpacity={0.85}
          >
            <Text style={styles.openMapsBtnText}>Open in Google Maps 🗺️</Text>
          </TouchableOpacity>
        )}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.surfaceWhite,
    marginBottom: spacing.md,
  },
  mapViewport: {
    width: '100%',
    backgroundColor: '#e2e8f0',
    position: 'relative',
  },

  gpsBadgeOverlay: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    zIndex: 10,
  },
  gpsDot: {
    fontSize: 8,
  },
  gpsBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },

  nativeFallbackMap: {
    flex: 1,
    backgroundColor: '#cbd5e1',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  roadH: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 28,
    backgroundColor: '#94a3b8',
  },
  roadV: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: 28,
    backgroundColor: '#94a3b8',
  },
  pinBox: {
    alignItems: 'center',
    zIndex: 5,
  },
  pinBubble: {
    backgroundColor: colors.brandNavy,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.pill,
    marginBottom: 2,
  },
  pinBubbleText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
  pinDotRed: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ef4444',
    borderWidth: 2,
    borderColor: '#ffffff',
  },

  washerPinBox: {
    position: 'absolute',
    top: '30%',
    right: '25%',
    alignItems: 'center',
  },
  washerBubble: {
    backgroundColor: colors.successGreen,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
    marginTop: -4,
  },
  washerBubbleText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '900',
  },

  infoOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceWhite,
    padding: spacing.md,
    gap: spacing.md,
  },
  locTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.brandNavy,
  },
  googleTag: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
  },
  googleTagText: {
    color: colors.primaryBlue,
    fontSize: 9,
    fontWeight: '900',
  },
  locSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  condoText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
    marginTop: 2,
  },

  openMapsBtn: {
    backgroundColor: colors.primaryBlue,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: borderRadius.md,
  },
  openMapsBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '900',
  },
});
