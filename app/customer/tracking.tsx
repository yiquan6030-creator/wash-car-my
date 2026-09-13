import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useBooking } from '../../src/context/BookingContext';
import { colors, spacing, borderRadius, shadows } from '../../src/theme';
import { SAMPLE_WASHER } from '../../src/services/mockData';

export default function LiveTrackingScreen() {
  const router = useRouter();
  const { activeBooking, updateBookingStatus } = useBooking();
  const [demoArrival, setDemoArrival] = useState(false);

  const isArrived = demoArrival || activeBooking?.status === 'arrived' || activeBooking?.status === 'washing';

  const handleSimulateArrival = () => {
    setDemoArrival(true);
    updateBookingStatus('arrived');
  };

  return (
    <View style={styles.container}>
      {/* 1. TOP STATUS BANNER */}
      <View style={styles.topBanner}>
        <View style={styles.statusRow}>
          <Text style={styles.statusBadgeIcon}>{isArrived ? '📍' : '🛵'}</Text>
          <View>
            <Text style={styles.bannerTitle}>
              {isArrived ? 'Your washer has arrived!' : 'Amir is heading to you'}
            </Text>
            <Text style={styles.bannerSub}>
              {isArrived ? 'Please ensure vehicle is accessible at Bay B2' : 'ETA: 8 mins • 2.1 km away'}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.demoSimBtn} onPress={handleSimulateArrival}>
          <Text style={styles.demoSimText}>{isArrived ? 'Arrived ✓' : 'Simulate Arrival'}</Text>
        </TouchableOpacity>
      </View>

      {/* 2. MAP CANVAS (Simulated Clean Vector Map) */}
      <View style={styles.mapCanvas}>
        {/* Grid / Roads Graphic */}
        <View style={styles.roadHorizontal} />
        <View style={styles.roadVertical} />
        <View style={styles.roadDiagonal} />

        {/* Customer Location Pin */}
        <View style={[styles.markerBox, styles.customerMarker]}>
          <Text style={styles.markerPin}>📍</Text>
          <View style={styles.markerBubble}>
            <Text style={styles.markerBubbleText}>My Location (Bangsar)</Text>
          </View>
        </View>

        {/* Route Line */}
        <View style={styles.routeLine} />

        {/* Washer Live Marker */}
        <View style={[styles.markerBox, isArrived ? styles.washerArrivedMarker : styles.washerMarker]}>
          <Text style={styles.markerIcon}>🛵</Text>
          <View style={styles.washerBubble}>
            <Text style={styles.washerBubbleText}>Amir (Detailer)</Text>
          </View>
        </View>
      </View>

      {/* 3. BOTTOM FLOATING WASHER CARD */}
      <View style={styles.bottomCard}>
        {/* Washer Profile Header */}
        <View style={styles.washerRow}>
          <Image source={{ uri: SAMPLE_WASHER.avatarUrl }} style={styles.avatar} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.washerName}>Amir</Text>
              <View style={styles.ratingPill}>
                <Text style={styles.ratingText}>★ 4.9 Washer</Text>
              </View>
            </View>
            <Text style={styles.vehicleInfo}>
              Perodua Myvi • <Text style={styles.plateText}>VWB 8819</Text>
            </Text>
          </View>
        </View>

        {/* Service Details Breakdown */}
        <View style={styles.orderSummaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Service:</Text>
            <Text style={styles.summaryValue}>{activeBooking?.service?.name || 'Interior + Exterior'}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Address:</Text>
            <Text style={styles.summaryValue} numberOfLines={1}>Jalan Telawi 3, Bangsar (B2, Bay #45)</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Paid:</Text>
            <Text style={styles.totalPrice}>RM {activeBooking?.totalMYR || 48}.00</Text>
          </View>
        </View>

        {/* Action Buttons: Chat & Call */}
        <View style={styles.actionBtnRow}>
          <TouchableOpacity 
            style={styles.chatBtn}
            onPress={() => router.push('/customer/messages')}
          >
            <Text style={styles.chatBtnText}>💬 Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.callBtn}
            onPress={() => alert('Calling Amir at +60 12-345 6789...')}
          >
            <Text style={styles.callBtnText}>📞 Call Amir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e2e8f0' },
  topBanner: {
    position: 'absolute',
    top: 12,
    left: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: '#ffffff',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.medium,
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  statusBadgeIcon: { fontSize: 22 },
  bannerTitle: { fontSize: 14, fontWeight: '900', color: colors.textDark },
  bannerSub: { fontSize: 11, color: colors.textMuted, marginTop: 1 },
  demoSimBtn: { backgroundColor: colors.primaryLight, paddingHorizontal: 10, paddingVertical: 6, borderRadius: borderRadius.sm },
  demoSimText: { fontSize: 10, fontWeight: '800', color: colors.primaryDark },
  mapCanvas: { flex: 1, backgroundColor: '#f1f5f9', position: 'relative' },
  roadHorizontal: { position: 'absolute', top: '45%', left: 0, right: 0, height: 30, backgroundColor: '#e2e8f0' },
  roadVertical: { position: 'absolute', left: '50%', top: 0, bottom: 0, width: 30, backgroundColor: '#e2e8f0' },
  roadDiagonal: { position: 'absolute', top: '20%', left: 0, right: 0, height: 16, backgroundColor: '#cbd5e1', transform: [{ rotate: '-25deg' }] },
  markerBox: { position: 'absolute', alignItems: 'center', zIndex: 5 },
  customerMarker: { top: '35%', left: '25%' },
  markerPin: { fontSize: 32 },
  markerBubble: { backgroundColor: colors.brandNavy, paddingHorizontal: 8, paddingVertical: 4, borderRadius: borderRadius.sm, marginTop: -4 },
  markerBubbleText: { color: '#ffffff', fontSize: 10, fontWeight: '800' },
  routeLine: { position: 'absolute', top: '38%', left: '32%', width: 120, height: 4, backgroundColor: colors.primaryBlue, borderRadius: 2, transform: [{ rotate: '35deg' }] },
  washerMarker: { top: '55%', left: '60%' },
  washerArrivedMarker: { top: '38%', left: '32%' },
  markerIcon: { fontSize: 28 },
  washerBubble: { backgroundColor: colors.successGreen, paddingHorizontal: 8, paddingVertical: 4, borderRadius: borderRadius.sm, marginTop: -4 },
  washerBubbleText: { color: '#ffffff', fontSize: 10, fontWeight: '800' },
  bottomCard: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: '#ffffff',
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.medium,
  },
  washerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: colors.primaryBlue },
  washerName: { fontSize: 16, fontWeight: '900', color: colors.textDark },
  ratingPill: { backgroundColor: colors.amberLight, paddingHorizontal: 6, paddingVertical: 2, borderRadius: borderRadius.sm },
  ratingText: { color: colors.amberOffer, fontSize: 10, fontWeight: '900' },
  vehicleInfo: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  plateText: { fontWeight: '800', color: colors.textDark },
  orderSummaryBox: { backgroundColor: colors.backgroundLight, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: 12, gap: 4 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontSize: 11, color: colors.textMuted, fontWeight: '600' },
  summaryValue: { fontSize: 11, fontWeight: '800', color: colors.textDark },
  totalPrice: { fontSize: 12, fontWeight: '900', color: colors.primaryBlue },
  actionBtnRow: { flexDirection: 'row', gap: 10 },
  chatBtn: { flex: 1, backgroundColor: colors.primaryLight, paddingVertical: 12, borderRadius: borderRadius.md, alignItems: 'center' },
  chatBtnText: { color: colors.primaryDark, fontWeight: '800', fontSize: 13 },
  callBtn: { flex: 1, backgroundColor: colors.primaryBlue, paddingVertical: 12, borderRadius: borderRadius.md, alignItems: 'center' },
  callBtnText: { color: '#ffffff', fontWeight: '900', fontSize: 13 },
});
