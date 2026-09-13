import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useBooking } from '../../src/context/BookingContext';
import { colors, spacing, borderRadius, shadows } from '../../src/theme';
import { SAMPLE_WASHER } from '../../src/services/mockData';

export default function SearchingWasherScreen() {
  const router = useRouter();
  const { updateBookingStatus } = useBooking();
  const [foundWasher, setFoundWasher] = useState(false);
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Pulse animation loop for radar ring
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.25, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();

    // Auto-discover washer after 2.5 seconds for demo
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
      {!foundWasher ? (
        <View style={styles.searchingBox}>
          {/* Radar Ripple Graphic */}
          <View style={styles.radarWrapper}>
            <Animated.View style={[styles.radarRing, { transform: [{ scale: pulseAnim }] }]} />
            <View style={styles.centerIcon}>
              <Text style={styles.carEmoji}>🚗</Text>
            </View>
          </View>

          <Text style={styles.statusTitle}>Finding the best available washer near you...</Text>
          <Text style={styles.statusSub}>Dispatching trained mobile detailers within 3 km of Bangsar.</Text>

          <TouchableOpacity 
            style={styles.cancelBtn} 
            onPress={() => router.replace('/customer')}
          >
            <Text style={styles.cancelText}>Cancel Request</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.foundBox}>
          <View style={styles.successBadge}>
            <Text style={styles.successBadgeText}>⚡ WASHER FOUND!</Text>
          </View>

          <Image source={{ uri: SAMPLE_WASHER.avatarUrl }} style={styles.washerAvatar} />
          <Text style={styles.washerName}>{SAMPLE_WASHER.name}</Text>
          <Text style={styles.washerRating}>⭐ {SAMPLE_WASHER.rating} ({SAMPLE_WASHER.completedJobsCount} completed washes)</Text>
          <Text style={styles.washerRig}>🛵 {SAMPLE_WASHER.vehicleRig}</Text>

          <View style={styles.etaCard}>
            <Text style={styles.etaLabel}>ESTIMATED ARRIVAL</Text>
            <Text style={styles.etaTime}>8 minutes</Text>
            <Text style={styles.etaArea}>En-route to Jalan Telawi 3, Bangsar</Text>
          </View>

          <TouchableOpacity style={styles.proceedBtn} onPress={handleProceedTracking} activeOpacity={0.9}>
            <Text style={styles.proceedText}>Track Live Map →</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundLight, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  searchingBox: { alignItems: 'center', width: '100%' },
  radarWrapper: { width: 140, height: 140, justifyContent: 'center', alignItems: 'center', marginBottom: 28, position: 'relative' },
  radarRing: { position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: colors.primaryLight, borderWidth: 2, borderColor: colors.primaryBlue },
  centerIcon: { width: 70, height: 70, borderRadius: 35, backgroundColor: colors.primaryBlue, justifyContent: 'center', alignItems: 'center', zIndex: 2 },
  carEmoji: { fontSize: 32 },
  statusTitle: { fontSize: 18, fontWeight: '900', color: colors.textDark, textAlign: 'center', marginBottom: 8 },
  statusSub: { fontSize: 13, color: colors.textMuted, textAlign: 'center', lineHeight: 18, marginBottom: 32, paddingHorizontal: 20 },
  cancelBtn: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.borderLight, backgroundColor: '#ffffff' },
  cancelText: { color: colors.textMuted, fontWeight: '800', fontSize: 13 },
  foundBox: { width: '100%', backgroundColor: '#ffffff', borderRadius: borderRadius.xl, padding: spacing.xl, alignItems: 'center', borderWidth: 1, borderColor: colors.borderLight, ...shadows.medium },
  successBadge: { backgroundColor: colors.successLight, paddingHorizontal: 12, paddingVertical: 6, borderRadius: borderRadius.pill, marginBottom: 16 },
  successBadgeText: { color: colors.successGreen, fontWeight: '900', fontSize: 11 },
  washerAvatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 10, borderWidth: 3, borderColor: colors.primaryBlue },
  washerName: { fontSize: 20, fontWeight: '900', color: colors.textDark },
  washerRating: { fontSize: 13, color: colors.successGreen, fontWeight: '800', marginTop: 2 },
  washerRig: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  etaCard: { backgroundColor: colors.primaryLight, width: '100%', padding: spacing.md, borderRadius: borderRadius.md, alignItems: 'center', marginVertical: 16 },
  etaLabel: { fontSize: 10, fontWeight: '800', color: colors.primaryDark, letterSpacing: 0.5 },
  etaTime: { fontSize: 22, fontWeight: '900', color: colors.primaryBlue, marginVertical: 2 },
  etaArea: { fontSize: 11, color: colors.textDark, fontWeight: '600' },
  proceedBtn: { backgroundColor: colors.primaryBlue, width: '100%', paddingVertical: 14, borderRadius: borderRadius.md, alignItems: 'center' },
  proceedText: { color: '#ffffff', fontWeight: '900', fontSize: 15 },
});
