import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, useWindowDimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useBooking } from '../../src/context/BookingContext';
import { colors, spacing, borderRadius, shadows } from '../../src/theme';
import {
  SERVICE_CATEGORIES,
  SAVED_VEHICLES,
  SAVED_LOCATIONS,
  SERVICE_ADDONS
} from '../../src/services/mockData';
import { Vehicle, LocationAddress, PaymentMethodType, VehicleTier } from '../../src/types';
import { servicePrice } from '../../src/services/bookingRules';
import GoogleMapContainer from '../../src/components/GoogleMapContainer';

export default function MultiStepBookingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ step?: string }>();
  const { width } = useWindowDimensions();
  const {
    draftService, setDraftService,
    savedVehicles, draftVehicle, setDraftVehicle,
    draftLocation, setDraftLocation,
    draftBookingType, setDraftBookingType,
    scheduledDate, setScheduledDate,
    scheduledTime, setScheduledTime,
    selectedAddons, toggleAddon,
    discountMYR, applyPromoCode,
    confirmBooking, addVehicle, savedLocations,
    t
  } = useBooking();

  const isDesktop = width >= 1024;
  const [currentStep, setCurrentStep] = useState<number>(params.step === "4" ? 4 : 1);
  const [promoInput, setPromoInput] = useState<string>('');
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethodType>('cash');
  const [washerNotes, setWasherNotes] = useState<string>(draftLocation.notesForWasher || '');
  const [selectedPropType, setSelectedPropType] = useState<'landed' | 'condo' | 'office'>('condo');
  const [selectedKeyOption, setSelectedKeyOption] = useState<'in_person' | 'unlocked' | 'guardhouse'>('in_person');

  // Custom Vehicle Modal
  const [showAddVehicleModal, setShowAddVehicleModal] = useState<boolean>(false);
  const [newPlate, setNewPlate] = useState<string>('');
  const [newMakeModel, setNewMakeModel] = useState<string>('');
  const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleTier>('sedan');

  const [error, setError] = useState('');
  const submitting = React.useRef(false);
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.priceMYR, 0);
  const subtotal = servicePrice(draftService, draftVehicle.tier) + addonsTotal;
  const serviceFee = 2;
  const grandTotal = Math.max(0, subtotal + serviceFee - discountMYR);

  const handleApplyPromo = () => {
    const success = applyPromoCode(promoInput);
    if (success) {
      setError('优惠码已应用：RM5');
    } else {
      setError('优惠码无效或不符合首单条件；首单码 FIRSTWASH5');
    }
  };

  const handleConfirmOrder = () => {
    if (submitting.current) return;
    submitting.current = true;
    try {
      confirmBooking(selectedPayment, { ...draftLocation, notesForWasher: washerNotes, propertyType: selectedPropType, keyHandoverOption: selectedKeyOption });
      router.replace('/customer/tracking');
    } catch (e) { setError((e as Error).message); submitting.current = false; }
  };

  const handleAddCustomVehicle = () => {
    if (!newPlate || !newMakeModel) {
      alert('Please enter plate number and vehicle model.');
      return;
    }
    const created: Vehicle = {
      id: 'v_' + Date.now(),
      plateNumber: newPlate.toUpperCase(),
      make: newMakeModel.split(' ')[0] || 'Vehicle',
      model: newMakeModel.split(' ').slice(1).join(' ') || newMakeModel,
      color: 'Custom Color',
      tier: selectedVehicleType,
    };
    try { addVehicle(created); } catch (e) { setError((e as Error).message); return; }
    setShowAddVehicleModal(false);
    alert(`Added ${created.plateNumber} to garage!`);
  };

  const stepsList = [
    { num: 1, name: 'Service' },
    { num: 2, name: 'Vehicle' },
    { num: 3, name: 'Location' },
    { num: 4, name: 'Timing' },
    { num: 5, name: 'Add-ons' },
    { num: 6, name: 'Checkout' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={[styles.mainWrapper, isDesktop && styles.mainWrapperDesktop]}>

        {!!error && <Text accessibilityRole="alert" style={{ color: "#a33421", padding: 16 }}>{error}</Text>}
        <Text style={{ padding: 12, color: "#17506c" }}>本地体验 · 服务后付款，暂未接入线上支付。价格按车辆类型调整。</Text>
        {/* STEPPER HEADER BAR */}
        <View style={styles.stepperBar}>
          <TouchableOpacity accessibilityRole="button"
            onPress={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : router.back()}
            style={styles.backBtn}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.stepsPillContainer}>
            {stepsList.map((st) => (
              <TouchableOpacity accessibilityRole="button"
                key={st.num}
                style={[styles.stepPillItem, currentStep === st.num && styles.stepPillActive, currentStep > st.num && styles.stepPillDone]}
                onPress={() => setCurrentStep(st.num)}
              >
                <Text style={[styles.stepPillNum, (currentStep >= st.num) && styles.stepPillNumActive]}>{st.num}</Text>
                {isDesktop && (
                  <Text style={[styles.stepPillName, (currentStep >= st.num) && styles.stepPillNameActive]}>{st.name}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.stepIndicatorText}>Step {currentStep} / 6</Text>
        </View>

        {/* SIDE-BY-SIDE DESKTOP / STACKED MOBILE GRID */}
        <View style={[styles.bookingGrid, isDesktop && styles.bookingGridDesktop]}>

          {/* LEFT PANEL: STEP CONTENT */}
          <View style={[styles.stepContentPanel, isDesktop && styles.leftPanelFlex]}>

            {/* STEP 1: CHOOSE SERVICE */}
            {currentStep === 1 && (
              <View style={styles.stepBox}>
                <Text style={styles.stepTitle}>STEP 1: Choose Wash Package</Text>
                <Text style={styles.stepSubtitle}>Select doorstep car wash & detailing service.</Text>

                <View style={styles.cardsList}>
                  {SERVICE_CATEGORIES.map((cat) => {
                    const isSelected = draftService.id === cat.id;
                    return (
                      <TouchableOpacity accessibilityRole="button"
                        key={cat.id}
                        style={[styles.cardSelect, isSelected && styles.cardSelected]}
                        onPress={() => setDraftService(cat)}
                        activeOpacity={0.88}
                      >
                        <View style={styles.cardHeaderRow}>
                          <Text style={{ fontSize: 26 }}>{cat.icon}</Text>
                          <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={styles.cardTitle}>{cat.name}</Text>
                            <Text style={styles.cardSub}>{cat.tagline}</Text>
                          </View>
                          <View style={{ alignItems: 'flex-end' }}>
                            <Text style={styles.cardPrice}>RM {cat.startingPriceMYR}</Text>
                            <Text style={styles.cardDuration}>{cat.durationRange}</Text>
                          </View>
                        </View>

                        <View style={styles.featureBox}>
                          {cat.features.map((f, i) => (
                            <Text key={i} style={styles.featureItem}>✓ {f}</Text>
                          ))}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <TouchableOpacity accessibilityRole="button" style={styles.nextBtn} onPress={() => setCurrentStep(2)}>
                  <Text style={styles.nextBtnText}>Continue to Choose Vehicle →</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* STEP 2: CHOOSE CAR */}
            {currentStep === 2 && (
              <View style={styles.stepBox}>
                <Text style={styles.stepTitle}>STEP 2: Select Vehicle</Text>
                <Text style={styles.stepSubtitle}>Choose from your saved garage or register a new vehicle.</Text>

                <View style={styles.sectionTitleRow}>
                  <Text style={styles.subHeader}>Saved Vehicles</Text>
                  <TouchableOpacity accessibilityRole="button" onPress={() => setShowAddVehicleModal(!showAddVehicleModal)}>
                    <Text style={styles.addVehicleLink}>+ Add New Car</Text>
                  </TouchableOpacity>
                </View>

                {showAddVehicleModal && (
                  <View style={styles.addVehicleBox}>
                    <Text style={styles.inputLabel}>Plate Number (e.g. VWB 8819):</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="VWB 8819"
                      value={newPlate}
                      onChangeText={setNewPlate}
                      autoCapitalize="characters"
                    />

                    <Text style={styles.inputLabel}>Make & Model (e.g. Perodua Myvi):</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Perodua Myvi"
                      value={newMakeModel}
                      onChangeText={setNewMakeModel}
                    />

                    <Text style={styles.inputLabel}>Vehicle Type Tier:</Text>
                    <View style={styles.tierGrid}>
                      {(['hatchback', 'sedan', 'suv', 'mpv', 'pickup'] as VehicleTier[]).map((t) => (
                        <TouchableOpacity accessibilityRole="button"
                          key={t}
                          style={[styles.tierBtn, selectedVehicleType === t && styles.tierBtnSelected]}
                          onPress={() => setSelectedVehicleType(t)}
                        >
                          <Text style={[styles.tierBtnText, selectedVehicleType === t && styles.tierBtnTextSelected]}>
                            {t.toUpperCase()}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <TouchableOpacity accessibilityRole="button" style={styles.saveVehicleBtn} onPress={handleAddCustomVehicle}>
                      <Text style={styles.saveVehicleText}>Save Vehicle & Continue</Text>
                    </TouchableOpacity>
                  </View>
                )}

                <View style={styles.cardsList}>
                  {SAVED_VEHICLES.map((v) => {
                    const isSelected = draftVehicle.id === v.id;
                    return (
                      <TouchableOpacity accessibilityRole="button"
                        key={v.id}
                        style={[styles.cardSelect, isSelected && styles.cardSelected]}
                        onPress={() => setDraftVehicle(v)}
                      >
                        <View style={styles.cardHeaderRow}>
                          <Text style={{ fontSize: 28 }}>🚗</Text>
                          <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={styles.cardTitle}>{v.plateNumber}</Text>
                            <Text style={styles.cardSub}>{v.make} {v.model} • {v.color}</Text>
                          </View>
                          <View style={styles.tierPillTag}>
                            <Text style={styles.tierPillText}>{v.tier.toUpperCase()}</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <TouchableOpacity accessibilityRole="button" style={styles.nextBtn} onPress={() => setCurrentStep(3)}>
                  <Text style={styles.nextBtnText}>Continue to Location →</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* STEP 3: CHOOSE LOCATION */}
            {currentStep === 3 && (
              <View style={styles.stepBox}>
                <Text style={styles.stepTitle}>STEP 3: Wash Location & Parking</Text>
                <Text style={styles.stepSubtitle}>Specify address, property type, key handover and parking bay details.</Text>

                {/* Google Map Preview Container */}
                <View style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 16, borderWidth: 1, borderColor: colors.borderLight }}>
                  <GoogleMapContainer
                    latitude={draftLocation.latitude}
                    longitude={draftLocation.longitude}
                    locationName={draftLocation?.label || 'Selected Location'}
                    address={draftLocation?.addressLine1 || 'Jalan Telawi 3, Bangsar'}
                    condoBuildingName={draftLocation?.condoBuildingName}
                    unitParkingBay={draftLocation?.unitParkingBay || washerNotes}
                    height={180}
                    showOpenInAppBtn={true}
                  />
                </View>

                {/* Saved Locations Pickers */}
                <TouchableOpacity accessibilityRole="button" onPress={() => router.push("/customer/profile")}><Text style={styles.addVehicleLink}>+ 管理 / 添加上门地址</Text></TouchableOpacity><Text style={styles.subHeader}>Saved Wash Locations</Text>
                <View style={styles.cardsList}>
                  {savedLocations.map((loc) => {
                    const isSelected = draftLocation.id === loc.id;
                    return (
                      <TouchableOpacity accessibilityRole="button"
                        key={loc.id}
                        style={[styles.cardSelect, isSelected && styles.cardSelected]}
                        onPress={() => { setDraftLocation(loc); setWasherNotes(loc.notesForWasher || ""); }}
                      >
                        <Text style={styles.cardTitle}>📍 {loc.label}</Text>
                        <Text style={styles.cardSub}>{loc.addressLine1}, {loc.city}, {loc.postcode}</Text>
                        {loc.condoBuildingName && (
                          <Text style={styles.condoText}>🏢 {loc.condoBuildingName} ({loc.unitParkingBay || 'N/A'})</Text>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Property Type Selection */}
                <Text style={styles.subHeader}>Property Type</Text>
                <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
                  <TouchableOpacity accessibilityRole="button"
                    style={[styles.tierBtn, selectedPropType === 'condo' && styles.tierBtnSelected, { flex: 1, paddingVertical: 10, alignItems: 'center' }]}
                    onPress={() => setSelectedPropType('condo')}
                  >
                    <Text style={[styles.tierBtnText, selectedPropType === 'condo' && styles.tierBtnTextSelected]}>🏢 Condo / Apartment</Text>
                  </TouchableOpacity>

                  <TouchableOpacity accessibilityRole="button"
                    style={[styles.tierBtn, selectedPropType === 'landed' && styles.tierBtnSelected, { flex: 1, paddingVertical: 10, alignItems: 'center' }]}
                    onPress={() => setSelectedPropType('landed')}
                  >
                    <Text style={[styles.tierBtnText, selectedPropType === 'landed' && styles.tierBtnTextSelected]}>🏡 Landed House</Text>
                  </TouchableOpacity>

                  <TouchableOpacity accessibilityRole="button"
                    style={[styles.tierBtn, selectedPropType === 'office' && styles.tierBtnSelected, { flex: 1, paddingVertical: 10, alignItems: 'center' }]}
                    onPress={() => setSelectedPropType('office')}
                  >
                    <Text style={[styles.tierBtnText, selectedPropType === 'office' && styles.tierBtnTextSelected]}>🏢 Office / Commercial</Text>
                  </TouchableOpacity>
                </View>

                {/* Key Collection / Handover Option */}
                <Text style={styles.subHeader}>Key Collection / Handover Option</Text>
                <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
                  <TouchableOpacity accessibilityRole="button"
                    style={[styles.tierBtn, selectedKeyOption === 'in_person' && styles.tierBtnSelected, { flex: 1, paddingVertical: 10, alignItems: 'center' }]}
                    onPress={() => setSelectedKeyOption('in_person')}
                  >
                    <Text style={[styles.tierBtnText, selectedKeyOption === 'in_person' && styles.tierBtnTextSelected]}>👤 Key In Person</Text>
                  </TouchableOpacity>

                  <TouchableOpacity accessibilityRole="button"
                    style={[styles.tierBtn, selectedKeyOption === 'unlocked' && styles.tierBtnSelected, { flex: 1, paddingVertical: 10, alignItems: 'center' }]}
                    onPress={() => setSelectedKeyOption('unlocked')}
                  >
                    <Text style={[styles.tierBtnText, selectedKeyOption === 'unlocked' && styles.tierBtnTextSelected]}>🔓 Car Left Unlocked</Text>
                  </TouchableOpacity>

                  <TouchableOpacity accessibilityRole="button"
                    style={[styles.tierBtn, selectedKeyOption === 'guardhouse' && styles.tierBtnSelected, { flex: 1, paddingVertical: 10, alignItems: 'center' }]}
                    onPress={() => setSelectedKeyOption('guardhouse')}
                  >
                    <Text style={[styles.tierBtnText, selectedKeyOption === 'guardhouse' && styles.tierBtnTextSelected]}>🛡️ Guardhouse Counter</Text>
                  </TouchableOpacity>
                </View>

                {/* Parking Bay Instructions */}
                <Text style={styles.subHeader}>Parking Bay & Access Instructions</Text>
                <TextInput
                  style={styles.notesInput}
                  placeholder="e.g. Basement B2, Parked near lift lobby, Call upon arrival"
                  value={washerNotes}
                  onChangeText={setWasherNotes}
                  multiline
                  numberOfLines={3}
                />

                <TouchableOpacity accessibilityRole="button" style={styles.nextBtn} onPress={() => setCurrentStep(4)}>
                  <Text style={styles.nextBtnText}>Continue to Timing →</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* STEP 4: CHOOSE BOOKING TYPE */}
            {currentStep === 4 && (
              <View style={styles.stepBox}>
                <Text style={styles.stepTitle}>STEP 4: Wash Now or Reserve Slot</Text>
                <Text style={styles.stepSubtitle}>选择尽快上门或预约未来 30 天内的时间。</Text>

                <TouchableOpacity accessibilityRole="button"
                  style={[styles.cardSelect, draftBookingType === 'now' && styles.cardSelected]}
                  onPress={() => setDraftBookingType('now')}
                >
                  <Text style={styles.cardTitle}>⚡ Express Wash Now (ASAP)</Text>
                  <Text style={styles.cardSub}>上门时间需由接单师傅确认。</Text>
                </TouchableOpacity>

                <TouchableOpacity accessibilityRole="button"
                  style={[styles.cardSelect, draftBookingType === 'scheduled' && styles.cardSelected]}
                  onPress={() => setDraftBookingType('scheduled')}
                >
                  <Text style={styles.cardTitle}>📅 Schedule Reserved Slot</Text>
                  <Text style={styles.cardSub}>Reserve specific date & time slot for mobile detailing.</Text>
                </TouchableOpacity>

                {draftBookingType === 'scheduled' && (
                  <View style={styles.scheduleBox}>
                    <Text style={styles.inputLabel}>日期 YYYY-MM-DD（至少提前 1 小时）</Text>
                    <TextInput style={styles.input} value={scheduledDate} onChangeText={setScheduledDate} />
                    <Text style={styles.inputLabel}>马来西亚时间 HH:mm（08:00–18:00）</Text>
                    <TextInput style={styles.input} value={scheduledTime} onChangeText={setScheduledTime} />
                  </View>
                )}

                <TouchableOpacity accessibilityRole="button" style={styles.nextBtn} onPress={() => setCurrentStep(5)}>
                  <Text style={styles.nextBtnText}>Continue to Add-ons →</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* STEP 5: ADD-ONS */}
            {currentStep === 5 && (
              <View style={styles.stepBox}>
                <Text style={styles.stepTitle}>STEP 5: Enhance with Add-ons</Text>
                <Text style={styles.stepSubtitle}>Optional specialized treatments for ultimate shine.</Text>

                <View style={styles.cardsList}>
                  {SERVICE_ADDONS.map((addon) => {
                    const isChecked = selectedAddons.some(a => a.id === addon.id);
                    return (
                      <TouchableOpacity accessibilityRole="button"
                        key={addon.id}
                        style={[styles.cardSelect, isChecked && styles.cardSelected]}
                        onPress={() => toggleAddon(addon)}
                      >
                        <View style={styles.cardHeaderRow}>
                          <Text style={{ fontSize: 26 }}>{addon.icon}</Text>
                          <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={styles.cardTitle}>{addon.name}</Text>
                            <Text style={styles.cardSub}>{addon.description}</Text>
                          </View>
                          <Text style={styles.cardPrice}>+RM {addon.priceMYR}</Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <TouchableOpacity accessibilityRole="button" style={styles.nextBtn} onPress={() => setCurrentStep(6)}>
                  <Text style={styles.nextBtnText}>Review & Proceed to Payment →</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* STEP 6: CHECKOUT & PAYMENT */}
            {currentStep === 6 && (
              <View style={styles.stepBox}>
                <Text style={styles.stepTitle}>STEP 6: Checkout & Payment</Text>
                <Text style={styles.stepSubtitle}>Review order summary and select payment method.</Text>

                {/* Promo Code Input */}
                <View style={styles.promoRow}>
                  <TextInput
                    style={styles.promoInput}
                    placeholder="PROMO CODE (e.g. FIRSTWASH5)"
                    value={promoInput}
                    onChangeText={setPromoInput}
                    autoCapitalize="characters"
                  />
                  <TouchableOpacity accessibilityRole="button" style={styles.applyBtn} onPress={handleApplyPromo}>
                    <Text style={styles.applyBtnText}>Apply Promo</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.subHeader}>付款方式</Text><Text style={styles.cardSub}>服务后付款 · 尚未收款</Text><Text style={styles.cardSub}>FPX、DuitNow、TNG 及银行卡需接入支付服务后开放。</Text>

                <TouchableOpacity accessibilityRole="button" style={styles.confirmBtn} onPress={handleConfirmOrder} activeOpacity={0.9}>
                  <Text style={styles.confirmBtnText}>确认预约 · 服务后付款 RM {grandTotal.toFixed(2)} →</Text>
                </TouchableOpacity>
              </View>
            )}

          </View>

          {/* RIGHT PANEL: STICKY ORDER SUMMARY SIDEBAR */}
          <View style={[styles.summarySidebar, isDesktop && styles.rightPanelFlex]}>
            <Text style={styles.summarySidebarTitle}>ORDER SUMMARY</Text>

            <View style={styles.summaryBox}>
              <View style={styles.summaryItemRow}>
                <Text style={styles.sumLabel}>Package:</Text>
                <Text style={styles.sumVal}>{draftService.name}</Text>
              </View>

              <View style={styles.summaryItemRow}>
                <Text style={styles.sumLabel}>Vehicle:</Text>
                <Text style={styles.sumVal}>{draftVehicle.plateNumber} ({draftVehicle.make} {draftVehicle.model})</Text>
              </View>

              <View style={styles.summaryItemRow}>
                <Text style={styles.sumLabel}>Location:</Text>
                <Text style={styles.sumVal} numberOfLines={2}>{draftLocation.addressLine1}, {draftLocation.city}</Text>
              </View>

              <View style={styles.summaryItemRow}>
                <Text style={styles.sumLabel}>Timing:</Text>
                <Text style={styles.sumVal}>
                  {draftBookingType === 'now' ? '尽快上门 · 以师傅确认为准' : `${scheduledDate} @ ${scheduledTime}`}
                </Text>
              </View>

              {selectedAddons.length > 0 && (
                <View style={styles.summaryItemRow}>
                  <Text style={styles.sumLabel}>Add-ons:</Text>
                  <Text style={styles.sumVal}>{selectedAddons.map(a => a.name).join(', ')}</Text>
                </View>
              )}

              <View style={styles.divider} />

              <View style={styles.summaryItemRow}>
                <Text style={styles.sumLabel}>Package Price:</Text>
                <Text style={styles.sumVal}>RM {servicePrice(draftService, draftVehicle.tier).toFixed(2)}</Text>
              </View>

              {addonsTotal > 0 && (
                <View style={styles.summaryItemRow}>
                  <Text style={styles.sumLabel}>Add-ons Total:</Text>
                  <Text style={styles.sumVal}>+RM {addonsTotal}.00</Text>
                </View>
              )}

              <View style={styles.summaryItemRow}>
                <Text style={styles.sumLabel}>Service Fee:</Text>
                <Text style={styles.sumVal}>RM {serviceFee}.00</Text>
              </View>

              {discountMYR > 0 && (
                <View style={styles.summaryItemRow}>
                  <Text style={styles.discountLabel}>Promo Discount:</Text>
                  <Text style={styles.discountVal}>-RM {discountMYR}.00</Text>
                </View>
              )}

              <View style={styles.totalDivider} />

              <View style={styles.summaryItemRow}>
                <Text style={styles.totalPayableLabel}>Total Payable</Text>
                <Text style={styles.totalPayableValue}>RM {grandTotal}</Text>
              </View>
            </View>
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
    maxWidth: 1360,
    alignSelf: 'center',
    width: '100%',
    paddingVertical: spacing.xl,
  },

  // Stepper Header
  stepperBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceWhite,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.lg,
    ...shadows.soft,
  },
  backBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  backText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
  },
  stepsPillContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  stepPillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.pill,
  },
  stepPillActive: {
    backgroundColor: colors.primaryBlue,
  },
  stepPillDone: {
    backgroundColor: colors.successGreen,
  },
  stepPillNum: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.textMuted,
  },
  stepPillNumActive: {
    color: '#ffffff',
  },
  stepPillName: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
  },
  stepPillNameActive: {
    color: '#ffffff',
  },
  stepIndicatorText: {
    fontSize: 11,
    fontWeight: '900',
    color: colors.primaryBlue,
  },

  // Booking Grid
  bookingGrid: {
    flexDirection: 'column',
    gap: spacing.lg,
  },
  bookingGridDesktop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  leftPanelFlex: {
    flex: 7,
  },
  rightPanelFlex: {
    flex: 3,
  },

  stepContentPanel: {
    backgroundColor: colors.surfaceWhite,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.medium,
  },

  stepBox: {},
  stepTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.brandNavy,
    marginBottom: 4,
  },
  stepSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },

  cardsList: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  cardSelect: {
    backgroundColor: colors.surfaceWhite,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.subtle,
  },
  cardSelected: {
    borderColor: colors.primaryBlue,
    borderWidth: 2,
    backgroundColor: colors.primaryLight,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textDark,
  },
  cardSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.primaryBlue,
  },
  cardDuration: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 1,
  },

  featureBox: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    gap: 4,
  },
  featureItem: {
    fontSize: 11,
    color: colors.textDark,
  },

  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 12,
    fontWeight: '900',
    color: colors.brandNavy,
    letterSpacing: 0.5,
  },
  addVehicleLink: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primaryBlue,
  },
  tierPillTag: {
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.xs,
  },
  tierPillText: {
    fontSize: 9,
    fontWeight: '900',
    color: colors.textDark,
  },

  addVehicleBox: {
    backgroundColor: colors.surfaceElevated,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.primaryBlue,
    marginBottom: spacing.lg,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textMuted,
    marginBottom: 4,
  },
  input: {
    backgroundColor: colors.surfaceWhite,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: colors.textDark,
    marginBottom: 10,
  },
  tierGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  tierBtn: {
    backgroundColor: colors.surfaceWhite,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: borderRadius.xs,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  tierBtnSelected: {
    backgroundColor: colors.primaryBlue,
    borderColor: colors.primaryBlue,
  },
  tierBtnText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.textDark,
  },
  tierBtnTextSelected: {
    color: '#ffffff',
  },
  saveVehicleBtn: {
    backgroundColor: colors.primaryBlue,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  saveVehicleText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
  },

  condoText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
    marginTop: 4,
  },
  notesInput: {
    backgroundColor: colors.surfaceWhite,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: spacing.md,
    fontSize: 12,
    color: colors.textDark,
    textAlignVertical: 'top',
    marginBottom: spacing.lg,
  },

  scheduleBox: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.md,
  },

  promoRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: spacing.lg,
  },
  promoInput: {
    flex: 1,
    backgroundColor: colors.surfaceWhite,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: 12,
    fontSize: 12,
    fontWeight: '800',
  },
  applyBtn: {
    backgroundColor: colors.brandNavy,
    paddingHorizontal: 16,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
  },
  applyBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },

  paymentGrid: {
    flexDirection: 'column',
    gap: 8,
    marginVertical: 10,
    marginBottom: spacing.xl,
  },
  payBtn: {
    backgroundColor: colors.surfaceWhite,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  payBtnSelected: {
    borderColor: colors.primaryBlue,
    borderWidth: 2,
    backgroundColor: colors.primaryLight,
  },
  payText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textDark,
  },

  nextBtn: {
    backgroundColor: colors.primaryBlue,
    paddingVertical: 14,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    ...shadows.soft,
  },
  nextBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
  },
  confirmBtn: {
    backgroundColor: colors.successGreen,
    paddingVertical: 16,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    ...shadows.medium,
  },
  confirmBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
  },

  // Summary Sidebar
  summarySidebar: {
    backgroundColor: colors.surfaceWhite,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.medium,
  },
  summarySidebarTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: colors.brandNavy,
    letterSpacing: 0.8,
    marginBottom: spacing.md,
  },
  summaryBox: {
    gap: 8,
  },
  summaryItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sumLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  sumVal: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textDark,
    textAlign: 'right',
    maxWidth: '60%',
  },
  discountLabel: {
    fontSize: 12,
    color: colors.successGreen,
    fontWeight: '800',
  },
  discountVal: {
    fontSize: 12,
    color: colors.successGreen,
    fontWeight: '900',
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 4,
  },
  totalDivider: {
    height: 1.5,
    backgroundColor: colors.brandNavy,
    marginVertical: 6,
  },
  totalPayableLabel: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.brandNavy,
  },
  totalPayableValue: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.primaryBlue,
  },
});
