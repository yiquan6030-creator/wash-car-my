import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useBooking } from '../../src/context/BookingContext';
import { colors, spacing, borderRadius } from '../../src/theme';
import { SAMPLE_WASHER } from '../../src/services/mockData';

export default function WasherHomeScreen() {
  const router = useRouter();
  const { 
    isWasherOnline, setIsWasherOnline, 
    washerTodayEarnings, washerCompletedJobsCount, 
    activeBooking, updateBookingStatus 
  } = useBooking();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 1. TOP SECTION: ONLINE / OFFLINE TOGGLE */}
      <View style={styles.dutyCard}>
        <View style={styles.driverInfo}>
          <Image source={{ uri: SAMPLE_WASHER.avatarUrl }} style={styles.avatar} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.driverName}>{SAMPLE_WASHER.name}</Text>
            <Text style={styles.dutyStatusText}>
              {isWasherOnline ? '🟢 You’re Online' : '🔴 You’re Offline'}
            </Text>
          </View>
        </View>

        <Switch
          value={isWasherOnline}
          onValueChange={setIsWasherOnline}
          trackColor={{ false: '#cbd5e1', true: '#86efac' }}
          thumbColor={isWasherOnline ? '#16a34a' : '#94a3b8'}
        />
      </View>

      {/* 2. TODAY STATS SUMMARY */}
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>TODAY</Text>
          <Text style={styles.statValueRM}>RM{washerTodayEarnings.toFixed(0)}</Text>
          <Text style={styles.statSub}>earned</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>JOBS</Text>
          <Text style={styles.statValueNum}>{washerCompletedJobsCount}</Text>
          <Text style={styles.statSub}>completed</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>RATING</Text>
          <Text style={styles.statValueRating}>⭐ {SAMPLE_WASHER.rating.toFixed(2)}</Text>
          <Text style={styles.statSub}>customer score</Text>
        </View>
      </View>

      {/* 3. CURRENT JOB WORKFLOW */}
      <Text style={styles.sectionTitle}>Active Accepted Job</Text>

      {activeBooking ? (
        <View style={styles.currentJobCard}>
          <View style={styles.jobHeaderRow}>
            <Text style={styles.jobTag}>CURRENT JOB #{activeBooking.id}</Text>
            <Text style={styles.jobStatusTag}>{activeBooking.status.toUpperCase()}</Text>
          </View>

          <Text style={styles.custName}>Customer: {activeBooking.location.label || 'Lee Wei Jian'}</Text>
          <Text style={styles.detailLine}>📍 Location: <Text style={styles.boldText}>{activeBooking.location.addressLine1}, {activeBooking.location.city}</Text></Text>
          <Text style={styles.detailLine}>🚗 Vehicle: <Text style={styles.boldText}>{activeBooking.vehicle.plateNumber}</Text> ({activeBooking.vehicle.make} {activeBooking.vehicle.model})</Text>
          <Text style={styles.detailLine}>✨ Service: <Text style={styles.boldText}>{activeBooking.service.name}</Text></Text>
          {activeBooking.location.notesForWasher && (
            <Text style={styles.notesText}>📝 Notes: "{activeBooking.location.notesForWasher}"</Text>
          )}

          {/* Quick Action Navigation & Chat Buttons */}
          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.navBtn} onPress={() => alert(`Opening GPS navigation to ${activeBooking.location.addressLine1}...`)}>
              <Text style={styles.navBtnText}>🧭 Navigate</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.chatBtn} onPress={() => router.push('/washer/messages')}>
              <Text style={styles.chatBtnText}>💬 Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.chatBtn} onPress={() => alert('Calling customer...')}>
              <Text style={styles.chatBtnText}>📞 Call</Text>
            </TouchableOpacity>
          </View>

          {/* LARGE WORKFLOW BUTTONS */}
          <View style={styles.workflowBox}>
            <Text style={styles.workflowHeader}>WORKFLOW ACTIONS:</Text>
            
            {activeBooking.status === 'assigned' || activeBooking.status === 'on_the_way' ? (
              <TouchableOpacity 
                style={styles.actionBtnSuccess} 
                onPress={() => updateBookingStatus('arrived')}
              >
                <Text style={styles.actionBtnText}>Arrived at Location ↓</Text>
              </TouchableOpacity>
            ) : null}

            {activeBooking.status === 'arrived' ? (
              <TouchableOpacity 
                style={styles.actionBtnPrimary} 
                onPress={() => router.push('/washer/jobs')}
              >
                <Text style={styles.actionBtnText}>Perform Inspection & Start Wash ↓</Text>
              </TouchableOpacity>
            ) : null}

            {activeBooking.status === 'washing' ? (
              <TouchableOpacity 
                style={styles.actionBtnSuccess} 
                onPress={() => updateBookingStatus('completed')}
              >
                <Text style={styles.actionBtnText}>Finish Wash & Upload Photo ↓</Text>
              </TouchableOpacity>
            ) : null}

            {activeBooking.status === 'completed' ? (
              <View style={styles.completedBadgeBox}>
                <Text style={styles.completedBadgeText}>✓ JOB COMPLETED & PAYOUT CREDITED!</Text>
              </View>
            ) : null}
          </View>
        </View>
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No active job right now. Check "Jobs" tab for incoming requests.</Text>
        </View>
      )}

      {/* Shortcut to New Job Request Alert */}
      <TouchableOpacity style={styles.checkJobsBtn} onPress={() => router.push('/washer/jobs')}>
        <Text style={styles.checkJobsText}>View New Wash Requests →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundLight },
  content: { padding: spacing.lg, paddingBottom: 40 },
  dutyCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: borderRadius.xl, padding: spacing.lg, marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.borderLight },
  driverInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  driverName: { fontSize: 16, fontWeight: '900', color: colors.textDark },
  dutyStatusText: { fontSize: 12, fontWeight: '800', color: colors.successGreen, marginTop: 1 },

  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xl },
  statBox: { width: '31%', backgroundColor: '#ffffff', borderRadius: borderRadius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.borderLight, alignItems: 'center' },
  statLabel: { fontSize: 9, fontWeight: '900', color: colors.textMuted, letterSpacing: 0.5 },
  statValueRM: { fontSize: 18, fontWeight: '900', color: colors.successGreen, marginTop: 2 },
  statValueNum: { fontSize: 20, fontWeight: '900', color: colors.textDark, marginTop: 2 },
  statValueRating: { fontSize: 16, fontWeight: '900', color: colors.amberOffer, marginTop: 4 },
  statSub: { fontSize: 10, color: colors.textMuted, marginTop: 1 },

  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.textDark, marginBottom: spacing.md },
  currentJobCard: { backgroundColor: '#ffffff', borderRadius: borderRadius.xl, padding: spacing.lg, marginBottom: spacing.lg, borderWidth: 2, borderColor: colors.successGreen },
  jobHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  jobTag: { fontSize: 11, fontWeight: '900', color: colors.primaryDark },
  jobStatusTag: { fontSize: 11, fontWeight: '900', color: colors.successGreen },
  custName: { fontSize: 15, fontWeight: '900', color: colors.textDark, marginBottom: 6 },
  detailLine: { fontSize: 13, color: colors.textDark, marginBottom: 4 },
  boldText: { fontWeight: '800' },
  notesText: { fontSize: 12, color: colors.amberOffer, fontStyle: 'italic', marginTop: 4 },
  btnRow: { flexDirection: 'row', gap: 8, marginVertical: 12 },
  navBtn: { flex: 2, backgroundColor: colors.brandNavy, paddingVertical: 10, borderRadius: borderRadius.md, alignItems: 'center' },
  navBtnText: { color: '#ffffff', fontWeight: '800', fontSize: 12 },
  chatBtn: { flex: 1, backgroundColor: colors.primaryLight, paddingVertical: 10, borderRadius: borderRadius.md, alignItems: 'center' },
  chatBtnText: { color: colors.primaryDark, fontWeight: '800', fontSize: 12 },
  workflowBox: { borderTopWidth: 1, borderTopColor: colors.borderLight, paddingTop: 10 },
  workflowHeader: { fontSize: 9, fontWeight: '900', color: colors.textMuted, letterSpacing: 0.5, marginBottom: 8 },
  actionBtnSuccess: { backgroundColor: colors.successGreen, paddingVertical: 14, borderRadius: borderRadius.md, alignItems: 'center' },
  actionBtnPrimary: { backgroundColor: colors.primaryBlue, paddingVertical: 14, borderRadius: borderRadius.md, alignItems: 'center' },
  actionBtnText: { color: '#ffffff', fontWeight: '900', fontSize: 14 },
  completedBadgeBox: { backgroundColor: colors.successLight, paddingVertical: 12, borderRadius: borderRadius.md, alignItems: 'center' },
  completedBadgeText: { color: colors.successDark, fontWeight: '900', fontSize: 13 },
  emptyCard: { backgroundColor: '#ffffff', padding: 20, borderRadius: borderRadius.lg, marginBottom: spacing.lg, alignItems: 'center' },
  emptyText: { color: colors.textMuted, fontSize: 13, textAlign: 'center' },
  checkJobsBtn: { backgroundColor: colors.successGreen, paddingVertical: 14, borderRadius: borderRadius.lg, alignItems: 'center' },
  checkJobsText: { color: '#ffffff', fontWeight: '900', fontSize: 15 },
});
