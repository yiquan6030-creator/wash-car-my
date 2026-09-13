import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useBooking } from '../../src/context/BookingContext';
import { colors, spacing, borderRadius } from '../../src/theme';
import { SAMPLE_WASHER } from '../../src/services/mockData';

export default function WasherProfileScreen() {
  const router = useRouter();
  const { setRole } = useBooking();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.pageTitle}>Washer Profile 👤</Text>

      {/* Driver Info Card */}
      <View style={styles.profileCard}>
        <Image source={{ uri: SAMPLE_WASHER.avatarUrl }} style={styles.avatar} />
        <View style={{ flex: 1, marginLeft: 14 }}>
          <Text style={styles.name}>{SAMPLE_WASHER.name}</Text>
          <Text style={styles.phone}>📱 {SAMPLE_WASHER.phone}</Text>
          <Text style={styles.rating}>⭐ {SAMPLE_WASHER.rating.toFixed(2)} / 5.0 ({SAMPLE_WASHER.completedJobsCount} washes)</Text>
          <View style={styles.proBadge}><Text style={styles.proText}>VERIFIED PRO DETAILER</Text></View>
        </View>
      </View>

      {/* Role Switch Option */}
      <TouchableOpacity 
        style={styles.switchRoleCard}
        onPress={() => {
          setRole('customer');
          router.replace('/customer');
        }}
      >
        <Text style={styles.switchRoleTitle}>👤 Switch to Customer App Mode</Text>
        <Text style={styles.switchRoleSub}>Switch view to Customer Car Wash Booking App & Shop.</Text>
      </TouchableOpacity>

      {/* Rig & Gear Details */}
      <Text style={styles.sectionTitle}>Detailing Rig & Equipment</Text>
      <View style={styles.itemCard}>
        <Text style={styles.itemTitle}>🛵 Transport / Rig</Text>
        <Text style={styles.itemSub}>{SAMPLE_WASHER.vehicleRig}</Text>
      </View>

      <View style={styles.itemCard}>
        <Text style={styles.itemTitle}>🧰 Equipped Gear</Text>
        <Text style={styles.itemSub}>
          • Portable Snow Foam Hose{'\n'}
          • 100L Water Tank Rig{'\n'}
          • High-Powered Wet/Dry Vacuum{'\n'}
          • Eco Waterless Spray Kit{'\n'}
          • Ceramic Liquid Polish Protectant
        </Text>
      </View>

      {/* Bank Account Payout Info */}
      <Text style={styles.sectionTitle}>Payout Account</Text>
      <View style={styles.itemCard}>
        <Text style={styles.itemTitle}>🏦 Bank Payout Account: Maybank</Text>
        <Text style={styles.itemSub}>Account #: ********8821 • Verified for Instant Transfer</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundLight },
  content: { padding: spacing.lg, paddingBottom: 40 },
  pageTitle: { fontSize: 22, fontWeight: '900', color: colors.textDark, marginBottom: spacing.lg },
  profileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: borderRadius.xl, padding: spacing.lg, marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.borderLight },
  avatar: { width: 56, height: 56, borderRadius: 28 },
  name: { fontSize: 17, fontWeight: '900', color: colors.textDark },
  phone: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  rating: { fontSize: 12, fontWeight: '800', color: colors.successDark, marginTop: 2 },
  proBadge: { backgroundColor: colors.successLight, paddingHorizontal: 8, paddingVertical: 2, borderRadius: borderRadius.sm, alignSelf: 'flex-start', marginTop: 4 },
  proText: { color: colors.successDark, fontSize: 9, fontWeight: '900' },
  switchRoleCard: { backgroundColor: colors.primaryLight, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.xl, borderWidth: 1, borderColor: '#7dd3fc' },
  switchRoleTitle: { fontSize: 14, fontWeight: '900', color: colors.primaryDark },
  switchRoleSub: { fontSize: 11, color: colors.primaryDark, marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.textDark, marginBottom: spacing.md },
  itemCard: { backgroundColor: '#ffffff', borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.borderLight },
  itemTitle: { fontSize: 14, fontWeight: '800', color: colors.textDark },
  itemSub: { fontSize: 12, color: colors.textMuted, marginTop: 4, lineHeight: 18 },
});
