import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useBooking } from '../../src/context/BookingContext';
import { colors, spacing, borderRadius, shadows } from '../../src/theme';
import { SAMPLE_WASHER } from '../../src/services/mockData';

export default function WasherProfileScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { setRole } = useBooking();

  const isDesktop = width >= 1024;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={[styles.mainWrapper, isDesktop && styles.mainWrapperDesktop]}>

        {/* HEADER */}
        <View style={styles.headerBox}>
          <Text style={styles.pageTitle}>Detailer Rig & Account Profile 👤</Text>
          <Text style={styles.pageSubTitle}>Manage equipment setup, payout banking, and role switches.</Text>
        </View>

        {/* WASHER PROFILE CARD */}
        <View style={styles.profileCard}>
          <Image source={{ uri: SAMPLE_WASHER.avatarUrl }} style={styles.avatarImage} />
          <View style={{ flex: 1, marginLeft: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={styles.nameText}>{SAMPLE_WASHER.name}</Text>
              <View style={styles.proBadgePill}>
                <Text style={styles.proBadgeText}>VERIFIED PRO DETAILER</Text>
              </View>
            </View>
            <Text style={styles.phoneText}>📱 {SAMPLE_WASHER.phone} • KL & PJ Hub</Text>
            <Text style={styles.ratingText}>⭐ {SAMPLE_WASHER.rating.toFixed(2)} Rating ({SAMPLE_WASHER.completedJobsCount} completed washes)</Text>
          </View>
        </View>

        {/* ROLE SWITCH OPTION */}
        <TouchableOpacity 
          style={styles.switchRoleCard}
          onPress={() => {
            setRole('customer');
            router.replace('/customer');
          }}
          activeOpacity={0.9}
        >
          <View style={styles.switchIconBox}>
            <Text style={{ fontSize: 22 }}>👤</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.switchRoleTitle}>Switch to Customer App Mode</Text>
            <Text style={styles.switchRoleSub}>Switch view to Customer Car Wash Booking App & Shop.</Text>
          </View>
          <Text style={styles.switchChevron}>›</Text>
        </TouchableOpacity>

        {/* RIG & GEAR DETAILS */}
        <View style={styles.sectionHeaderBox}>
          <Text style={styles.sectionTitle}>Detailing Rig & Equipment Setup</Text>
        </View>

        <View style={styles.itemCard}>
          <Text style={styles.itemTitle}>🛵 Transport & Vehicle Rig</Text>
          <Text style={styles.itemSub}>{SAMPLE_WASHER.vehicleRig}</Text>
        </View>

        <View style={styles.itemCard}>
          <Text style={styles.itemTitle}>🧰 Equipped Mobile Gear</Text>
          <Text style={styles.itemSub}>
            • Portable Snow Foam Hose Kit{'\n'}
            • 100L Water Tank Mobile Rig{'\n'}
            • High-Powered Wet/Dry Vacuum{'\n'}
            • Eco Waterless Spray Kit{'\n'}
            • Ceramic Liquid Polish & Wax Protectant
          </Text>
        </View>

        {/* BANK ACCOUNT PAYOUT INFO */}
        <View style={styles.sectionHeaderBox}>
          <Text style={styles.sectionTitle}>Payout Bank Account</Text>
        </View>

        <View style={styles.itemCard}>
          <Text style={styles.itemTitle}>🏦 Bank Payout Account: Maybank</Text>
          <Text style={styles.itemSub}>Account #: ********8821 • Verified for Instant Direct Transfer</Text>
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

  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceWhite,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.medium,
  },
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: colors.washerAccent,
  },
  nameText: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.brandNavy,
  },
  phoneText: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.washerDark,
    marginTop: 2,
  },
  proBadgePill: {
    backgroundColor: colors.washerLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.xs,
  },
  proBadgeText: {
    color: colors.washerDark,
    fontSize: 9,
    fontWeight: '900',
  },

  switchRoleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.xxl,
    borderWidth: 1.5,
    borderColor: colors.primaryBlue,
    ...shadows.soft,
  },
  switchIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceWhite,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchRoleTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.primaryDark,
  },
  switchRoleSub: {
    fontSize: 11,
    color: colors.primaryDark,
    marginTop: 2,
  },
  switchChevron: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.primaryDark,
  },

  sectionHeaderBox: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.brandNavy,
  },

  itemCard: {
    backgroundColor: colors.surfaceWhite,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.soft,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.brandNavy,
  },
  itemSub: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
    lineHeight: 18,
  },
});
