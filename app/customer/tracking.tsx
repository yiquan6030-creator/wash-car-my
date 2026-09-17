import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, useWindowDimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useBooking } from '../../src/context/BookingContext';
import { colors, spacing, borderRadius, shadows } from '../../src/theme';
import { SAMPLE_WASHER } from '../../src/services/mockData';

export default function LiveTrackingScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { activeBooking, updateBookingStatus } = useBooking();
  const [demoArrival, setDemoArrival] = useState(false);

  const isDesktop = width >= 1024;
  const isArrived = demoArrival || activeBooking?.status === 'arrived' || activeBooking?.status === 'washing' || activeBooking?.status === 'completed';

  const handleSimulateArrival = () => {
    setDemoArrival(true);
    updateBookingStatus('arrived');
  };

  return (
    <View style={styles.container}>
      <View style={[styles.mainWrapper, isDesktop && styles.mainWrapperDesktop]}>

        {/* TOP STATUS HEADER BAR */}
        <View style={styles.statusHeaderBar}>
          <View style={styles.statusHeaderLeft}>
            <View style={[styles.statusIconCircle, isArrived && styles.statusIconCircleArrived]}>
              <Text style={{ fontSize: 22 }}>{isArrived ? '📍' : '🛵'}</Text>
            </View>
            <View>
              <Text style={styles.statusTitleText}>
                {isArrived ? 'Detailer Has Arrived at Your Location' : 'Amir Hazim is Heading to Your Location'}
              </Text>
              <Text style={styles.statusSubText}>
                {isArrived ? 'Please ensure vehicle is unlocked or accessible at Bay B2-#45' : 'Estimated Arrival: 8 mins • 2.1 km away • Speed: 35 km/h'}
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.simBtn} onPress={handleSimulateArrival}>
            <Text style={styles.simBtnText}>{isArrived ? 'Arrived ✓' : '⚡ Simulate Arrival'}</Text>
          </TouchableOpacity>
        </View>

        {/* MAP & WASHER PROFILE GRID */}
        <View style={[styles.gridContainer, isDesktop && styles.gridContainerDesktop]}>

          {/* SIMULATED VECTOR MAP CANVAS */}
          <View style={[styles.mapContainerCard, isDesktop && styles.mapFlex]}>
            <View style={styles.mapGraphicCanvas}>
              {/* Roads & Blocks */}
              <View style={styles.roadH1} />
              <View style={styles.roadH2} />
              <View style={styles.roadV1} />
              <View style={styles.buildingBlock1} />
              <View style={styles.buildingBlock2} />
              <View style={styles.buildingBlock3} />

              {/* Destination Marker */}
              <View style={[styles.markerPinBox, styles.destPinPos]}>
                <View style={styles.destPinBubble}>
                  <Text style={styles.destPinBubbleText}>📍 Wash Location (Bangsar)</Text>
                </View>
                <View style={styles.pinDotRed} />
              </View>

              {/* Route Path Line */}
              <View style={styles.routePathLine} />

              {/* Washer Live Marker */}
              <View style={[styles.markerPinBox, isArrived ? styles.washerArrivedPos : styles.washerEnRoutePos]}>
                <Text style={{ fontSize: 32 }}>🛵</Text>
                <View style={styles.washerBubbleTag}>
                  <Text style={styles.washerBubbleText}>Amir Hazim (Detailer)</Text>
                </View>
              </View>
            </View>
          </View>

          {/* WASHER & ORDER DETAILS CARD */}
          <View style={[styles.detailsCardPanel, isDesktop && styles.detailsFlex]}>
            
            {/* Detailer Profile Header */}
            <View style={styles.washerProfileRow}>
              <Image source={{ uri: SAMPLE_WASHER.avatarUrl }} style={styles.washerAvatarImage} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.washerName}>Amir Hazim</Text>
                  <View style={styles.ratingBadgePill}>
                    <Text style={styles.ratingBadgeText}>★ 4.95</Text>
                  </View>
                </View>
                <Text style={styles.washerVehicleText}>
                  Perodua Myvi • <Text style={styles.boldText}>VWB 8819</Text>
                </Text>
                <Text style={styles.equipmentText}>
                  🎒 Rig Mounted Eco-Wash Unit
                </Text>
              </View>
            </View>

            {/* Service Summary Box */}
            <View style={styles.summaryBox}>
              <Text style={styles.summaryHeaderTag}>ACTIVE ORDER SUMMARY</Text>
              
              <View style={styles.sumRow}>
                <Text style={styles.sumLabel}>Order ID:</Text>
                <Text style={styles.sumValue}>#{activeBooking?.id || 'MY-882194'}</Text>
              </View>

              <View style={styles.sumRow}>
                <Text style={styles.sumLabel}>Wash Package:</Text>
                <Text style={styles.sumValue}>{activeBooking?.service?.name || 'Interior + Exterior Eco Wash'}</Text>
              </View>

              <View style={styles.sumRow}>
                <Text style={styles.sumLabel}>Vehicle:</Text>
                <Text style={styles.sumValue}>{activeBooking?.vehicle?.plateNumber || 'VWB 8819'} ({activeBooking?.vehicle?.make || 'Perodua'} {activeBooking?.vehicle?.model || 'Myvi'})</Text>
              </View>

              <View style={styles.sumRow}>
                <Text style={styles.sumLabel}>Parking Bay:</Text>
                <Text style={styles.sumValue}>Jalan Telawi 3 • Bay B2-#45</Text>
              </View>

              <View style={styles.sumRow}>
                <Text style={styles.sumLabel}>Total Paid:</Text>
                <Text style={styles.totalPaidText}>RM {activeBooking?.totalMYR || 50}.00</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.chatActionBtn}
                onPress={() => router.push('/customer/messages')}
              >
                <Text style={styles.chatActionBtnText}>💬 Chat with Detailer</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.callActionBtn}
                onPress={() => alert('Calling Amir Hazim at +60 12-345 6789...')}
              >
                <Text style={styles.callActionBtnText}>📞 Call Detailer</Text>
              </TouchableOpacity>
            </View>

          </View>

        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  mainWrapper: {
    padding: spacing.lg,
    flex: 1,
  },
  mainWrapperDesktop: {
    maxWidth: 1360,
    alignSelf: 'center',
    width: '100%',
    paddingVertical: spacing.xl,
  },

  // Status Header
  statusHeaderBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceWhite,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.lg,
    ...shadows.medium,
  },
  statusHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  statusIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusIconCircleArrived: {
    backgroundColor: colors.successLight,
  },
  statusTitleText: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.brandNavy,
  },
  statusSubText: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  simBtn: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: borderRadius.md,
  },
  simBtnText: {
    color: colors.primaryDark,
    fontSize: 11,
    fontWeight: '900',
  },

  // Grid Layout
  gridContainer: {
    flexDirection: 'column',
    gap: spacing.lg,
    flex: 1,
  },
  gridContainerDesktop: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  mapFlex: {
    flex: 6,
  },
  detailsFlex: {
    flex: 4,
  },

  // Map Canvas
  mapContainerCard: {
    backgroundColor: '#cbd5e1',
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderMedium,
    minHeight: 380,
    ...shadows.medium,
  },
  mapGraphicCanvas: {
    flex: 1,
    backgroundColor: '#cbd5e1',
    position: 'relative',
  },
  roadH1: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    height: 36,
    backgroundColor: '#94a3b8',
  },
  roadH2: {
    position: 'absolute',
    top: '70%',
    left: 0,
    right: 0,
    height: 24,
    backgroundColor: '#94a3b8',
  },
  roadV1: {
    position: 'absolute',
    left: '45%',
    top: 0,
    bottom: 0,
    width: 36,
    backgroundColor: '#94a3b8',
  },
  buildingBlock1: {
    position: 'absolute',
    top: 20,
    left: 30,
    width: 120,
    height: 80,
    backgroundColor: '#64748b',
    borderRadius: 8,
  },
  buildingBlock2: {
    position: 'absolute',
    bottom: 30,
    right: 40,
    width: 140,
    height: 90,
    backgroundColor: '#64748b',
    borderRadius: 8,
  },
  buildingBlock3: {
    position: 'absolute',
    top: 30,
    right: 50,
    width: 100,
    height: 70,
    backgroundColor: '#64748b',
    borderRadius: 8,
  },

  markerPinBox: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 10,
  },
  destPinPos: {
    top: '35%',
    left: '20%',
  },
  destPinBubble: {
    backgroundColor: colors.brandNavy,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.pill,
    marginBottom: 4,
  },
  destPinBubbleText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
  pinDotRed: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#ef4444',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  routePathLine: {
    position: 'absolute',
    top: '42%',
    left: '26%',
    width: 220,
    height: 5,
    backgroundColor: colors.primaryBlue,
    borderRadius: 2.5,
    transform: [{ rotate: '20deg' }],
  },
  washerEnRoutePos: {
    top: '55%',
    left: '65%',
  },
  washerArrivedPos: {
    top: '38%',
    left: '24%',
  },
  washerBubbleTag: {
    backgroundColor: colors.successGreen,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.xs,
    marginTop: -4,
  },
  washerBubbleText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '900',
  },

  // Details Panel
  detailsCardPanel: {
    backgroundColor: colors.surfaceWhite,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.medium,
  },
  washerProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  washerAvatarImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: colors.primaryBlue,
  },
  washerName: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.brandNavy,
  },
  ratingBadgePill: {
    backgroundColor: colors.amberLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
  },
  ratingBadgeText: {
    color: colors.amberOffer,
    fontSize: 10,
    fontWeight: '900',
  },
  washerVehicleText: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  boldText: {
    fontWeight: '800',
    color: colors.textDark,
  },
  equipmentText: {
    fontSize: 11,
    color: colors.primaryDark,
    fontWeight: '700',
    marginTop: 2,
  },

  summaryBox: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: 8,
    marginBottom: spacing.lg,
  },
  summaryHeaderTag: {
    fontSize: 9,
    fontWeight: '900',
    color: colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  sumRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sumLabel: {
    fontSize: 11,
    color: colors.textMuted,
  },
  sumValue: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textDark,
  },
  totalPaidText: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.primaryBlue,
  },

  actionsRow: {
    flexDirection: 'column',
    gap: 10,
  },
  chatActionBtn: {
    backgroundColor: colors.primaryBlue,
    paddingVertical: 14,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    ...shadows.soft,
  },
  chatActionBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
  },
  callActionBtn: {
    backgroundColor: colors.primaryLight,
    paddingVertical: 14,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  callActionBtnText: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: '800',
  },
});
