import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useBooking } from '../../src/context/BookingContext';
import { colors, spacing, borderRadius, shadows } from '../../src/theme';
import { SERVICE_CATEGORIES, PROMOTIONS, SERVICE_ADDONS, SAMPLE_WASHER, SAVED_VEHICLES } from '../../src/services/mockData';

export default function CustomerHomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { 
    activeBooking, 
    draftService, setDraftService, 
    draftVehicle, setDraftVehicle,
    draftLocation 
  } = useBooking();

  const isDesktop = width >= 1024;
  const isTablet = width >= 768;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={[styles.mainWrapper, isDesktop && styles.mainWrapperDesktop]}>

        {/* ============================================================ */}
        {/* 1. HERO COMMAND CENTER (2-COLUMN ON DESKTOP, STACKED ON MOBILE) */}
        {/* ============================================================ */}
        <View style={[styles.heroGrid, isDesktop && styles.heroGridDesktop]}>

          {/* LEFT COLUMN: INTERACTIVE BOOKING ENGINE CARD */}
          <View style={[styles.bookingEngineCard, isDesktop && styles.columnFlex]}>
            <View style={styles.eyebrowRow}>
              <View style={styles.eyebrowBadge}>
                <Text style={styles.eyebrowText}>DOORSTEP MOBILE CAR WASH • MALAYSIA 🇲🇾</Text>
              </View>
              <View style={styles.onlineBadge}>
                <View style={styles.greenDot} />
                <Text style={styles.onlineText}>24 Detailers Online</Text>
              </View>
            </View>

            <Text style={styles.heroMainTitle}>
              Professional Detailing Delivered to Your Parking Bay
            </Text>
            <Text style={styles.heroMainSub}>
              Low-water eco wash & wax at your condo basement, landed home, office or shopping mall.
            </Text>

            {/* Quick Location Bar */}
            <View style={styles.locationSelectorCard}>
              <View style={styles.locPinBox}>
                <Text style={{ fontSize: 18 }}>📍</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.locHeaderTag}>WASH LOCATION</Text>
                <Text style={styles.locAddressText} numberOfLines={1}>
                  {draftLocation?.addressLine1 || 'Jalan Telawi 3, Bangsar'}, {draftLocation?.city || 'Kuala Lumpur'}
                </Text>
                {draftLocation?.condoBuildingName && (
                  <Text style={styles.locBaySubText}>
                    🏢 {draftLocation.condoBuildingName} ({draftLocation.unitParkingBay || 'Bay B2-#45'})
                  </Text>
                )}
              </View>
              <TouchableOpacity
                style={styles.locChangeBtn}
                onPress={() => router.push('/customer/book')}
              >
                <Text style={styles.locChangeBtnText}>Change</Text>
              </TouchableOpacity>
            </View>

            {/* Vehicle Garage Quick Switcher */}
            <View style={styles.garageSection}>
              <View style={styles.garageHeaderRow}>
                <Text style={styles.sectionHeaderLabel}>SELECT VEHICLE FROM GARAGE</Text>
                <TouchableOpacity onPress={() => router.push('/customer/profile')}>
                  <Text style={styles.garageManageLink}>Manage Garage →</Text>
                </TouchableOpacity>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.vehicleScroll}>
                {SAVED_VEHICLES.map((v) => {
                  const isSelected = draftVehicle.id === v.id;
                  return (
                    <TouchableOpacity
                      key={v.id}
                      style={[styles.vehicleChip, isSelected && styles.vehicleChipSelected]}
                      onPress={() => setDraftVehicle(v)}
                      activeOpacity={0.85}
                    >
                      <Text style={{ fontSize: 18 }}>🚗</Text>
                      <View style={{ marginLeft: 8 }}>
                        <Text style={[styles.vehiclePlateText, isSelected && styles.vehiclePlateSelected]}>
                          {v.plateNumber}
                        </Text>
                        <Text style={styles.vehicleModelSub}>
                          {v.make} {v.model}
                        </Text>
                      </View>
                      {isSelected && (
                        <View style={styles.selectedCheckCircle}>
                          <Text style={styles.checkIcon}>✓</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Service Package Selector Grid */}
            <View style={styles.serviceSelectorBox}>
              <Text style={styles.sectionHeaderLabel}>SELECT WASH PACKAGE</Text>
              <View style={styles.packagePillsGrid}>
                {SERVICE_CATEGORIES.map((cat) => {
                  const isSelected = draftService.id === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={[styles.packagePillItem, isSelected && styles.packagePillSelected]}
                      onPress={() => setDraftService(cat)}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.packagePillIcon}>{cat.icon}</Text>
                      <View style={{ flex: 1, marginLeft: 8 }}>
                        <Text style={[styles.packagePillName, isSelected && styles.packagePillNameActive]}>
                          {cat.name}
                        </Text>
                        <Text style={styles.packagePillMeta}>{cat.durationRange}</Text>
                      </View>
                      <Text style={[styles.packagePillPrice, isSelected && styles.packagePillPriceActive]}>
                        RM{cat.startingPriceMYR}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Price Estimator & Book CTA */}
            <View style={styles.heroCtaBar}>
              <View>
                <Text style={styles.ctaPriceLabel}>Estimated Starting Price</Text>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
                  <Text style={styles.ctaPriceValue}>RM {draftService?.startingPriceMYR || 48}</Text>
                  <Text style={styles.ctaPriceSub}>.00 MYR</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.mainBookBtn}
                onPress={() => router.push('/customer/book')}
                activeOpacity={0.9}
              >
                <Text style={styles.mainBookBtnText}>Book Detailer Now →</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* RIGHT COLUMN: ACTIVE ORDER LIVE TRACKING COMMAND CENTER */}
          <View style={[styles.activeTrackingCard, isDesktop && styles.columnFlex]}>
            {activeBooking ? (
              <>
                <View style={styles.activeCardHeader}>
                  <View style={styles.activeTitleRow}>
                    <View style={styles.livePulseDot} />
                    <Text style={styles.activeHeaderTag}>LIVE TRACKING COMMAND CENTER</Text>
                  </View>
                  <View style={styles.etaPill}>
                    <Text style={styles.etaPillText}>ETA: {activeBooking.etaMinutes || 8} MINS</Text>
                  </View>
                </View>

                {/* Washer Profile Box */}
                <View style={styles.washerInfoBox}>
                  <Image source={{ uri: SAMPLE_WASHER.avatarUrl }} style={styles.washerAvatarImage} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={styles.washerNameText}>Amir Hazim</Text>
                      <View style={styles.ratingBadgePill}>
                        <Text style={styles.ratingBadgeText}>★ 4.95 Top Detailer</Text>
                      </View>
                    </View>
                    <Text style={styles.washerVehicleSub}>
                      Perodua Myvi • <Text style={styles.boldText}>VWB 8819</Text> (Rig Mounted Eco Wash)
                    </Text>
                    <Text style={styles.washerPackageSub}>
                      Package: <Text style={styles.blueBold}>{activeBooking.service.name}</Text> (RM {activeBooking.totalMYR})
                    </Text>
                  </View>
                </View>

                {/* Progress Timeline Stepper */}
                <View style={styles.timelineStepperWrapper}>
                  <Text style={styles.stepperTitle}>SERVICE PROGRESS TIMELINE</Text>
                  
                  <View style={styles.stepperContainer}>
                    {/* Step 1: Confirmed */}
                    <View style={styles.stepCol}>
                      <View style={[styles.stepCircle, styles.stepDone]}>
                        <Text style={styles.stepCheckMark}>✓</Text>
                      </View>
                      <Text style={styles.stepLabelDone}>Confirmed</Text>
                    </View>

                    <View style={[styles.stepperLine, styles.lineDone]} />

                    {/* Step 2: Assigned */}
                    <View style={styles.stepCol}>
                      <View style={[styles.stepCircle, styles.stepDone]}>
                        <Text style={styles.stepCheckMark}>✓</Text>
                      </View>
                      <Text style={styles.stepLabelDone}>Assigned</Text>
                    </View>

                    <View style={[styles.stepperLine, styles.lineActive]} />

                    {/* Step 3: On The Way */}
                    <View style={styles.stepCol}>
                      <View style={[styles.stepCircle, styles.stepActive]}>
                        <Text style={styles.stepIconActive}>🛵</Text>
                      </View>
                      <Text style={styles.stepLabelActive}>En Route</Text>
                    </View>

                    <View style={[styles.stepperLine, styles.linePending]} />

                    {/* Step 4: Arrived */}
                    <View style={styles.stepCol}>
                      <View style={[styles.stepCircle, styles.stepPending]}>
                        <Text style={styles.stepNumPending}>4</Text>
                      </View>
                      <Text style={styles.stepLabelPending}>Arrived</Text>
                    </View>

                    <View style={[styles.stepperLine, styles.linePending]} />

                    {/* Step 5: Washing */}
                    <View style={styles.stepCol}>
                      <View style={[styles.stepCircle, styles.stepPending]}>
                        <Text style={styles.stepNumPending}>5</Text>
                      </View>
                      <Text style={styles.stepLabelPending}>Washing</Text>
                    </View>
                  </View>
                </View>

                {/* Action Buttons Hierarchy */}
                <View style={styles.actionButtonsRow}>
                  <TouchableOpacity
                    style={styles.trackMapBtn}
                    onPress={() => router.push('/customer/tracking')}
                    activeOpacity={0.9}
                  >
                    <Text style={styles.trackMapBtnText}>Track Live Map →</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.chatWasherBtn}
                    onPress={() => router.push('/customer/messages')}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.chatWasherBtnText}>💬 Chat</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.callWasherIconBtn}
                    onPress={() => alert('Calling Amir Hazim at +60 12-345 6789...')}
                  >
                    <Text style={{ fontSize: 18 }}>📞</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              /* No Active Order Placeholder / Demo Live Status Banner */
              <View style={styles.emptyActiveState}>
                <View style={styles.emptyIconCircle}>
                  <Text style={{ fontSize: 32 }}>🛵</Text>
                </View>
                <Text style={styles.emptyActiveTitle}>No Active Wash Order Right Now</Text>
                <Text style={styles.emptyActiveSub}>
                  Select your vehicle and package on the left to book a mobile detailer straight to your doorstep.
                </Text>
                <TouchableOpacity
                  style={styles.quickBookOutlineBtn}
                  onPress={() => router.push('/customer/book')}
                >
                  <Text style={styles.quickBookOutlineText}>Configure Wash & Book →</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

        </View>

        {/* ============================================================ */}
        {/* 2. TRUST & VALUE PROPOSITION BANNER */}
        {/* ============================================================ */}
        <View style={styles.valuePropsContainer}>
          <View style={[styles.valuePropCard, isTablet && styles.valuePropCardGrid]}>
            <View style={styles.propIconBox}><Text style={{ fontSize: 22 }}>⚡</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.propTitle}>30-Min Rapid Dispatch</Text>
              <Text style={styles.propSub}>On-demand detailers stationed near major KL & PJ hubs.</Text>
            </View>
          </View>

          <View style={[styles.valuePropCard, isTablet && styles.valuePropCardGrid]}>
            <View style={styles.propIconBox}><Text style={{ fontSize: 22 }}>💧</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.propTitle}>Low-Water Eco Wash</Text>
              <Text style={styles.propSub}>Condo management approved. Zero mess or floor pooling.</Text>
            </View>
          </View>

          <View style={[styles.valuePropCard, isTablet && styles.valuePropCardGrid]}>
            <View style={styles.propIconBox}><Text style={{ fontSize: 22 }}>🛡️</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.propTitle}>RM100k Paint Guarantee</Text>
              <Text style={styles.propSub}>Fully insured detailing with microfiber & scratch-free process.</Text>
            </View>
          </View>
        </View>

        {/* ============================================================ */}
        {/* 3. POPULAR SERVICE PACKAGES GRID */}
        {/* ============================================================ */}
        <View style={styles.sectionHeaderBox}>
          <View>
            <Text style={styles.sectionHeaderTitle}>Popular Detailing Packages</Text>
            <Text style={styles.sectionHeaderSub}>Choose doorstep service tailored for your vehicle.</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/customer/book')}>
            <Text style={styles.viewAllLink}>View All Services →</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.serviceCardsGrid, isTablet && styles.serviceCardsGrid2Col, isDesktop && styles.serviceCardsGrid4Col]}>
          {SERVICE_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.serviceDetailCard}
              onPress={() => router.push({ pathname: '/customer/service-detail', params: { id: cat.id } })}
              activeOpacity={0.88}
            >
              {cat.badge && (
                <View style={styles.catBadgeTag}>
                  <Text style={styles.catBadgeText}>{cat.badge}</Text>
                </View>
              )}
              <View style={styles.catHeaderRow}>
                <View style={styles.catIconCircle}>
                  <Text style={{ fontSize: 24 }}>{cat.icon}</Text>
                </View>
                <View>
                  <Text style={styles.catPriceTag}>RM {cat.startingPriceMYR}</Text>
                  <Text style={styles.catTimeSub}>{cat.durationRange}</Text>
                </View>
              </View>

              <Text style={styles.catNameText}>{cat.name}</Text>
              <Text style={styles.catTaglineText}>{cat.tagline}</Text>

              <View style={styles.catFeaturesBox}>
                {cat.features.slice(0, 3).map((feat, idx) => (
                  <View key={idx} style={styles.featRow}>
                    <Text style={styles.featCheck}>✓</Text>
                    <Text style={styles.featText} numberOfLines={1}>{feat}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.catCardFooter}>
                <Text style={styles.selectServiceLink}>Select Package →</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* ============================================================ */}
        {/* 4. PROMOTIONS & SPECIAL OFFERS CAROUSEL */}
        {/* ============================================================ */}
        <View style={styles.sectionHeaderBox}>
          <View>
            <Text style={styles.sectionHeaderTitle}>Promotions & Voucher Discounts 🏷️</Text>
            <Text style={styles.sectionHeaderSub}>Apply codes at checkout for instant MYR savings.</Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.promoScrollContainer}>
          {PROMOTIONS.map((promo) => (
            <View key={promo.id} style={[styles.promoBannerCard, { backgroundColor: promo.colorBg }]}>
              <View style={styles.promoTopRow}>
                <Text style={styles.promoDiscountText}>{promo.discountText}</Text>
                <View style={styles.promoCodePill}>
                  <Text style={styles.promoCodeText}>{promo.code}</Text>
                </View>
              </View>
              <Text style={styles.promoTitleText}>{promo.title}</Text>
              <Text style={styles.promoDescText}>{promo.description}</Text>
              <TouchableOpacity
                style={styles.usePromoBtn}
                onPress={() => router.push('/customer/book')}
              >
                <Text style={styles.usePromoBtnText}>Use Promo at Checkout →</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* ============================================================ */}
        {/* 5. POPULAR CAR CARE ADD-ONS */}
        {/* ============================================================ */}
        <View style={styles.sectionHeaderBox}>
          <View>
            <Text style={styles.sectionHeaderTitle}>Specialized Car Care Add-ons</Text>
            <Text style={styles.sectionHeaderSub}>Add extra protection or interior deep clean to your order.</Text>
          </View>
        </View>

        <View style={[styles.addonsGrid, isTablet && styles.addonsGrid4Col]}>
          {SERVICE_ADDONS.map((addon) => (
            <TouchableOpacity
              key={addon.id}
              style={styles.addonCardItem}
              onPress={() => router.push('/customer/book')}
              activeOpacity={0.85}
            >
              <Text style={styles.addonIconLarge}>{addon.icon}</Text>
              <Text style={styles.addonItemName}>{addon.name}</Text>
              <Text style={styles.addonItemDesc} numberOfLines={2}>{addon.description}</Text>
              <View style={styles.addonPriceFooter}>
                <Text style={styles.addonPriceText}>+RM {addon.priceMYR}</Text>
                <Text style={styles.addonAddLink}>+ Add</Text>
              </View>
            </TouchableOpacity>
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
    maxWidth: 1360,
    alignSelf: 'center',
    width: '100%',
    paddingVertical: spacing.xl,
  },

  // 1. HERO GRID
  heroGrid: {
    flexDirection: 'column',
    gap: spacing.lg,
    marginBottom: spacing.xxl,
  },
  heroGridDesktop: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  columnFlex: {
    flex: 1,
  },

  // Booking Engine Card
  bookingEngineCard: {
    backgroundColor: colors.surfaceWhite,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.medium,
  },
  eyebrowRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  eyebrowBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.pill,
  },
  eyebrowText: {
    color: colors.primaryDark,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  greenDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.successGreen,
  },
  onlineText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '700',
  },

  heroMainTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.brandNavy,
    lineHeight: 30,
    letterSpacing: -0.4,
    marginBottom: 8,
  },
  heroMainSub: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
    marginBottom: spacing.lg,
  },

  locationSelectorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.lg,
  },
  locPinBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surfaceWhite,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  locHeaderTag: {
    fontSize: 9,
    fontWeight: '900',
    color: colors.primaryBlue,
    letterSpacing: 0.6,
  },
  locAddressText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textDark,
    marginTop: 1,
  },
  locBaySubText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
    marginTop: 1,
  },
  locChangeBtn: {
    backgroundColor: colors.primaryBlue,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: borderRadius.md,
  },
  locChangeBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },

  garageSection: {
    marginBottom: spacing.lg,
  },
  garageHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionHeaderLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.textMuted,
    letterSpacing: 0.6,
  },
  garageManageLink: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primaryBlue,
  },
  vehicleScroll: {
    flexDirection: 'row',
  },
  vehicleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceWhite,
    borderRadius: borderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
    position: 'relative',
  },
  vehicleChipSelected: {
    borderColor: colors.primaryBlue,
    borderWidth: 2,
    backgroundColor: colors.primaryLight,
  },
  vehiclePlateText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textDark,
  },
  vehiclePlateSelected: {
    color: colors.primaryDark,
  },
  vehicleModelSub: {
    fontSize: 10,
    color: colors.textMuted,
  },
  selectedCheckCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primaryBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  checkIcon: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '900',
  },

  serviceSelectorBox: {
    marginBottom: spacing.xl,
  },
  packagePillsGrid: {
    flexDirection: 'column',
    gap: 8,
    marginTop: 8,
  },
  packagePillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceWhite,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  packagePillSelected: {
    borderColor: colors.primaryBlue,
    borderWidth: 2,
    backgroundColor: colors.primaryLight,
  },
  packagePillIcon: {
    fontSize: 22,
  },
  packagePillName: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textDark,
  },
  packagePillNameActive: {
    color: colors.primaryDark,
  },
  packagePillMeta: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },
  packagePillPrice: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.textDark,
  },
  packagePillPriceActive: {
    color: colors.primaryBlue,
  },

  heroCtaBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  ctaPriceLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textMuted,
  },
  ctaPriceValue: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.primaryBlue,
  },
  ctaPriceSub: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '700',
  },
  mainBookBtn: {
    backgroundColor: colors.primaryBlue,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: borderRadius.md,
    ...shadows.soft,
  },
  mainBookBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
  },

  // Active Tracking Card
  activeTrackingCard: {
    backgroundColor: colors.surfaceWhite,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    borderWidth: 1.5,
    borderColor: colors.primaryBlue,
    ...shadows.medium,
  },
  activeCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  activeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  livePulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.successGreen,
  },
  activeHeaderTag: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.brandNavy,
    letterSpacing: 0.6,
  },
  etaPill: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.pill,
  },
  etaPillText: {
    color: colors.primaryDark,
    fontSize: 11,
    fontWeight: '900',
  },

  washerInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  washerAvatarImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: colors.primaryBlue,
  },
  washerNameText: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.textDark,
  },
  ratingBadgePill: {
    backgroundColor: colors.amberLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
  },
  ratingBadgeText: {
    color: colors.amberOffer,
    fontSize: 10,
    fontWeight: '900',
  },
  washerVehicleSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  boldText: {
    fontWeight: '800',
    color: colors.textDark,
  },
  washerPackageSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  blueBold: {
    fontWeight: '800',
    color: colors.primaryBlue,
  },

  timelineStepperWrapper: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  stepperTitle: {
    fontSize: 9,
    fontWeight: '900',
    color: colors.textMuted,
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepCol: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepDone: {
    backgroundColor: colors.successGreen,
  },
  stepActive: {
    backgroundColor: colors.primaryBlue,
  },
  stepPending: {
    backgroundColor: colors.borderMedium,
  },
  stepCheckMark: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '900',
  },
  stepIconActive: {
    fontSize: 11,
  },
  stepNumPending: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800',
  },
  stepLabelDone: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.successGreen,
    marginTop: 4,
  },
  stepLabelActive: {
    fontSize: 9,
    fontWeight: '900',
    color: colors.primaryBlue,
    marginTop: 4,
  },
  stepLabelPending: {
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 4,
  },
  stepperLine: {
    flex: 1,
    height: 2,
    marginHorizontal: 4,
    marginBottom: 14,
  },
  lineDone: {
    backgroundColor: colors.successGreen,
  },
  lineActive: {
    backgroundColor: colors.primaryBlue,
  },
  linePending: {
    backgroundColor: colors.borderLight,
  },

  actionButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  trackMapBtn: {
    flex: 2,
    backgroundColor: colors.primaryBlue,
    paddingVertical: 12,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  trackMapBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
  },
  chatWasherBtn: {
    flex: 1,
    backgroundColor: colors.primaryLight,
    paddingVertical: 12,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  chatWasherBtnText: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: '800',
  },
  callWasherIconBtn: {
    width: 42,
    height: 42,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },

  // Empty State Active Tracking Placeholder
  emptyActiveState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  emptyActiveTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textDark,
    marginBottom: 4,
  },
  emptyActiveSub: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 17,
    maxWidth: 320,
    marginBottom: spacing.lg,
  },
  quickBookOutlineBtn: {
    borderWidth: 1.5,
    borderColor: colors.primaryBlue,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
  },
  quickBookOutlineText: {
    color: colors.primaryBlue,
    fontSize: 12,
    fontWeight: '900',
  },

  // 2. VALUE PROPS BANNER
  valuePropsContainer: {
    flexDirection: 'column',
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  valuePropCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceWhite,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: spacing.md,
    ...shadows.subtle,
  },
  valuePropCardGrid: {
    flex: 1,
  },
  propIconBox: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  propTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textDark,
  },
  propSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },

  // 3. SERVICE PACKAGES GRID
  sectionHeaderBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: spacing.lg,
  },
  sectionHeaderTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.brandNavy,
  },
  sectionHeaderSub: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  viewAllLink: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primaryBlue,
  },

  serviceCardsGrid: {
    flexDirection: 'column',
    gap: spacing.lg,
    marginBottom: spacing.xxl,
  },
  serviceCardsGrid2Col: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  serviceCardsGrid4Col: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  serviceDetailCard: {
    backgroundColor: colors.surfaceWhite,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    position: 'relative',
    minWidth: 260,
    flex: 1,
    ...shadows.soft,
  },
  catBadgeTag: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: colors.amberOffer,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.xs,
  },
  catBadgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '900',
  },
  catHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  catIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  catPriceTag: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.primaryBlue,
    textAlign: 'right',
  },
  catTimeSub: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '700',
    textAlign: 'right',
  },
  catNameText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textDark,
  },
  catTaglineText: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
    marginBottom: 12,
  },
  catFeaturesBox: {
    gap: 6,
    marginBottom: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  featRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featCheck: {
    color: colors.successGreen,
    fontSize: 11,
    fontWeight: '900',
  },
  featText: {
    fontSize: 11,
    color: colors.textDark,
  },
  catCardFooter: {
    alignItems: 'flex-start',
  },
  selectServiceLink: {
    color: colors.primaryBlue,
    fontSize: 12,
    fontWeight: '900',
  },

  // 4. PROMOTIONS CAROUSEL
  promoScrollContainer: {
    flexDirection: 'row',
    marginBottom: spacing.xxl,
  },
  promoBannerCard: {
    width: 280,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginRight: spacing.lg,
  },
  promoTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  promoDiscountText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
  },
  promoCodePill: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.xs,
  },
  promoCodeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '900',
  },
  promoTitleText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  promoDescText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    marginTop: 4,
    lineHeight: 16,
    marginBottom: 14,
  },
  usePromoBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: borderRadius.md,
    alignSelf: 'flex-start',
  },
  usePromoBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '900',
  },

  // 5. ADDONS GRID
  addonsGrid: {
    flexDirection: 'column',
    gap: spacing.md,
  },
  addonsGrid4Col: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  addonCardItem: {
    backgroundColor: colors.surfaceWhite,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    flex: 1,
    minWidth: 180,
    ...shadows.subtle,
  },
  addonIconLarge: {
    fontSize: 28,
    marginBottom: 6,
  },
  addonItemName: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textDark,
  },
  addonItemDesc: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
    height: 28,
  },
  addonPriceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  addonPriceText: {
    fontSize: 13,
    fontWeight: '900',
    color: colors.primaryBlue,
  },
  addonAddLink: {
    fontSize: 11,
    fontWeight: '900',
    color: colors.primaryDark,
  },
});
