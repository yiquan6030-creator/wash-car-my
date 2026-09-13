import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useBooking } from '../../src/context/BookingContext';
import { colors, spacing, borderRadius, shadows } from '../../src/theme';
import Badge from '../../src/components/Badge';

export default function CustomerOrdersScreen() {
  const router = useRouter();
  const { activeBooking, submitRating } = useBooking();
  const [activeTab, setActiveTab] = useState<'active' | 'upcoming' | 'completed' | 'cancelled'>('completed');
  
  // Rating & Tipping Modal State
  const [selectedRating, setSelectedRating] = useState<number>(5);
  const [selectedTip, setSelectedTip] = useState<number>(5);
  const [ratedSuccess, setRatedSuccess] = useState<boolean>(false);

  const mockCompletedOrders = [
    {
      id: 'MY-991024',
      serviceName: 'Interior + Exterior',
      carModel: 'Perodua Myvi (VWB 8819)',
      date: '12 Sep 2026',
      totalRM: 48,
      washerName: 'Amir',
      status: 'completed',
    },
    {
      id: 'MY-881203',
      serviceName: 'Low-Water Eco',
      carModel: 'Proton Saga (WXX 1234)',
      date: '04 Sep 2026',
      totalRM: 35,
      washerName: 'Amir',
      status: 'completed',
    },
  ];

  const handleApplyRating = () => {
    submitRating(selectedRating, selectedTip);
    setRatedSuccess(true);
    alert(`Thank you! Rated ${selectedRating} ⭐ and added RM${selectedTip} tip for Amir.`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.pageTitle}>My Wash Orders 📋</Text>

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
      {activeTab === 'active' && activeBooking && (
        <View style={styles.orderCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.orderId}>ORDER #{activeBooking.id}</Text>
            <Badge label="IN PROGRESS ⚡" variant="primary" />
          </View>
          <Text style={styles.serviceName}>{activeBooking.service.name}</Text>
          <Text style={styles.detailLine}>🚗 {activeBooking.vehicle.plateNumber} • {activeBooking.vehicle.make} {activeBooking.vehicle.model}</Text>
          <Text style={styles.detailLine}>📍 {activeBooking.location.addressLine1}</Text>
          <Text style={styles.priceLine}>Total: <Text style={styles.priceHighlight}>RM {activeBooking.totalMYR}</Text></Text>

          <TouchableOpacity style={styles.trackBtn} onPress={() => router.push('/customer/tracking')}>
            <Text style={styles.trackBtnText}>Track Live Map →</Text>
          </TouchableOpacity>
        </View>
      )}

      {activeTab === 'upcoming' && (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>📅</Text>
          <Text style={styles.emptyText}>No upcoming scheduled washes.</Text>
          <TouchableOpacity style={styles.bookNowBtn} onPress={() => router.push('/customer/book')}>
            <Text style={styles.bookNowText}>Book a Wash Now</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* COMPLETED TAB CONTENT */}
      {activeTab === 'completed' && (
        <View>
          {mockCompletedOrders.map((order) => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.orderId}>ORDER #{order.id}</Text>
                <Badge label="COMPLETED ✓" variant="success" />
              </View>

              <Text style={styles.serviceName}>{order.serviceName}</Text>
              <Text style={styles.detailLine}>🚗 {order.carModel}</Text>
              <Text style={styles.detailLine}>📅 Date: {order.date} • Washer: {order.washerName}</Text>
              <Text style={styles.priceLine}>Total Paid: <Text style={styles.priceHighlight}>RM {order.totalRM}.00</Text></Text>

              {/* Rate & Tip Section */}
              <View style={styles.ratingSection}>
                <Text style={styles.ratingTitle}>Rate & Tip Washer ({order.washerName})</Text>
                <View style={styles.starRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity key={star} onPress={() => setSelectedRating(star)}>
                      <Text style={[styles.starIcon, star <= selectedRating && styles.starActive]}>★</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.tipRow}>
                  <Text style={styles.tipLabel}>Tip Amir:</Text>
                  {[0, 2, 5, 10].map((tip) => (
                    <TouchableOpacity
                      key={tip}
                      style={[styles.tipChip, selectedTip === tip && styles.tipChipSelected]}
                      onPress={() => setSelectedTip(tip)}
                    >
                      <Text style={[styles.tipChipText, selectedTip === tip && styles.tipChipTextSelected]}>
                        {tip === 0 ? 'No tip' : `RM${tip}`}
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
                  <Text style={styles.secondaryBtnText}>View Details</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push('/customer/book')}>
                  <Text style={styles.primaryBtnText}>Book Again →</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      {activeTab === 'cancelled' && (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>🚫</Text>
          <Text style={styles.emptyText}>No cancelled orders.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundLight },
  content: { padding: spacing.lg, paddingBottom: 40 },
  pageTitle: { fontSize: 22, fontWeight: '900', color: colors.textDark, marginBottom: spacing.md },
  tabFilterRow: { flexDirection: 'row', backgroundColor: '#ffffff', borderRadius: borderRadius.md, padding: 4, marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.borderLight },
  tabFilterBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: borderRadius.sm },
  tabFilterBtnActive: { backgroundColor: colors.primaryBlue },
  tabFilterText: { fontSize: 10, fontWeight: '800', color: colors.textMuted },
  tabFilterTextActive: { color: '#ffffff' },
  orderCard: { backgroundColor: '#ffffff', borderRadius: borderRadius.xl, padding: spacing.lg, marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.borderLight, ...shadows.soft },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  orderId: { fontSize: 11, fontWeight: '800', color: colors.textMuted },
  serviceName: { fontSize: 16, fontWeight: '900', color: colors.textDark, marginBottom: 4 },
  detailLine: { fontSize: 12, color: colors.textMuted, marginBottom: 2 },
  priceLine: { fontSize: 13, color: colors.textDark, marginTop: 4, marginBottom: 12 },
  priceHighlight: { fontWeight: '900', color: colors.primaryBlue },
  ratingSection: { backgroundColor: colors.backgroundLight, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: 12 },
  ratingTitle: { fontSize: 11, fontWeight: '800', color: colors.textDark, marginBottom: 4 },
  starRow: { flexDirection: 'row', gap: 6, marginBottom: 8 },
  starIcon: { fontSize: 22, color: colors.borderMedium },
  starActive: { color: colors.amberOffer },
  tipRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  tipLabel: { fontSize: 11, fontWeight: '700', color: colors.textMuted },
  tipChip: { backgroundColor: '#ffffff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: borderRadius.sm, borderWidth: 1, borderColor: colors.borderLight },
  tipChipSelected: { backgroundColor: colors.successGreen, borderColor: colors.successGreen },
  tipChipText: { fontSize: 10, fontWeight: '800', color: colors.textDark },
  tipChipTextSelected: { color: '#ffffff' },
  submitRatingBtn: { backgroundColor: colors.brandNavy, paddingVertical: 8, borderRadius: borderRadius.sm, alignItems: 'center' },
  submitRatingText: { color: '#ffffff', fontWeight: '800', fontSize: 11 },
  btnRow: { flexDirection: 'row', gap: 10 },
  secondaryBtn: { flex: 1, backgroundColor: colors.primaryLight, paddingVertical: 10, borderRadius: borderRadius.md, alignItems: 'center' },
  secondaryBtnText: { color: colors.primaryDark, fontWeight: '800', fontSize: 12 },
  primaryBtn: { flex: 1, backgroundColor: colors.primaryBlue, paddingVertical: 10, borderRadius: borderRadius.md, alignItems: 'center' },
  primaryBtnText: { color: '#ffffff', fontWeight: '900', fontSize: 13 },
  trackBtn: { backgroundColor: colors.primaryBlue, paddingVertical: 12, borderRadius: borderRadius.md, alignItems: 'center' },
  trackBtnText: { color: '#ffffff', fontWeight: '900', fontSize: 14 },
  emptyCard: { backgroundColor: '#ffffff', borderRadius: borderRadius.lg, padding: spacing.xl, alignItems: 'center', borderWidth: 1, borderColor: colors.borderLight },
  emptyIcon: { fontSize: 32, marginBottom: 8 },
  emptyText: { fontSize: 13, color: colors.textMuted, fontWeight: '600', marginBottom: 12 },
  bookNowBtn: { backgroundColor: colors.primaryBlue, paddingHorizontal: 18, paddingVertical: 10, borderRadius: borderRadius.md },
  bookNowText: { color: '#ffffff', fontWeight: '800', fontSize: 13 },
});
