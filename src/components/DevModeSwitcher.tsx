import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useBooking } from '../context/BookingContext';

export default function DevModeSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const { activeBooking, currentRole, setRole } = useBooking();

  const isWasherMode = pathname.startsWith('/washer') || currentRole === 'washer';

  const handleSwitchToCustomer = () => {
    setRole('customer');
    if (pathname.startsWith('/washer')) {
      router.replace('/');
    }
  };

  const handleSwitchToWasher = () => {
    setRole('washer');
    if (!pathname.startsWith('/washer')) {
      router.replace('/washer');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.devTag}>🛠️ DEV MODE SWITCHER</Text>
        {activeBooking && (
          <Text style={styles.bookingStatus}>
            Job #{activeBooking.id}: <Text style={styles.statusText}>{activeBooking.status.toUpperCase()}</Text>
          </Text>
        )}
      </View>

      <View style={styles.toggleBar}>
        <TouchableOpacity
          style={[styles.toggleBtn, !isWasherMode && styles.toggleBtnActive]}
          onPress={handleSwitchToCustomer}
        >
          <Text style={[styles.toggleText, !isWasherMode && styles.toggleTextActive]}>
            👤 Customer Mode
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggleBtn, isWasherMode && styles.toggleBtnActiveWasher]}
          onPress={handleSwitchToWasher}
        >
          <Text style={[styles.toggleText, isWasherMode && styles.toggleTextActive]}>
            🚗 Car Washer Mode
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  devTag: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  bookingStatus: {
    color: '#94a3b8',
    fontSize: 10,
  },
  statusText: {
    color: '#4ade80',
    fontWeight: '800',
  },
  toggleBar: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 3,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  toggleBtnActive: {
    backgroundColor: '#0284c7',
  },
  toggleBtnActiveWasher: {
    backgroundColor: '#16a34a',
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8',
  },
  toggleTextActive: {
    color: '#ffffff',
  },
});
