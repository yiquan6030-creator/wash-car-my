import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useBooking } from '../../src/context/BookingContext';
import { colors, spacing, borderRadius, shadows } from '../../src/theme';
import { SERVICE_CATEGORIES } from '../../src/services/mockData';

export default function ServiceDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { setDraftService } = useBooking();

  const service = SERVICE_CATEGORIES.find(s => s.id === id) || SERVICE_CATEGORIES[1];

  // Specific includes list based on service
  const includesList = [
    'Exterior hand wash & foam spray',
    'Rim decontamination & brake dust cleaning',
    'Full interior cabin vacuuming & trunk vacuum',
    'Dashboard, console & steering wheel wipe',
    'Interior surface & door panel cleaning',
    'Windscreen & glass clarity wipe-down',
  ];

  const handleBookService = () => {
    setDraftService(service);
    router.push('/customer/book');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header Hero Box */}
        <View style={styles.heroBox}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>{service.icon}</Text>
          </View>
          <Text style={styles.serviceTitle}>{service.name}</Text>
          <Text style={styles.serviceTagline}>{service.tagline}</Text>

          <View style={styles.priceRow}>
            <View style={styles.priceBadge}>
              <Text style={styles.priceLabel}>Starting Price</Text>
              <Text style={styles.priceValue}>RM{service.startingPriceMYR}</Text>
            </View>

            <View style={styles.durationBadge}>
              <Text style={styles.durationLabel}>Estimated Duration</Text>
              <Text style={styles.durationValue}>⏱️ {service.durationRange}</Text>
            </View>
          </View>
        </View>

        {/* What's Included Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>What's Included in This Wash</Text>
          <View style={styles.checklist}>
            {includesList.map((item, index) => (
              <View key={index} style={styles.checkItem}>
                <View style={styles.checkIconBox}>
                  <Text style={styles.checkIcon}>✓</Text>
                </View>
                <Text style={styles.checkText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Pricing & Vehicle Size Note */}
        <View style={styles.noticeCard}>
          <Text style={styles.noticeIcon}>💡</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.noticeTitle}>Vehicle Size Pricing Note</Text>
            <Text style={styles.noticeText}>
              Base price starts at RM{service.startingPriceMYR} for Hatchbacks & Sedans. Larger vehicles (SUV, MPV, Pickup) may incur a small tier adjustment at checkout.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom CTA Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceSummary}>
          <Text style={styles.summaryLabel}>Total Price</Text>
          <Text style={styles.summaryPrice}>RM{service.startingPriceMYR}.00</Text>
        </View>
        <TouchableOpacity style={styles.bookBtn} onPress={handleBookService} activeOpacity={0.9}>
          <Text style={styles.bookBtnText}>Book This Service →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundLight },
  content: { padding: spacing.lg, paddingBottom: 100 },
  heroBox: {
    backgroundColor: '#ffffff',
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.soft,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceSummary: { flex: 1 },
  iconText: { fontSize: 32 },
  serviceTitle: { fontSize: 22, fontWeight: '900', color: colors.textDark, textAlign: 'center' },
  serviceTagline: { fontSize: 13, color: colors.textMuted, textAlign: 'center', marginTop: 4, marginBottom: 16 },
  priceRow: { flexDirection: 'row', gap: 12, width: '100%' },
  priceBadge: { flex: 1, backgroundColor: colors.primaryLight, padding: 12, borderRadius: borderRadius.md, alignItems: 'center' },
  priceLabel: { fontSize: 11, fontWeight: '700', color: colors.primaryDark },
  priceValue: { fontSize: 20, fontWeight: '900', color: colors.primaryBlue, marginTop: 2 },
  durationBadge: { flex: 1, backgroundColor: '#f1f5f9', padding: 12, borderRadius: borderRadius.md, alignItems: 'center' },
  durationLabel: { fontSize: 11, fontWeight: '700', color: colors.textMuted },
  durationValue: { fontSize: 14, fontWeight: '900', color: colors.textDark, marginTop: 4 },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.soft,
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.textDark, marginBottom: spacing.md },
  checklist: { gap: 10 },
  checkItem: { flexDirection: 'row', alignItems: 'center' },
  checkIconBox: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.successLight, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  checkIcon: { color: colors.successGreen, fontWeight: '900', fontSize: 12 },
  checkText: { fontSize: 13, color: colors.textDark, fontWeight: '600', flex: 1 },
  noticeCard: {
    flexDirection: 'row',
    backgroundColor: colors.amberLight,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  noticeIcon: { fontSize: 20, marginRight: 10, marginTop: 2 },
  noticeTitle: { fontSize: 13, fontWeight: '800', color: '#92400e', marginBottom: 2 },
  noticeText: { fontSize: 11, color: '#78350f', lineHeight: 16 },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadows.medium,
  },
  summaryLabel: { fontSize: 11, color: colors.textMuted, fontWeight: '700' },
  summaryPrice: { fontSize: 20, fontWeight: '900', color: colors.primaryBlue },
  bookBtn: { backgroundColor: colors.primaryBlue, paddingHorizontal: 24, paddingVertical: 14, borderRadius: borderRadius.md },
  bookBtnText: { color: '#ffffff', fontWeight: '900', fontSize: 15 },
});
