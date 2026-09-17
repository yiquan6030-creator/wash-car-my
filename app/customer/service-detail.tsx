import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useBooking } from '../../src/context/BookingContext';
import { colors, spacing, borderRadius, shadows } from '../../src/theme';
import { SERVICE_CATEGORIES } from '../../src/services/mockData';

export default function ServiceDetailScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { setDraftService } = useBooking();

  const isDesktop = width >= 1024;
  const service = SERVICE_CATEGORIES.find(s => s.id === id) || SERVICE_CATEGORIES[1];

  const includesList = [
    'Exterior eco hand wash & foam spray',
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
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.mainWrapper, isDesktop && styles.mainWrapperDesktop]}>

          {/* HERO PACKAGE BOX */}
          <View style={styles.heroBox}>
            <View style={styles.iconCircle}>
              <Text style={{ fontSize: 36 }}>{service.icon}</Text>
            </View>
            <Text style={styles.serviceTitle}>{service.name}</Text>
            <Text style={styles.serviceTagline}>{service.tagline}</Text>

            <View style={styles.priceRow}>
              <View style={styles.priceBadge}>
                <Text style={styles.priceLabel}>Starting Price</Text>
                <Text style={styles.priceValue}>RM {service.startingPriceMYR}</Text>
              </View>

              <View style={styles.durationBadge}>
                <Text style={styles.durationLabel}>Estimated Duration</Text>
                <Text style={styles.durationValue}>⏱️ {service.durationRange}</Text>
              </View>
            </View>
          </View>

          {/* WHAT'S INCLUDED SECTION */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>What's Included in This Service</Text>
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

          {/* NOTICE CARD */}
          <View style={styles.noticeCard}>
            <Text style={{ fontSize: 22, marginRight: 12 }}>💡</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.noticeTitle}>Vehicle Size Pricing Note</Text>
              <Text style={styles.noticeText}>
                Base price starts at RM{service.startingPriceMYR} for Hatchbacks & Sedans. Larger vehicles (SUV, MPV, Pickup) may incur a small tier adjustment at checkout.
              </Text>
            </View>
          </View>

        </View>
      </ScrollView>

      {/* FIXED BOTTOM CTA BAR */}
      <View style={styles.bottomBar}>
        <View style={[styles.bottomBarContainer, isDesktop && styles.bottomBarDesktop]}>
          <View>
            <Text style={styles.summaryLabel}>Package Starting Price</Text>
            <Text style={styles.summaryPrice}>RM {service.startingPriceMYR}.00</Text>
          </View>

          <TouchableOpacity style={styles.bookBtn} onPress={handleBookService} activeOpacity={0.9}>
            <Text style={styles.bookBtnText}>Select & Book This Package →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  scrollContent: {
    paddingBottom: 100,
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

  heroBox: {
    backgroundColor: colors.surfaceWhite,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.medium,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.brandNavy,
    textAlign: 'center',
  },
  serviceTagline: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  priceRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  priceBadge: {
    flex: 1,
    backgroundColor: colors.primaryLight,
    padding: 14,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  priceValue: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.primaryBlue,
    marginTop: 2,
  },
  durationBadge: {
    flex: 1,
    backgroundColor: colors.surfaceElevated,
    padding: 14,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  durationLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textMuted,
  },
  durationValue: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.textDark,
    marginTop: 4,
  },

  sectionCard: {
    backgroundColor: colors.surfaceWhite,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.soft,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.brandNavy,
    marginBottom: spacing.lg,
  },
  checklist: {
    gap: 12,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkIconBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.successLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkIcon: {
    color: colors.successGreen,
    fontWeight: '900',
    fontSize: 12,
  },
  checkText: {
    fontSize: 13,
    color: colors.textDark,
    fontWeight: '600',
    flex: 1,
  },

  noticeCard: {
    flexDirection: 'row',
    backgroundColor: colors.amberLight,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  noticeTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#92400e',
    marginBottom: 2,
  },
  noticeText: {
    fontSize: 12,
    color: '#78350f',
    lineHeight: 17,
  },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surfaceWhite,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    padding: spacing.lg,
    ...shadows.medium,
  },
  bottomBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomBarDesktop: {
    maxWidth: 960,
    alignSelf: 'center',
    width: '100%',
  },
  summaryLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '700',
  },
  summaryPrice: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.primaryBlue,
  },
  bookBtn: {
    backgroundColor: colors.primaryBlue,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: borderRadius.md,
    ...shadows.soft,
  },
  bookBtnText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 14,
  },
});
