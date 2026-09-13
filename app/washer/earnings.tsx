import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useBooking } from '../../src/context/BookingContext';
import { colors, spacing, borderRadius } from '../../src/theme';

export default function WasherEarningsScreen() {
  const { washerTodayEarnings } = useBooking();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.pageTitle}>Washer Earnings 💰</Text>

      {/* Main Balance Card */}
      <View style={styles.mainBalCard}>
        <Text style={styles.balHeader}>AVAILABLE WITHDRAWAL BALANCE</Text>
        <Text style={styles.balAmount}>RM {washerTodayEarnings.toFixed(2)}</Text>
        <Text style={styles.balSub}>Direct instant payout transfer to Maybank ***8821</Text>
        
        <TouchableOpacity 
          style={styles.withdrawBtn} 
          onPress={() => alert(`Initiated instant withdrawal of RM ${washerTodayEarnings.toFixed(2)} to Maybank account!`)}
        >
          <Text style={styles.withdrawText}>Withdraw Payout Now →</Text>
        </TouchableOpacity>
      </View>

      {/* Earnings Overview Grid (Today, Week, Month) */}
      <Text style={styles.sectionTitle}>Earnings Summary Overview</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>TODAY</Text>
          <Text style={styles.statValue}>RM {washerTodayEarnings.toFixed(0)}</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>THIS WEEK</Text>
          <Text style={styles.statValue}>RM 420</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>THIS MONTH</Text>
          <Text style={styles.statValue}>RM 1,850</Text>
        </View>
      </View>

      {/* Itemized Category Breakdown */}
      <Text style={styles.sectionTitle}>Category Earnings Breakdown</Text>
      <View style={styles.breakdownCard}>
        <View style={styles.breakRow}>
          <View style={styles.breakLeft}><Text style={styles.breakIcon}>🧽</Text><Text style={styles.breakLabel}>Wash Jobs</Text></View>
          <Text style={styles.breakValue}>RM 1,520.00</Text>
        </View>

        <View style={styles.breakRow}>
          <View style={styles.breakLeft}><Text style={styles.breakIcon}>📦</Text><Text style={styles.breakLabel}>Delivery Jobs</Text></View>
          <Text style={styles.breakValue}>RM 180.00</Text>
        </View>

        <View style={styles.breakRow}>
          <View style={styles.breakLeft}><Text style={styles.breakIcon}>🎁</Text><Text style={styles.breakLabel}>Bonuses & Quotas</Text></View>
          <Text style={styles.breakValue}>RM 90.00</Text>
        </View>

        <View style={styles.breakRow}>
          <View style={styles.breakLeft}><Text style={styles.breakIcon}>⭐</Text><Text style={styles.breakLabel}>Customer Tips</Text></View>
          <Text style={styles.breakValue}>RM 60.00</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.breakRow}>
          <Text style={styles.totalLabel}>Total Earned This Month:</Text>
          <Text style={styles.totalValue}>RM 1,850.00</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundLight },
  content: { padding: spacing.lg, paddingBottom: 40 },
  pageTitle: { fontSize: 22, fontWeight: '900', color: colors.textDark, marginBottom: spacing.lg },
  mainBalCard: { backgroundColor: colors.brandNavy, borderRadius: borderRadius.xl, padding: spacing.xl, marginBottom: spacing.xl },
  balHeader: { color: colors.primaryLight, fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
  balAmount: { color: '#ffffff', fontSize: 32, fontWeight: '900', marginVertical: 4 },
  balSub: { color: '#94a3b8', fontSize: 11, marginBottom: 14 },
  withdrawBtn: { backgroundColor: colors.successGreen, paddingVertical: 12, borderRadius: borderRadius.md, alignItems: 'center' },
  withdrawText: { color: '#ffffff', fontWeight: '900', fontSize: 14 },

  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.textDark, marginBottom: spacing.md },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xl },
  statCard: { width: '31%', backgroundColor: '#ffffff', borderRadius: borderRadius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.borderLight, alignItems: 'center' },
  statLabel: { fontSize: 9, fontWeight: '900', color: colors.textMuted, letterSpacing: 0.5 },
  statValue: { fontSize: 17, fontWeight: '900', color: colors.successGreen, marginTop: 4 },

  breakdownCard: { backgroundColor: '#ffffff', borderRadius: borderRadius.xl, padding: spacing.lg, borderWidth: 1, borderColor: colors.borderLight },
  breakRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  breakLeft: { flexDirection: 'row', alignItems: 'center' },
  breakIcon: { fontSize: 18, marginRight: 10 },
  breakLabel: { fontSize: 13, fontWeight: '700', color: colors.textDark },
  breakValue: { fontSize: 14, fontWeight: '900', color: colors.textDark },
  divider: { height: 1, backgroundColor: colors.borderLight, marginVertical: 8 },
  totalLabel: { fontSize: 14, fontWeight: '900', color: colors.textDark },
  totalValue: { fontSize: 18, fontWeight: '900', color: colors.successGreen },
});
