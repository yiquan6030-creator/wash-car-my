import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useBooking } from '../context/BookingContext';
import { colors, borderRadius, shadows } from '../theme';

export default function DevModeSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const { activeBooking, currentRole, setRole, updateBookingStatus } = useBooking();
  const [isOpen, setIsOpen] = useState(false);

  const isWasherMode = pathname.startsWith('/washer') || currentRole === 'washer';

  const handleSwitchToCustomer = () => {
    setRole('customer');
    if (pathname.startsWith('/washer')) {
      router.replace('/customer');
    }
  };

  const handleSwitchToWasher = () => {
    setRole('washer');
    if (!pathname.startsWith('/washer')) {
      router.replace('/washer');
    }
  };

  return (
    <View style={styles.floatingWrapper}>
      {isOpen && (
        <View style={styles.drawerCard}>
          <View style={styles.drawerHeader}>
            <Text style={styles.devTag}>🛠️ DEV & SIMULATION TOOL</Text>
            <TouchableOpacity onPress={() => setIsOpen(false)}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {activeBooking && (
            <View style={styles.statusBox}>
              <Text style={styles.bookingStatusText}>
                Active Order: <Text style={styles.boldWhite}>#{activeBooking.id}</Text>
              </Text>
              <Text style={styles.statusBadgeText}>
                Status: <Text style={styles.statusGreen}>{activeBooking.status.toUpperCase()}</Text>
              </Text>

              {/* Status Simulation Buttons */}
              <View style={styles.simButtonsRow}>
                <TouchableOpacity
                  style={styles.simChip}
                  onPress={() => updateBookingStatus('on_the_way')}
                >
                  <Text style={styles.simChipText}>🛵 En Route</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.simChip}
                  onPress={() => updateBookingStatus('arrived')}
                >
                  <Text style={styles.simChipText}>📍 Arrived</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.simChip}
                  onPress={() => updateBookingStatus('washing')}
                >
                  <Text style={styles.simChipText}>🧼 Washing</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.simChipSuccess}
                  onPress={() => updateBookingStatus('completed')}
                >
                  <Text style={styles.simChipSuccessText}>✓ Complete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.toggleBar}>
            <TouchableOpacity
              style={[styles.toggleBtn, !isWasherMode && styles.toggleBtnActive]}
              onPress={handleSwitchToCustomer}
            >
              <Text style={[styles.toggleText, !isWasherMode && styles.toggleTextActive]}>
                👤 Customer
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toggleBtn, isWasherMode && styles.toggleBtnActiveWasher]}
              onPress={handleSwitchToWasher}
            >
              <Text style={[styles.toggleText, isWasherMode && styles.toggleTextActive]}>
                🛵 Washer Mode
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Floating Trigger Pill */}
      <TouchableOpacity
        style={styles.floatingTrigger}
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.9}
      >
        <Text style={styles.triggerIcon}>🛠️</Text>
        <Text style={styles.triggerText}>Dev Tools</Text>
        {activeBooking && <View style={styles.activeDot} />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingWrapper: {
    position: 'absolute',
    bottom: 70,
    right: 16,
    zIndex: 9999,
    alignItems: 'flex-end',
  },
  floatingTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0f172a',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: '#334155',
    ...shadows.medium,
  },
  triggerIcon: { fontSize: 13 },
  triggerText: { color: '#ffffff', fontSize: 11, fontWeight: '800' },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
  },

  drawerCard: {
    width: 300,
    backgroundColor: '#0f172a',
    borderRadius: borderRadius.lg,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
    ...shadows.medium,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  devTag: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  closeBtnText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '900',
  },

  statusBox: {
    backgroundColor: '#1e293b',
    padding: 10,
    borderRadius: borderRadius.md,
    marginBottom: 10,
  },
  bookingStatusText: {
    color: '#cbd5e1',
    fontSize: 11,
  },
  boldWhite: { color: '#ffffff', fontWeight: '800' },
  statusBadgeText: { color: '#94a3b8', fontSize: 11, marginTop: 2 },
  statusGreen: { color: '#34d399', fontWeight: '900' },

  simButtonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 8,
  },
  simChip: {
    backgroundColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.xs,
  },
  simChipText: { color: '#e2e8f0', fontSize: 10, fontWeight: '700' },
  simChipSuccess: {
    backgroundColor: colors.washerAccent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.xs,
  },
  simChipSuccessText: { color: '#ffffff', fontSize: 10, fontWeight: '900' },

  toggleBar: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: borderRadius.sm,
    padding: 3,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  toggleBtnActive: {
    backgroundColor: colors.primaryBlue,
  },
  toggleBtnActiveWasher: {
    backgroundColor: colors.washerAccent,
  },
  toggleText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
  },
  toggleTextActive: {
    color: '#ffffff',
    fontWeight: '900',
  },
});

