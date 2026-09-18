import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useBooking } from '../../src/context/BookingContext';
import { colors, spacing, borderRadius, shadows } from '../../src/theme';
import { SERVICE_CATEGORIES } from '../../src/services/mockData';

export default function WasherJobsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { 
    deliveryJobs, 
    acceptDeliveryJob,
    washerOfferedServices,
    toggleWasherService,
    availableCustomerOrders,
    grabOrder
  } = useBooking();

  const isDesktop = width >= 1024;

  const handleGrabOrder = (orderId: string, serviceName: string, serviceId: string) => {
    const isCapable = washerOfferedServices.includes(serviceId);
    if (!isCapable) {
      alert(`❌ Cannot Grab Order!\n\nYour washer profile currently does NOT offer "${serviceName}".\n\nPlease enable "${serviceName}" in your skill capabilities above to grab this job.`);
      return;
    }

    const success = grabOrder(orderId);
    if (success) {
      alert(`🎉 Order Grabbed Successfully!\n\nYou have accepted job #${orderId}. Navigating to active job workbench.`);
      router.replace('/washer');
    } else {
      alert('Failed to grab order. It may have been taken by another detailer.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={[styles.mainWrapper, isDesktop && styles.mainWrapperDesktop]}>

        {/* PAGE TITLE */}
        <View style={styles.headerBox}>
          <Text style={styles.pageTitle}>Order Grabbing & Dispatch Feed ⚡</Text>
          <Text style={styles.pageSubTitle}>
            Grab nearby customer orders matching your verified detailing service skills.
          </Text>
        </View>

        {/* SERVICE CAPABILITY SKILLS MANAGEMENT PANEL */}
        <View style={styles.skillsCard}>
          <View style={styles.skillsHeaderRow}>
            <View>
              <Text style={styles.skillsTitle}>WASHER SERVICE CAPABILITIES & SKILLS</Text>
              <Text style={styles.skillsSub}>Toggle services you are equipped and trained to perform today.</Text>
            </View>
            <View style={styles.skillsCountBadge}>
              <Text style={styles.skillsCountText}>{washerOfferedServices.length} Active Skills</Text>
            </View>
          </View>

          <View style={styles.skillsPillsGrid}>
            {SERVICE_CATEGORIES.map((cat) => {
              const isOffered = washerOfferedServices.includes(cat.id);
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.skillPill, isOffered ? styles.skillPillActive : styles.skillPillDisabled]}
                  onPress={() => toggleWasherService(cat.id)}
                  activeOpacity={0.8}
                >
                  <Text style={{ fontSize: 16 }}>{cat.icon}</Text>
                  <Text style={[styles.skillPillLabel, isOffered ? styles.skillTextActive : styles.skillTextDisabled]}>
                    {cat.name}
                  </Text>
                  <Text style={isOffered ? styles.checkActive : styles.checkDisabled}>
                    {isOffered ? '✓ Offered' : '✕ Disabled'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* AVAILABLE CUSTOMER ORDERS POOL FOR GRABBING */}
        <View style={styles.sectionHeaderBox}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={styles.liveDot} />
            <Text style={styles.sectionTitle}>Available Customer Orders ({availableCustomerOrders.length})</Text>
          </View>
          <Text style={styles.sectionSub}>Real-time customer dispatch requests broadcasting nearby.</Text>
        </View>

        {availableCustomerOrders.length > 0 ? (
          <View style={styles.ordersListGrid}>
            {availableCustomerOrders.map((order) => {
              const isCapable = washerOfferedServices.includes(order.service.id);
              const washerPayout = Math.round(order.totalMYR * 0.85);

              return (
                <View key={order.id} style={[styles.orderCard, !isCapable && styles.orderCardDisabled]}>
                  <View style={styles.orderHeaderRow}>
                    <View style={styles.orderIdBadge}>
                      <Text style={styles.orderIdText}>ORDER #{order.id}</Text>
                    </View>
                    <View style={styles.payoutBadge}>
                      <Text style={styles.payoutLabel}>WASHER PAYOUT:</Text>
                      <Text style={styles.payoutValue}>RM {washerPayout}.00</Text>
                    </View>
                  </View>

                  <View style={styles.serviceRow}>
                    <Text style={{ fontSize: 24 }}>{order.service.icon}</Text>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.orderServiceName}>{order.service.name}</Text>
                      <Text style={styles.orderServiceSub}>{order.service.durationRange} • Doorstep Mobile Wash</Text>
                    </View>
                    <View style={[styles.capaBadge, isCapable ? styles.capaBadgeSuccess : styles.capaBadgeDanger]}>
                      <Text style={[styles.capaText, isCapable ? styles.capaTextSuccess : styles.capaTextDanger]}>
                        {isCapable ? '✓ SKILL MATCH' : '✕ SKILL MISSING'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.orderMetaGrid}>
                    <View style={styles.metaRow}>
                      <Text style={styles.metaIcon}>🚗</Text>
                      <Text style={styles.metaText}>
                        <Text style={styles.boldText}>{order.vehicle.plateNumber}</Text> ({order.vehicle.make} {order.vehicle.model})
                      </Text>
                    </View>

                    <View style={styles.metaRow}>
                      <Text style={styles.metaIcon}>📍</Text>
                      <Text style={styles.metaText} numberOfLines={1}>
                        <Text style={styles.boldText}>{order.location.label}:</Text> {order.location.addressLine1}, {order.location.city}
                      </Text>
                    </View>

                    {order.location.condoBuildingName && (
                      <View style={styles.metaRow}>
                        <Text style={styles.metaIcon}>🏢</Text>
                        <Text style={styles.metaText}>
                          {order.location.condoBuildingName} ({order.location.unitParkingBay || 'Bay B2-#45'})
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* GRAB ORDER ACTION BUTTON */}
                  <TouchableOpacity
                    style={[styles.grabBtn, isCapable ? styles.grabBtnActive : styles.grabBtnDisabled]}
                    onPress={() => handleGrabOrder(order.id, order.service.name, order.service.id)}
                    activeOpacity={0.88}
                  >
                    <Text style={styles.grabBtnText}>
                      {isCapable ? `⚡ Grab Order Now (RM ${washerPayout}.00 Payout) →` : `🔒 Cannot Grab: "${order.service.name}" Skill Disabled`}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyOrdersBox}>
            <Text style={{ fontSize: 32, marginBottom: 8 }}>✨</Text>
            <Text style={styles.emptyOrdersTitle}>No Customer Orders Pending Right Now</Text>
            <Text style={styles.emptyOrdersSub}>Stay online! New customer orders in Bangsar, Mont Kiara and PJ will appear here live.</Text>
          </View>
        )}

        {/* PRODUCT DELIVERY OPPORTUNITIES */}
        <View style={styles.sectionHeaderBox}>
          <Text style={styles.sectionTitle}>Car-Care Product Delivery Add-ons 📦</Text>
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

  // SKILLS CARD
  skillsCard: {
    backgroundColor: colors.surfaceWhite,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.medium,
  },
  skillsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  skillsTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: colors.washerDark,
    letterSpacing: 0.6,
  },
  skillsSub: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  skillsCountBadge: {
    backgroundColor: colors.washerLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.pill,
  },
  skillsCountText: {
    fontSize: 11,
    fontWeight: '900',
    color: colors.washerDark,
  },
  skillsPillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
  },
  skillPillActive: {
    backgroundColor: colors.washerLight,
    borderColor: colors.washerAccent,
  },
  skillPillDisabled: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.borderLight,
    opacity: 0.65,
  },
  skillPillLabel: {
    fontSize: 12,
    fontWeight: '800',
  },
  skillTextActive: {
    color: colors.washerDark,
  },
  skillTextDisabled: {
    color: colors.textMuted,
  },
  checkActive: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.washerDark,
    backgroundColor: '#ffffff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
  },
  checkDisabled: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
  },

  // ORDERS LIST
  sectionHeaderBox: {
    marginBottom: spacing.md,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.successGreen,
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

  ordersListGrid: {
    gap: spacing.lg,
    marginBottom: spacing.xxl,
  },
  orderCard: {
    backgroundColor: colors.surfaceWhite,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    ...shadows.medium,
  },
  orderCardDisabled: {
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  orderHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  orderIdBadge: {
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.xs,
  },
  orderIdText: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.brandNavy,
  },
  payoutBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.washerLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.pill,
  },
  payoutLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: colors.washerDark,
  },
  payoutValue: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.washerDark,
  },

  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    backgroundColor: colors.surfaceElevated,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  orderServiceName: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.brandNavy,
  },
  orderServiceSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },
  capaBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.xs,
  },
  capaBadgeSuccess: {
    backgroundColor: colors.successLight,
  },
  capaBadgeDanger: {
    backgroundColor: colors.errorLight,
  },
  capaText: {
    fontSize: 10,
    fontWeight: '900',
  },
  capaTextSuccess: {
    color: colors.successDark,
  },
  capaTextDanger: {
    color: colors.errorDark,
  },

  orderMetaGrid: {
    gap: 6,
    marginBottom: spacing.lg,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaIcon: {
    fontSize: 14,
  },
  metaText: {
    fontSize: 12,
    color: colors.textMuted,
    flex: 1,
  },
  boldText: {
    fontWeight: '800',
    color: colors.textDark,
  },

  grabBtn: {
    paddingVertical: 14,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    ...shadows.soft,
  },
  grabBtnActive: {
    backgroundColor: colors.washerAccent,
  },
  grabBtnDisabled: {
    backgroundColor: '#94a3b8',
  },
  grabBtnText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 14,
  },

  emptyOrdersBox: {
    backgroundColor: colors.surfaceWhite,
    padding: spacing.xxl,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.xxl,
  },
  emptyOrdersTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.brandNavy,
    marginBottom: 4,
  },
  emptyOrdersSub: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
  },

  // DELIVERY
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

  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  declineBtn: {
    flex: 1,
    backgroundColor: colors.surfaceElevated,
    paddingVertical: 12,
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
  acceptDelBtn: {
    flex: 2,
    backgroundColor: colors.primaryBlue,
    paddingVertical: 12,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  acceptDelText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 13,
  },
});

