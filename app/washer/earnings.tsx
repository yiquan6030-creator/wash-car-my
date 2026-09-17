import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useBooking } from '../../src/context/BookingContext';
import { colors, spacing, borderRadius, shadows } from '../../src/theme';

export default function WasherEarningsScreen() {
  const { width } = useWindowDimensions();
  const { washerTodayEarnings } = useBooking();
  const isDesktop = width >= 1024;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={[styles.mainWrapper, isDesktop && styles.mainWrapperDesktop]}>

        {/* HEADER */}
        <View style={styles.headerBox}>
          <Text style={styles.pageTitle}>Washer Wallet & Earnings 💰</Text>
          <Text style={styles.pageSubTitle}>Track daily payouts, tips, and direct bank transfers.</Text>
        </View>

        {/* MAIN WALLET BALANCE CARD */}
        <View style={styles.mainBalCard}>
          <Text style={styles.balHeader}>AVAILABLE WITHDRAWAL BALANCE</Text>
          <Text style={styles.balAmount}>RM {washerTodayEarnings.toFixed(2)}</Text>
          <Text style={styles.balSub}>Direct instant payout transfer to Maybank ***8821</Text>
          
          <TouchableOpacity 
            style={styles.withdrawBtn} 
            onPress={() => alert(`Initiated instant withdrawal of RM ${washerTodayEarnings.toFixed(2)} to Maybank account!`)}
            activeOpacity={0.9}
          >
            <Text style={styles.withdrawText}>Withdraw Payout Now →</Text>
          </TouchableOpacity>
        </View>

        {/* STATS OVERVIEW GRID */}
        <View style={styles.sectionHeaderBox}>
          <Text style={styles.sectionTitle}>Earnings Summary Overview</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>TODAY</Text>
            <Text style={styles.statValue}>RM {washerTodayEarnings.toFixed(0)}</Text>
            <Text style={styles.statSubText}>credited to balance</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>THIS WEEK</Text>
            <Text style={styles.statValue}>RM 420</Text>
            <Text style={styles.statSubText}>8 washes done</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>THIS MONTH</Text>
            <Text style={styles.statValue}>RM 1,850</Text>
            <Text style={styles.statSubText}>38 washes done</Text>
          </View>
        </View>

        {/* ITEMIZED CATEGORY BREAKDOWN */}
        <View style={styles.sectionHeaderBox}>
          <Text style={styles.sectionTitle}>Category Earnings Breakdown</Text>
        </View>

        <View style={styles.breakdownCard}>
          <View style={styles.breakRow}>
            <View style={styles.breakLeft}>
              <Text style={styles.breakIcon}>🧽</Text>
              <Text style={styles.breakLabel}>Mobile Wash & Detailing Jobs</Text>
            </View>
            <Text style={styles.breakValue}>RM 1,520.00</Text>
          </View>

          <View style={styles.breakRow}>
            <View style={styles.breakLeft}>
              <Text style={styles.breakIcon}>📦</Text>
              <Text style={styles.breakLabel}>Car-Care Product Deliveries</Text>
            </View>
            <Text style={styles.breakValue}>RM 180.00</Text>
          </View>

          <View style={styles.breakRow}>
            <View style={styles.breakLeft}>
              <Text style={styles.breakIcon}>🎁</Text>
              <Text style={styles.breakLabel}>Peak Hour Incentives & Quota Bonuses</Text>
            </View>
            <Text style={styles.breakValue}>RM 90.00</Text>
          </View>

          <View style={styles.breakRow}>
            <View style={styles.breakLeft}>
              <Text style={styles.breakIcon}>⭐</Text>
              <Text style={styles.breakLabel}>Direct Customer Tips</Text>
            </View>
            <Text style={styles.breakValue}>RM 60.00</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.breakRowTotal}>
            <Text style={styles.totalLabel}>Total Earned This Month:</Text>
            <Text style={styles.totalValue}>RM 1,850.00</Text>
          </View>
        </View>

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
    maxWidth: 960,
    alignSelf: 'center',
    width: '100%',
    paddingVertical: spacing.xl,
  },

  headerBox: {
    marginBottom: spacing.lg,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.brandNavy,
  },
  pageSubTitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },

  mainBalCard: {
    backgroundColor: colors.brandNavy,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.xxl,
    ...shadows.medium,
  },
  balHeader: {
    color: colors.primaryLight,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  balAmount: {
    color: '#ffffff',
    fontSize: 34,
    fontWeight: '900',
    marginVertical: 6,
  },
  balSub: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 16,
  },
  withdrawBtn: {
    backgroundColor: colors.washerAccent,
    paddingVertical: 14,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    ...shadows.soft,
  },
  withdrawText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 14,
  },

  sectionHeaderBox: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.brandNavy,
  },

  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  statCard: {
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
  statValue: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.washerDark,
    marginTop: 4,
  },
  statSubText: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },

  breakdownCard: {
    backgroundColor: colors.surfaceWhite,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.soft,
  },
  breakRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  breakLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breakIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  breakLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textDark,
  },
  breakValue: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.textDark,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 10,
  },
  breakRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.brandNavy,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.washerDark,
  },
});
