import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useBooking } from '../../src/context/BookingContext';
import { colors, spacing, borderRadius, shadows } from '../../src/theme';

export default function WasherJobsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { updateBookingStatus, deliveryJobs, acceptDeliveryJob } = useBooking();

  const isDesktop = width >= 1024;

  const handleAcceptWash = () => {
    updateBookingStatus('assigned');
    alert('Wash Request Accepted! Navigating to job execution.');
    router.replace('/washer');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={[styles.mainWrapper, isDesktop && styles.mainWrapperDesktop]}>

        {/* PAGE TITLE */}
        <View style={styles.headerBox}>
          <Text style={styles.pageTitle}>Available Dispatch Requests 💼</Text>
          <Text style={styles.pageSubTitle}>Accept nearby mobile car wash and product delivery opportunities.</Text>
        </View>

        {/* NEW WASH REQUEST ALERT CARD */}
        <View style={styles.alertCard}>
          <View style={styles.alertHeader}>
            <View style={styles.badgeRow}>
              <Text style={styles.alertTitle}>⚡ INCOMING WASH REQUEST</Text>
            </View>
            <View style={styles.timerBadge}>
              <Text style={styles.timerText}>⏳ 28s remaining</Text>
            </View>
          </View>

          <View style={styles.payoutRow}>
            <Text style={styles.payoutLabel}>WASHER PAYOUT:</Text>
            <Text style={styles.payoutValue}>RM 38.40 MYR</Text>
          </View>

          <View style={styles.detailGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailKey}>Service Package:</Text>
              <Text style={styles.detailVal}>Interior + Exterior Eco Wash</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailKey}>Distance from Rig:</Text>
              <Text style={styles.detailVal}>2.1 km away (~6 mins ride)</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailKey}>Customer Address:</Text>
              <Text style={styles.detailVal}>Bangsar Telawi 3 (Bay B2-#45)</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailKey}>Vehicle Model:</Text>
              <Text style={styles.detailVal}>Perodua Myvi (Hatchback • VWB 8819)</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailKey}>Estimated Duration:</Text>
              <Text style={styles.detailVal}>45 mins</Text>
            </View>
          </View>

          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.declineBtn} onPress={() => alert('Wash Request Declined')}>
              <Text style={styles.declineText}>Decline</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.acceptBtn} onPress={handleAcceptWash} activeOpacity={0.9}>
              <Text style={styles.acceptText}>Accept Wash Job (RM 38.40) →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* PRODUCT DELIVERY OPPORTUNITIES */}
        <View style={styles.sectionHeaderBox}>
          <Text style={styles.sectionTitle}>Car-Care Delivery Opportunities 📦</Text>
          <Text style={styles.sectionSub}>Earn extra money by delivering WashCar MY detailing products on your route.</Text>
        </View>

        <View style={styles.deliveryListGrid}>
          {deliveryJobs.map((del) => (
            <View key={del.id} style={styles.deliveryCard}>
              <View style={styles.delHeader}>
                <Text style={styles.delTag}>📦 EXTRA DELIVERY</Text>
                <Text style={styles.delEarning}>+RM {del.earningMYR.toFixed(2)}</Text>
              </View>

              <Text style={styles.prodName}>{del.productName}</Text>
              <Text style={styles.delLine}>🏬 Pickup Hub: <Text style={styles.bold}>{del.hubPickup}</Text></Text>
              <Text style={styles.delLine}>📍 Dropoff: <Text style={styles.bold}>{del.deliveryCustomerArea}</Text></Text>

              <View style={styles.btnRow}>
                <TouchableOpacity style={styles.declineBtn} onPress={() => alert('Delivery skipped')}>
                  <Text style={styles.declineText}>Skip</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.acceptDelBtn} 
                  onPress={() => {
                    acceptDeliveryJob(del.id);
                    alert(`Accepted Delivery for ${del.productName}! RM6.00 credited upon dropoff.`);
                  }}
                  activeOpacity={0.9}
                >
                  <Text style={styles.acceptDelText}>Accept Delivery (+RM 6.00) →</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
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
    maxWidth: 1100,
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

  alertCard: {
    backgroundColor: colors.surfaceWhite,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.xxl,
    borderWidth: 2,
    borderColor: colors.washerAccent,
    ...shadows.medium,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  badgeRow: {},
  alertTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: colors.washerDark,
    letterSpacing: 0.6,
  },
  timerBadge: {
    backgroundColor: colors.amberLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.pill,
  },
  timerText: {
    fontSize: 11,
    fontWeight: '900',
    color: colors.amberOffer,
  },

  payoutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.washerLight,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  payoutLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: colors.washerDark,
    letterSpacing: 0.6,
  },
  payoutValue: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.washerDark,
  },

  detailGrid: {
    gap: 8,
    marginBottom: spacing.lg,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    paddingBottom: 6,
  },
  detailKey: {
    fontSize: 12,
    color: colors.textMuted,
  },
  detailVal: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textDark,
  },

  btnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  declineBtn: {
    flex: 1,
    backgroundColor: colors.surfaceElevated,
    paddingVertical: 14,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  declineText: {
    color: colors.textMuted,
    fontWeight: '800',
    fontSize: 13,
  },
  acceptBtn: {
    flex: 2,
    backgroundColor: colors.washerAccent,
    paddingVertical: 14,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    ...shadows.soft,
  },
  acceptText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 14,
  },

  sectionHeaderBox: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.brandNavy,
  },
  sectionSub: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },

  deliveryListGrid: {
    gap: spacing.md,
  },
  deliveryCard: {
    backgroundColor: colors.surfaceWhite,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.soft,
  },
  delHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  delTag: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.primaryBlue,
    letterSpacing: 0.6,
  },
  delEarning: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.washerDark,
  },
  prodName: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textDark,
    marginBottom: 6,
  },
  delLine: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 2,
  },
  bold: {
    fontWeight: '800',
    color: colors.textDark,
  },

  acceptDelBtn: {
    flex: 2,
    backgroundColor: colors.primaryBlue,
    paddingVertical: 14,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  acceptDelText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 13,
  },
});
