import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useBooking } from '../../src/context/BookingContext';
import { colors, spacing, borderRadius, shadows } from '../../src/theme';
import { SAMPLE_WASHER } from '../../src/services/mockData';

export default function WasherHomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { 
    isWasherOnline, setIsWasherOnline, 
    washerTodayEarnings, washerCompletedJobsCount, 
    activeBooking, updateBookingStatus, t
  } = useBooking();

  const isDesktop = width >= 1024;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={[styles.mainWrapper, isDesktop && styles.mainWrapperDesktop]}>

        {/* DUTY STATUS & PROFILE BAR */}
        <View style={styles.dutyCard}>
          <View style={styles.driverInfo}>
            <Image source={{ uri: SAMPLE_WASHER.avatarUrl }} style={styles.avatarImage} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.driverName}>{SAMPLE_WASHER.name}</Text>
                <View style={styles.proBadgeTag}>
                  <Text style={styles.proBadgeText}>PRO DETAILER PARTNER</Text>
                </View>
              </View>
              <Text style={styles.dutyStatusText}>
                {isWasherOnline ? t('washerStatusOnline') : t('washerStatusOffline')}
              </Text>
            </View>
          </View>

          <Switch
            value={isWasherOnline}
            onValueChange={setIsWasherOnline}
            trackColor={{ false: '#cbd5e1', true: '#86efac' }}
            thumbColor={isWasherOnline ? colors.washerAccent : '#94a3b8'}
          />
        </View>

        {/* TODAY STATS SUMMARY DASHBOARD */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>{t('todayEarnings').toUpperCase()}</Text>
            <Text style={styles.statValueRM}>RM {washerTodayEarnings.toFixed(0)}</Text>
            <Text style={styles.statSub}>credited to wallet</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statLabel}>{t('completedJobs').toUpperCase()}</Text>
            <Text style={styles.statValueNum}>{washerCompletedJobsCount}</Text>
            <Text style={styles.statSub}>washes done today</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statLabel}>CUSTOMER RATING</Text>
            <Text style={styles.statValueRating}>⭐ {SAMPLE_WASHER.rating.toFixed(2)}</Text>
            <Text style={styles.statSub}>142 total reviews</Text>
          </View>
        </View>

        {/* ACTIVE ACCEPTED JOB WORKBENCH */}
        <View style={styles.sectionHeaderBox}>
          <Text style={styles.sectionTitle}>Active Wash Job Workbench</Text>
          <Text style={styles.sectionSubTitle}>Manage live customer appointment and update status.</Text>
        </View>

        {activeBooking ? (
          <View style={styles.currentJobCard}>
            <View style={styles.jobHeaderRow}>
              <View style={styles.jobTagPill}>
                <Text style={styles.jobTagText}>JOB #{activeBooking.id}</Text>
              </View>
              <View style={styles.statusPill}>
                <Text style={styles.statusPillText}>{activeBooking.status.toUpperCase()}</Text>
              </View>
            </View>

            <Text style={styles.custNameText}>Customer: Lee Wei Jian</Text>
            <Text style={styles.detailLine}>📍 Location: <Text style={styles.boldText}>{activeBooking.location.addressLine1}, {activeBooking.location.city}</Text></Text>
            <Text style={styles.detailLine}>🏢 Parking: <Text style={styles.boldText}>{activeBooking.location.condoBuildingName || 'Bangsar Telawi'} ({activeBooking.location.unitParkingBay || 'Bay B2-#45'})</Text></Text>
            <Text style={styles.detailLine}>🚗 Vehicle: <Text style={styles.boldText}>{activeBooking.vehicle.plateNumber}</Text> ({activeBooking.vehicle.make} {activeBooking.vehicle.model})</Text>
            <Text style={styles.detailLine}>✨ Service: <Text style={styles.boldText}>{activeBooking.service.name}</Text> (Payout: RM {activeBooking.totalMYR})</Text>
            
            {activeBooking.location.notesForWasher && (
              <View style={styles.notesBox}>
                <Text style={styles.notesText}>📝 Customer Note: "{activeBooking.location.notesForWasher}"</Text>
              </View>
            )}

            {/* Quick Action Navigation & Chat Buttons */}
            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.navBtn} onPress={() => alert(`Opening GPS navigation to ${activeBooking.location.addressLine1}...`)}>
                <Text style={styles.navBtnText}>🧭 Navigate Map</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.chatBtn} onPress={() => router.push('/washer/messages')}>
                <Text style={styles.chatBtnText}>💬 Chat</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.callBtn} onPress={() => alert('Calling Lee Wei Jian at +60 12-345 6789...')}>
                <Text style={styles.callBtnText}>📞 Call Customer</Text>
              </TouchableOpacity>
            </View>

            {/* WORKFLOW PROGRESSION BUTTONS */}
            <View style={styles.workflowBox}>
              <Text style={styles.workflowHeader}>WORKFLOW ACTION STEP:</Text>
              
              {activeBooking.status === 'assigned' || activeBooking.status === 'on_the_way' ? (
                <TouchableOpacity 
                  style={styles.actionBtnSuccess} 
                  onPress={() => updateBookingStatus('arrived')}
                  activeOpacity={0.9}
                >
                  <Text style={styles.actionBtnText}>Mark Arrived at Parking Bay ↓</Text>
                </TouchableOpacity>
              ) : null}

              {activeBooking.status === 'arrived' ? (
                <TouchableOpacity 
                  style={styles.actionBtnPrimary} 
                  onPress={() => updateBookingStatus('washing')}
                  activeOpacity={0.9}
                >
                  <Text style={styles.actionBtnText}>Start Eco-Wash & Inspection ↓</Text>
                </TouchableOpacity>
              ) : null}

              {activeBooking.status === 'washing' ? (
                <TouchableOpacity 
                  style={styles.actionBtnSuccess} 
                  onPress={() => updateBookingStatus('completed')}
                  activeOpacity={0.9}
                >
                  <Text style={styles.actionBtnText}>Finish Wash & Complete Payout ↓</Text>
                </TouchableOpacity>
              ) : null}

              {activeBooking.status === 'completed' ? (
                <View style={styles.completedBadgeBox}>
                  <Text style={styles.completedBadgeText}>✓ WASH COMPLETED & RM {activeBooking.totalMYR} CREDITED TO WALLET!</Text>
                </View>
              ) : null}
            </View>
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={{ fontSize: 32, marginBottom: 8 }}>💼</Text>
            <Text style={styles.emptyText}>No active job right now. Toggle online status above to receive nearby job requests.</Text>
          </View>
        )}

        {/* Shortcut to Available Jobs */}
        <TouchableOpacity style={styles.checkJobsBtn} onPress={() => router.push('/washer/jobs')} activeOpacity={0.9}>
          <Text style={styles.checkJobsText}>View Available Wash Jobs Nearby →</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  scrollContent: {
    paddingBottom: 60,
  },
  mainWrapper: {
    padding: spacing.lg,
  },
  mainWrapperDesktop: {
    maxWidth: 1100,
    alignSelf: 'center',
    width: '100%',
    paddingVertical: spacing.xl,
  },

  dutyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceWhite,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.medium,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: colors.washerAccent,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.brandNavy,
  },
  proBadgeTag: {
    backgroundColor: colors.washerLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
  },
  proBadgeText: {
    color: colors.washerDark,
    fontSize: 9,
    fontWeight: '900',
  },
  dutyStatusText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.washerDark,
    marginTop: 2,
  },

  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.surfaceWhite,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
    ...shadows.soft,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: colors.textMuted,
    letterSpacing: 0.6,
  },
  statValueRM: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.washerDark,
    marginTop: 4,
  },
  statValueNum: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.brandNavy,
    marginTop: 4,
  },
  statValueRating: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.amberOffer,
    marginTop: 4,
  },
  statSub: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },

  sectionHeaderBox: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.brandNavy,
  },
  sectionSubTitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },

  currentJobCard: {
    backgroundColor: colors.surfaceWhite,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: colors.washerAccent,
    ...shadows.medium,
  },
  jobHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  jobTagPill: {
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.xs,
  },
  jobTagText: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.brandNavy,
  },
  statusPill: {
    backgroundColor: colors.washerLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.pill,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.washerDark,
  },

  custNameText: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.brandNavy,
    marginBottom: 8,
  },
  detailLine: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 4,
  },
  boldText: {
    fontWeight: '800',
    color: colors.textDark,
  },
  notesBox: {
    backgroundColor: colors.amberLight,
    padding: 10,
    borderRadius: borderRadius.md,
    marginTop: 6,
    marginBottom: 8,
  },
  notesText: {
    fontSize: 11,
    color: '#92400e',
    fontWeight: '700',
  },

  btnRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 14,
  },
  navBtn: {
    flex: 2,
    backgroundColor: colors.brandNavy,
    paddingVertical: 12,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  navBtnText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 12,
  },
  chatBtn: {
    flex: 1,
    backgroundColor: colors.primaryLight,
    paddingVertical: 12,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  chatBtnText: {
    color: colors.primaryDark,
    fontWeight: '800',
    fontSize: 12,
  },
  callBtn: {
    flex: 1,
    backgroundColor: colors.surfaceElevated,
    paddingVertical: 12,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  callBtnText: {
    color: colors.textDark,
    fontWeight: '800',
    fontSize: 12,
  },

  workflowBox: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 12,
  },
  workflowHeader: {
    fontSize: 9,
    fontWeight: '900',
    color: colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  actionBtnSuccess: {
    backgroundColor: colors.washerAccent,
    paddingVertical: 14,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    ...shadows.soft,
  },
  actionBtnPrimary: {
    backgroundColor: colors.primaryBlue,
    paddingVertical: 14,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    ...shadows.soft,
  },
  actionBtnText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 14,
  },
  completedBadgeBox: {
    backgroundColor: colors.washerLight,
    paddingVertical: 14,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  completedBadgeText: {
    color: colors.washerDark,
    fontWeight: '900',
    fontSize: 13,
  },

  emptyCard: {
    backgroundColor: colors.surfaceWhite,
    padding: spacing.xxl,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.soft,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  checkJobsBtn: {
    backgroundColor: colors.washerAccent,
    paddingVertical: 16,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    ...shadows.medium,
  },
  checkJobsText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 15,
  },
});
