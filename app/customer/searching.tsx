import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useBooking } from '../../src/context/BookingContext';
import { colors, spacing, borderRadius, shadows } from '../../src/theme';
import { SAMPLE_WASHER } from '../../src/services/mockData';

export default function SearchingWasherScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { updateBookingStatus } = useBooking();
  const [foundWasher, setFoundWasher] = useState(false);
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  const isDesktop = width >= 1024;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.3, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();

    const timer = setTimeout(() => {
      setFoundWasher(true);
      updateBookingStatus('assigned');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleProceedTracking = () => {
    updateBookingStatus('on_the_way');
    router.replace('/customer/tracking');
  };

  return (
    <View style={styles.container}>
      <View style={[styles.mainWrapper, isDesktop && styles.mainWrapperDesktop]}>

        {!foundWasher ? (
          <View style={styles.searchingBox}>
            {/* RADAR PULSE RIPPLE GRAPHIC */}
            <View style={styles.radarWrapper}>
              <Animated.View style={[styles.radarRing, { transform: [{ scale: pulseAnim }] }]} />
              <View style={styles.centerIconCircle}>
                <Text style={{ fontSize: 36 }}>🛵</Text>
              </View>
            </View>

            <Text style={styles.statusTitleText}>Matching Nearby Pro Detailer...</Text>
            <Text style={styles.statusSubText}>
              Locating top-rated mobile detailers within 3 km of your parking bay in Bangsar.
            </Text>

            <TouchableOpacity 
              style={styles.cancelBtn} 
              onPress={() => router.replace('/customer')}
            >
              <Text style={styles.cancelBtnText}>Cancel Request</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.foundCardPanel}>
            <View style={styles.successBadgeTag}>
              <Text style={styles.successBadgeText}>⚡ PRO DETAILER MATCHED!</Text>
            </View>

            <Image source={{ uri: SAMPLE_WASHER.avatarUrl }} style={styles.washerAvatarImage} />
            <Text style={styles.washerNameText}>Amir Hazim</Text>
            <Text style={styles.washerRatingText}>⭐ 4.95 Rating (142 completed washes)</Text>
            <Text style={styles.washerRigText}>🛵 Perodua Myvi • VWB 8819 (Rig Mounted Eco-Wash Unit)</Text>

            <View style={styles.etaCardBox}>
              <Text style={styles.etaLabelText}>ESTIMATED TIME OF ARRIVAL</Text>
              <Text style={styles.etaTimeText}>8 minutes</Text>
              <Text style={styles.etaAreaText}>En route to Jalan Telawi 3, Bangsar (Bay B2-#45)</Text>
            </View>

            <TouchableOpacity style={styles.proceedBtn} onPress={handleProceedTracking} activeOpacity={0.9}>
              <Text style={styles.proceedBtnText}>Track Live Map →</Text>
            </TouchableOpacity>
          </View>
        )}

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  mainWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  mainWrapperDesktop: {
    maxWidth: 600,
  },

  searchingBox: {
    alignItems: 'center',
    width: '100%',
  },
  radarWrapper: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xxl,
    position: 'relative',
  },
  radarRing: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.primaryLight,
    borderWidth: 2,
    borderColor: colors.primaryBlue,
  },
  centerIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryBlue,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    ...shadows.medium,
  },

  statusTitleText: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.brandNavy,
    textAlign: 'center',
    marginBottom: 8,
  },
  statusSubText: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: spacing.xxl,
  },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.surfaceWhite,
  },
  cancelBtnText: {
    color: colors.textMuted,
    fontWeight: '800',
    fontSize: 13,
  },

  foundCardPanel: {
    width: '100%',
    backgroundColor: colors.surfaceWhite,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.medium,
  },
  successBadgeTag: {
    backgroundColor: colors.successLight,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: borderRadius.pill,
    marginBottom: spacing.lg,
  },
  successBadgeText: {
    color: colors.successGreen,
    fontWeight: '900',
    fontSize: 11,
  },
  washerAvatarImage: {
    width: 84,
    height: 84,
    borderRadius: 42,
    marginBottom: 12,
    borderWidth: 3,
    borderColor: colors.primaryBlue,
  },
  washerNameText: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.brandNavy,
  },
  washerRatingText: {
    fontSize: 13,
    color: colors.successGreen,
    fontWeight: '800',
    marginTop: 2,
  },
  washerRigText: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
    textAlign: 'center',
  },

  etaCardBox: {
    backgroundColor: colors.primaryLight,
    width: '100%',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  etaLabelText: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.primaryDark,
    letterSpacing: 0.8,
  },
  etaTimeText: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.primaryBlue,
    marginVertical: 4,
  },
  etaAreaText: {
    fontSize: 12,
    color: colors.textDark,
    fontWeight: '700',
    textAlign: 'center',
  },

  proceedBtn: {
    backgroundColor: colors.primaryBlue,
    width: '100%',
    paddingVertical: 16,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    ...shadows.soft,
  },
  proceedBtnText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 15,
  },
});
