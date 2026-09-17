import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useBooking } from '../../src/context/BookingContext';
import { colors, spacing, borderRadius, shadows } from '../../src/theme';

export default function CustomerOrdersScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { activeBooking, submitRating } = useBooking();
  const [activeTab, setActiveTab] = useState<'active' | 'upcoming' | 'completed' | 'cancelled'>('completed');
  
  const isDesktop = width >= 1024;
  const [selectedRating, setSelectedRating] = useState<number>(5);
  const [selectedTip, setSelectedTip] = useState<number>(5);
  const [ratedSuccess, setRatedSuccess] = useState<boolean>(false);

  const mockCompletedOrders = [
    {
      id: 'MY-991024',
      serviceName: 'Interior + Exterior Eco Wash',
      carModel: 'Perodua Myvi (VWB 8819)',
      date: '12 Sep 2026',
      totalRM: 50,
      washerName: 'Amir Hazim',
      status: 'completed',
    },
    {
      id: 'MY-881203',
      serviceName: 'Waterless Eco Wash & Wax',
      carModel: 'Honda Civic (VCD 1234)',
      date: '04 Sep 2026',
      totalRM: 35,
      washerName: 'Amir Hazim',
      status: 'completed',
    },
  ];

  const handleApplyRating = () => {
    submitRating(selectedRating, selectedTip);
    setRatedSuccess(true);
    alert(`Thank you! Rated ${selectedRating} ⭐ and added RM${selectedTip} tip for Amir Hazim.`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={[styles.mainWrapper, isDesktop && styles.mainWrapperDesktop]}>

        {/* PAGE TITLE */}
        <View style={styles.headerBox}>
          <Text style={styles.pageTitle}>My Wash Orders</Text>
          <Text style={styles.pageSubTitle}>Track active detailing jobs and review past service receipts.</Text>
        </View>

        {/* FILTER TABS */}
        <View style={styles.tabFilterRow}>
          {(['active', 'upcoming', 'completed', 'cancelled'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabFilterBtn, activeTab === tab && styles.tabFilterBtnActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabFilterText, activeTab === tab && styles.tabFilterTextActive]}>
                {tab.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ACTIVE TAB CONTENT */}
        {activeTab === 'active' && (
          activeBooking ? (
            <View style={styles.orderCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.orderIdText}>ORDER #{activeBooking.id}</Text>
                <View style={styles.activeStatusPill}>
                  <Text style={styles.activeStatusPillText}>IN PROGRESS ⚡</Text>
                </View>
              </View>

              <Text style={styles.serviceTitleText}>{activeBooking.service.name}</Text>
              <Text style={styles.detailLine}>🚗 {activeBooking.vehicle.plateNumber} • {activeBooking.vehicle.make} {activeBooking.vehicle.model}</Text>
              <Text style={styles.detailLine}>📍 {activeBooking.location.addressLine1}, {activeBooking.location.city}</Text>
              <Text style={styles.priceLineText}>Total Paid: <Text style={styles.priceHighlight}>RM {activeBooking.totalMYR}.00</Text></Text>

              <TouchableOpacity style={styles.primaryTrackBtn} onPress={() => router.push('/customer/tracking')}>
                <Text style={styles.primaryTrackBtnText}>Track Live Map →</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.emptyCard}>
              <Text style={{ fontSize: 36, marginBottom: 8 }}>🧼</Text>
              <Text style={styles.emptyText}>No active wash order at the moment.</Text>
              <TouchableOpacity style={styles.bookNowBtn} onPress={() => router.push('/customer/book')}>
                <Text style={styles.bookNowText}>Book a Wash Now →</Text>
              </TouchableOpacity>
            </View>
          )
        )}

        {activeTab === 'upcoming' && (
          <View style={styles.emptyCard}>
            <Text style={{ fontSize: 36, marginBottom: 8 }}>📅</Text>
            <Text style={styles.emptyText}>No upcoming scheduled wash reservations.</Text>
            <TouchableOpacity style={styles.bookNowBtn} onPress={() => router.push('/customer/book')}>
              <Text style={styles.bookNowText}>Schedule a Wash Slot →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* COMPLETED TAB CONTENT */}
        {activeTab === 'completed' && (
          <View style={styles.ordersListGrid}>
            {mockCompletedOrders.map((order) => (
              <View key={order.id} style={styles.orderCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.orderIdText}>ORDER #{order.id}</Text>
                  <View style={styles.completedStatusPill}>
                    <Text style={styles.completedStatusPillText}>COMPLETED ✓</Text>
                  </View>
                </View>

                <Text style={styles.serviceTitleText}>{order.serviceName}</Text>
                <Text style={styles.detailLine}>🚗 {order.carModel}</Text>
                <Text style={styles.detailLine}>📅 Date: {order.date} • Detailer: {order.washerName}</Text>
                <Text style={styles.priceLineText}>Total Paid: <Text style={styles.priceHighlight}>RM {order.totalRM}.00</Text></Text>

                {/* Rate & Tip Section */}
                <View style={styles.ratingSectionBox}>
                  <Text style={styles.ratingTitle}>Rate & Tip Detailer ({order.washerName})</Text>
                  <View style={styles.starRow}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <TouchableOpacity key={star} onPress={() => setSelectedRating(star)}>
                        <Text style={[styles.starIcon, star <= selectedRating && styles.starActive]}>★</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <View style={styles.tipRow}>
                    <Text style={styles.tipLabel}>Add Driver Tip:</Text>
                    {[0, 2, 5, 10].map((tip) => (
                      <TouchableOpacity
                        key={tip}
                        style={[styles.tipChip, selectedTip === tip && styles.tipChipSelected]}
                        onPress={() => setSelectedTip(tip)}
                      >
                        <Text style={[styles.tipChipText, selectedTip === tip && styles.tipChipTextSelected]}>
                          {tip === 0 ? 'No tip' : `RM ${tip}`}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <TouchableOpacity style={styles.submitRatingBtn} onPress={handleApplyRating}>
                    <Text style={styles.submitRatingText}>{ratedSuccess ? '✓ Rating Submitted' : 'Submit Rating & Tip'}</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.btnRow}>
                  <TouchableOpacity style={styles.secondaryBtn} onPress={() => alert(`Receipt #${order.id}\nService: ${order.serviceName}\nPaid: RM${order.totalRM}`)}>
                    <Text style={styles.secondaryBtnText}>View Receipt</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.primaryBookBtn} onPress={() => router.push('/customer/book')}>
                    <Text style={styles.primaryBookBtnText}>Repeat Wash →</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'cancelled' && (
          <View style={styles.emptyCard}>
            <Text style={{ fontSize: 36, marginBottom: 8 }}>🚫</Text>
            <Text style={styles.emptyText}>No cancelled orders in history.</Text>
          </View>
        )}

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
    maxWidth: 1360,
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

  tabFilterRow: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceWhite,
    borderRadius: borderRadius.lg,
    padding: 4,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.subtle,
  },
  tabFilterBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: borderRadius.md,
  },
  tabFilterBtnActive: {
    backgroundColor: colors.primaryBlue,
  },
  tabFilterText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textMuted,
  },
  tabFilterTextActive: {
    color: '#ffffff',
    fontWeight: '900',
  },

  ordersListGrid: {
    flexDirection: 'column',
    gap: spacing.lg,
  },
  orderCard: {
    backgroundColor: colors.surfaceWhite,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.soft,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderIdText: {
    fontSize: 11,
    fontWeight: '900',
    color: colors.textMuted,
    letterSpacing: 0.6,
  },
  activeStatusPill: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.pill,
  },
  activeStatusPillText: {
    color: colors.primaryDark,
    fontSize: 9,
    fontWeight: '900',
  },
  completedStatusPill: {
    backgroundColor: colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.pill,
  },
  completedStatusPillText: {
    color: colors.successDark,
    fontSize: 9,
    fontWeight: '900',
  },

  serviceTitleText: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.brandNavy,
    marginBottom: 6,
  },
  detailLine: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 3,
  },
  priceLineText: {
    fontSize: 13,
    color: colors.textDark,
    marginTop: 6,
    marginBottom: spacing.lg,
  },
  priceHighlight: {
    fontWeight: '900',
    color: colors.primaryBlue,
  },

  ratingSectionBox: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  ratingTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.brandNavy,
    marginBottom: 6,
  },
  starRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  starIcon: {
    fontSize: 24,
    color: colors.borderMedium,
  },
  starActive: {
    color: colors.amberOffer,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  tipLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
  },
  tipChip: {
    backgroundColor: colors.surfaceWhite,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.xs,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  tipChipSelected: {
    backgroundColor: colors.successGreen,
    borderColor: colors.successGreen,
  },
  tipChipText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textDark,
  },
  tipChipTextSelected: {
    color: '#ffffff',
  },
  submitRatingBtn: {
    backgroundColor: colors.brandNavy,
    paddingVertical: 8,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  submitRatingText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },

  btnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: colors.surfaceElevated,
    paddingVertical: 12,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  secondaryBtnText: {
    color: colors.textDark,
    fontSize: 12,
    fontWeight: '800',
  },
  primaryBookBtn: {
    flex: 1,
    backgroundColor: colors.primaryBlue,
    paddingVertical: 12,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  primaryBookBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
  },
  primaryTrackBtn: {
    backgroundColor: colors.primaryBlue,
    paddingVertical: 14,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  primaryTrackBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
  },

  emptyCard: {
    backgroundColor: colors.surfaceWhite,
    borderRadius: borderRadius.xl,
    padding: spacing.xxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.soft,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  bookNowBtn: {
    backgroundColor: colors.primaryBlue,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: borderRadius.md,
  },
  bookNowText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
  },
});
