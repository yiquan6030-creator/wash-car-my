import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useBooking } from '../../src/context/BookingContext';
import { colors, spacing, borderRadius, shadows } from '../../src/theme';
import { SERVICE_CATEGORIES, PROMOTIONS, SERVICE_ADDONS, SAMPLE_WASHER, SAVED_VEHICLES, SAVED_LOCATIONS } from '../../src/services/mockData';

export default function CustomerHomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { 
    activeBooking, 
    draftService, setDraftService, 
    draftVehicle, setDraftVehicle,
    draftLocation, setDraftLocation,
    isLocatingGps, fetchGpsLocation
  } = useBooking();

  const isDesktop = width >= 1024;
  const isTablet = width >= 768;

  // Additional detail states for booking (as requested by user screenshot)
  const [selectedPropType, setSelectedPropType] = React.useState<'landed' | 'condo' | 'office'>('condo');
  const [selectedKeyOption, setSelectedKeyOption] = React.useState<'in_person' | 'unlocked' | 'guardhouse'>('in_person');
  const [parkingBayInput, setParkingBayInput] = React.useState<string>('Basement B2, Bay #45');
  const [showSavedAddresses, setShowSavedAddresses] = React.useState<boolean>(true);

  const washServicesGrid = [
    { id: 'booking', name: '提前预订', icon: '📅', desc: 'Schedule Wash', catId: 'interior_exterior' },
    { id: 'fleet', name: '团队出行洗', icon: '🚗', desc: 'Fleet Wash', catId: 'exterior_wash' },
    { id: 'priority', name: '优先快速洗', icon: '⚡', desc: 'Priority Express', catId: 'exterior_wash' },
    { id: 'plus', name: '精致内外洗', icon: '✨', desc: 'Full Detail', catId: 'interior_exterior' },
    { id: 'steam', name: '蒸汽高温杀菌', icon: '♨️', desc: 'Thermal Steam', catId: 'steam_detailing' },
    { id: 'ceramic', name: '漆面镀膜养护', icon: '🛡️', desc: 'Ceramic Coating', catId: 'steam_detailing' },
    { id: 'delivery', name: '洗车用品送货', icon: '🚚', desc: 'Product Delivery', catId: 'low_water_eco' },
    { id: 'view_all', name: '查看全部', icon: '📱', desc: 'View All Services', catId: 'interior_exterior' },
  ];

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

            {/* ============================================================ */}
            {/* 🟢 绿色框区域: 地图、常用地址、已选车辆车牌与车身颜色、钥匙与停车场设置 */}
            {/* ============================================================ */}
            <View style={styles.greenSectionBox}>
              <View style={styles.sectionBadgeGreen}>
                <Text style={styles.sectionBadgeGreenText}>🟢 地图定位、已选车辆车牌车色与预约车位钥匙</Text>
              </View>

              {/* 1. Address / Map Search Bar */}
              <View style={styles.addressSearchBarCard}>
                <Text style={{ fontSize: 18 }}>📍</Text>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={styles.searchBarLabel}>去哪里上门洗车？ (Search Wash Location)</Text>
                  <Text style={styles.searchBarAddress} numberOfLines={1}>
                    {draftLocation?.addressLine1 || 'Jalan Telawi 3, Bangsar, KL'}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.gpsAutoBtn}
                  onPress={() => fetchGpsLocation()}
                  disabled={isLocatingGps}
                >
                  <Text style={styles.gpsAutoBtnText}>
                    {isLocatingGps ? '定位中...' : '📍 GPS 自动定位'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Saved Address Pickers List (McDonald's, DNP大厦, 新山成功滨水酒店, Bangsar) */}
              <View style={styles.savedLocationPickerGrid}>
                {SAVED_LOCATIONS.map((loc) => {
                  const isLocSelected = draftLocation?.id === loc.id;
                  return (
                    <TouchableOpacity
                      key={loc.id}
                      style={[styles.locationPickItem, isLocSelected && styles.locationPickItemActive]}
                      onPress={() => setDraftLocation(loc)}
                      activeOpacity={0.85}
                    >
                      <Text style={{ fontSize: 16 }}>{isLocSelected ? '🟢' : '📍'}</Text>
                      <View style={{ flex: 1, marginLeft: 8 }}>
                        <Text style={[styles.locationPickTitle, isLocSelected && styles.locationPickTitleActive]} numberOfLines={1}>
                          {loc.label}
                        </Text>
                        <Text style={styles.locationPickSub} numberOfLines={1}>
                          {loc.addressLine1}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* 2. Vehicle Garage Quick Switcher with License Plate & Color Badge */}
              <View style={styles.garageSectionGreen}>
                <View style={styles.garageHeaderRow}>
                  <Text style={styles.sectionHeaderLabelGreen}>已选车辆与车牌车身颜色 (VEHICLE & COLOR)</Text>
                  <TouchableOpacity onPress={() => router.push('/customer/profile')}>
                    <Text style={styles.garageManageLink}>管理车库 →</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.vehicleScroll}>
                  {SAVED_VEHICLES.map((v) => {
                    const isSelected = draftVehicle.id === v.id;
                    return (
                      <TouchableOpacity
                        key={v.id}
                        style={[styles.vehicleChip, isSelected && styles.vehicleChipSelectedGreen]}
                        onPress={() => setDraftVehicle(v)}
                        activeOpacity={0.85}
                      >
                        <Text style={{ fontSize: 20 }}>🚗</Text>
                        <View style={{ marginLeft: 8 }}>
                          <View style={styles.plateTagPill}>
                            <Text style={styles.plateTagText}>{v.plateNumber}</Text>
                          </View>
                          <Text style={styles.vehicleModelSubBold}>
                            {v.make} {v.model}
                          </Text>
                          <View style={styles.colorBadgeRow}>
                            <Text style={styles.colorBadgeText}>{v.color || '珍珠白 (Pearl White)'}</Text>
                          </View>
                        </View>
                        {isSelected && (
                          <View style={styles.selectedCheckCircleGreen}>
                            <Text style={styles.checkIcon}>✓</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* 3. Property Type, Key Handover (拿钥匙) & Parking Bay Controls */}
              <View style={styles.accessControlsCard}>
                
                {/* Property / Service Location Type */}
                <View style={styles.controlRowBlock}>
                  <Text style={styles.controlBlockTitle}>服务地点类型 (Property Type):</Text>
                  <View style={styles.segmentedButtonsRow}>
                    <TouchableOpacity
                      style={[styles.segBtn, selectedPropType === 'condo' && styles.segBtnActive]}
                      onPress={() => setSelectedPropType('condo')}
                    >
                      <Text style={[styles.segBtnText, selectedPropType === 'condo' && styles.segBtnTextActive]}>
                        🏢 住宅公寓/大厦
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.segBtn, selectedPropType === 'landed' && styles.segBtnActive]}
                      onPress={() => setSelectedPropType('landed')}
                    >
                      <Text style={[styles.segBtnText, selectedPropType === 'landed' && styles.segBtnTextActive]}>
                        🏠 上门独栋/排屋
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.segBtn, selectedPropType === 'office' && styles.segBtnActive]}
                      onPress={() => setSelectedPropType('office')}
                    >
                      <Text style={[styles.segBtnText, selectedPropType === 'office' && styles.segBtnTextActive]}>
                        🏬 商业广场
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Key Collection / Handover Option (预定要拿钥匙) */}
                <View style={styles.controlRowBlock}>
                  <Text style={styles.controlBlockTitle}>🔑 车钥匙交接方式 (Key Collection / Handover):</Text>
                  <View style={styles.segmentedButtonsRow}>
                    <TouchableOpacity
                      style={[styles.segBtnKey, selectedKeyOption === 'in_person' && styles.segBtnKeyActive]}
                      onPress={() => setSelectedKeyOption('in_person')}
                    >
                      <Text style={[styles.segBtnText, selectedKeyOption === 'in_person' && styles.segBtnTextActive]}>
                        🔑 现场面交车钥匙
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.segBtnKey, selectedKeyOption === 'unlocked' && styles.segBtnKeyActive]}
                      onPress={() => setSelectedKeyOption('unlocked')}
                    >
                      <Text style={[styles.segBtnText, selectedKeyOption === 'unlocked' && styles.segBtnTextActive]}>
                        🔓 车已解密/无钥匙
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.segBtnKey, selectedKeyOption === 'guardhouse' && styles.segBtnKeyActive]}
                      onPress={() => setSelectedKeyOption('guardhouse')}
                    >
                      <Text style={[styles.segBtnText, selectedKeyOption === 'guardhouse' && styles.segBtnTextActive]}>
                        📫 保安处/信箱留钥匙
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Parking Bay Details */}
                <View style={styles.controlRowBlockNoBorder}>
                  <Text style={styles.controlBlockTitle}>🅿️ 停车场及车位编号 (Parking Bay Location):</Text>
                  <View style={styles.parkingInputBox}>
                    <Text style={{ fontSize: 16 }}>🅿️</Text>
                    <Text style={styles.parkingInputText}>
                      {draftLocation?.unitParkingBay || parkingBayInput}
                    </Text>
                  </View>
                </View>

              </View>

            </View>

            {/* ============================================================ */}
            {/* 🔴 红色框区域: 满足您一切洗车需求的各种门到门服务 (8格网图) */}
            {/* ============================================================ */}
            <View style={styles.redSectionBox}>
              <View style={styles.sectionHeaderRowRed}>
                <View style={styles.sectionBadgeRed}>
                  <Text style={styles.sectionBadgeRedText}>🔴 满足您一切需求的各种门到门洗车服务</Text>
                </View>
              </View>

              <View style={styles.grabServices8Grid}>
                {washServicesGrid.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.grabServiceCardItem}
                    onPress={() => {
                      const matchedCat = SERVICE_CATEGORIES.find(c => c.id === item.catId) || SERVICE_CATEGORIES[0];
                      setDraftService(matchedCat);
                      router.push('/customer/book');
                    }}
                    activeOpacity={0.8}
                  >
                    <View style={styles.grabServiceIconCircle}>
                      <Text style={{ fontSize: 26 }}>{item.icon}</Text>
                    </View>
                    <Text style={styles.grabServiceItemTitle}>{item.name}</Text>
                    <Text style={styles.grabServiceItemSub}>{item.desc}</Text>
                  </TouchableOpacity>
                ))}
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
                <Text style={styles.mainBookBtnText}>确认并立即预约洗车 →</Text>
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
  gpsLocateBtn: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: borderRadius.md,
  },
  gpsLocateBtnText: {
    color: colors.primaryDark,
    fontSize: 11,
    fontWeight: '900',
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

  /* 🟢 GREEN SECTION STYLES (MAP, VEHICLE PLATE & COLOR, KEY HANDOVER, PARKING BAY) */
  greenSectionBox: {
    borderWidth: 2,
    borderColor: '#22c55e',
    backgroundColor: '#f0fdf4',
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.soft,
  },
  sectionBadgeGreen: {
    backgroundColor: '#15803d',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.xs,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  sectionBadgeGreenText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '900',
  },
  addressSearchBarCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: borderRadius.lg,
    padding: 10,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    marginBottom: 10,
  },
  searchBarLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803d',
  },
  searchBarAddress: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textDark,
  },
  gpsAutoBtn: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: borderRadius.pill,
  },
  gpsAutoBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803d',
  },
  savedLocationPickerGrid: {
    gap: 6,
    marginBottom: 12,
  },
  locationPickItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: borderRadius.md,
    padding: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  locationPickItemActive: {
    borderColor: '#22c55e',
    backgroundColor: '#ecfdf5',
  },
  locationPickTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textDark,
  },
  locationPickTitleActive: {
    color: '#15803d',
  },
  locationPickSub: {
    fontSize: 10,
    color: colors.textMuted,
  },
  garageSectionGreen: {
    marginBottom: 12,
  },
  sectionHeaderLabelGreen: {
    fontSize: 10,
    fontWeight: '900',
    color: '#15803d',
    letterSpacing: 0.5,
  },
  vehicleChipSelectedGreen: {
    borderColor: '#22c55e',
    backgroundColor: '#ecfdf5',
    borderWidth: 2,
  },
  selectedCheckCircleGreen: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  plateTagPill: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 2,
  },
  plateTagText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '900',
  },
  vehicleModelSubBold: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textDark,
  },
  colorBadgeRow: {
    marginTop: 2,
  },
  colorBadgeText: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '700',
  },
  accessControlsCard: {
    backgroundColor: '#ffffff',
    borderRadius: borderRadius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  controlRowBlock: {
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  controlRowBlockNoBorder: {
    marginBottom: 0,
  },
  controlBlockTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textDark,
    marginBottom: 6,
  },
  segmentedButtonsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  segBtn: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  segBtnActive: {
    backgroundColor: '#dcfce7',
    borderColor: '#22c55e',
  },
  segBtnKey: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  segBtnKeyActive: {
    backgroundColor: '#dbeafe',
    borderColor: '#3b82f6',
  },
  segBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
    textAlign: 'center',
  },
  segBtnTextActive: {
    color: '#0f172a',
    fontWeight: '900',
  },
  parkingInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f8fafc',
    padding: 8,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  parkingInputText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textDark,
  },

  /* 🔴 RED SECTION STYLES (8-GRID WASH SERVICES) */
  redSectionBox: {
    borderWidth: 2,
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.soft,
  },
  sectionHeaderRowRed: {
    marginBottom: 12,
  },
  sectionBadgeRed: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.xs,
    alignSelf: 'flex-start',
  },
  sectionBadgeRedText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '900',
  },
  grabServices8Grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  grabServiceCardItem: {
    width: '23%',
    minWidth: 70,
    backgroundColor: '#ffffff',
    borderRadius: borderRadius.lg,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fecaca',
    ...shadows.subtle,
  },
  grabServiceIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff1f2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  grabServiceItemTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#991b1b',
    textAlign: 'center',
  },
  grabServiceItemSub: {
    fontSize: 9,
    color: '#7f1d1d',
    textAlign: 'center',
    marginTop: 1,
  },
});
