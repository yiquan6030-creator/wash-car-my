import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useBooking } from '../../src/context/BookingContext';
import { colors, spacing, borderRadius, shadows } from '../../src/theme';
import { 
  SERVICE_CATEGORIES, 
  SAVED_VEHICLES, 
  SAVED_LOCATIONS, 
  SERVICE_ADDONS 
} from '../../src/services/mockData';
import { Vehicle, LocationAddress, PaymentMethodType, VehicleTier } from '../../src/types';

export default function MultiStepBookingScreen() {
  const router = useRouter();
  const { 
    draftService, setDraftService,
    draftVehicle, setDraftVehicle,
    draftLocation, setDraftLocation,
    draftBookingType, setDraftBookingType,
    scheduledDate, setScheduledDate,
    scheduledTime, setScheduledTime,
    selectedAddons, toggleAddon,
    discountMYR, applyPromoCode,
    confirmBooking 
  } = useBooking();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [promoInput, setPromoInput] = useState<string>('');
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethodType>('fpx');
  
  // Custom Location Notes Input
  const [washerNotes, setWasherNotes] = useState<string>('Basement B2, Bay #45. Please call when you arrive.');
  
  // Vehicle Type selector for Add Vehicle modal preview
  const [showAddVehicleModal, setShowAddVehicleModal] = useState<boolean>(false);
  const [newPlate, setNewPlate] = useState<string>('');
  const [newMakeModel, setNewMakeModel] = useState<string>('');
  const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleTier>('sedan');

  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.priceMYR, 0);
  const subtotal = draftService.startingPriceMYR + addonsTotal;
  const serviceFee = 2;
  const grandTotal = Math.max(0, subtotal + serviceFee - discountMYR);

  const handleApplyPromo = () => {
    const success = applyPromoCode(promoInput);
    if (success) {
      alert('Promo code applied! RM5 discount added.');
    } else {
      alert('Enter valid code (e.g. FIRSTWASH5) for RM5 discount!');
    }
  };

  const handleConfirmOrder = () => {
    confirmBooking(selectedPayment);
    router.replace('/customer/searching');
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
    setDraftVehicle(created);
    setShowAddVehicleModal(false);
    alert(`Added ${created.plateNumber} to garage!`);
  };

  return (
    <View style={styles.container}>
      {/* Stepper Navigation Header */}
      <View style={styles.stepperHeader}>
        <TouchableOpacity 
          onPress={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : router.back()}
          style={styles.backBtn}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.stepIndicator}>Step {currentStep} of 6</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content}>
        
        {/* STEP 1: CHOOSE SERVICE */}
        {currentStep === 1 && (
          <View style={styles.stepBox}>
            <Text style={styles.stepTitle}>STEP 1: Choose Wash Service</Text>
            <Text style={styles.stepSubtitle}>Select doorstep car wash package.</Text>

            {SERVICE_CATEGORIES.map((cat) => {
              const isSelected = draftService.id === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.cardSelect, isSelected && styles.cardSelected]}
                  onPress={() => setDraftService(cat)}
                  activeOpacity={0.8}
                >
                  <View style={styles.cardHeaderRow}>
                    <Text style={styles.cardIcon}>{cat.icon}</Text>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.cardTitle}>{cat.name}</Text>
                      <Text style={styles.cardSub}>{cat.tagline}</Text>
                    </View>
                    <Text style={styles.cardPrice}>RM{cat.startingPriceMYR}</Text>
                  </View>
                  <View style={styles.featureBox}>
                    {cat.features.map((f, i) => (
                      <Text key={i} style={styles.featureItem}>✓ {f}</Text>
                    ))}
                  </View>
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity style={styles.nextBtn} onPress={() => setCurrentStep(2)}>
              <Text style={styles.nextBtnText}>Continue to Choose Car →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 2: CHOOSE CAR */}
        {currentStep === 2 && (
          <View style={styles.stepBox}>
            <Text style={styles.stepTitle}>STEP 2: Choose Vehicle</Text>
            <Text style={styles.stepSubtitle}>Select from saved garage or add new vehicle.</Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <Text style={styles.subHeader}>Saved Vehicles</Text>
              <TouchableOpacity onPress={() => setShowAddVehicleModal(!showAddVehicleModal)}>
                <Text style={styles.addVehicleLink}>+ Add Vehicle</Text>
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

                <Text style={styles.inputLabel}>Vehicle Type / Tier:</Text>
                <View style={styles.tierGrid}>
                  {(['hatchback', 'sedan', 'suv', 'mpv', 'pickup'] as VehicleTier[]).map((t) => (
                    <TouchableOpacity
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

                <TouchableOpacity style={styles.saveVehicleBtn} onPress={handleAddCustomVehicle}>
                  <Text style={styles.saveVehicleText}>Save & Select Vehicle</Text>
                </TouchableOpacity>
              </View>
            )}

            {SAVED_VEHICLES.map((v) => {
              const isSelected = draftVehicle.id === v.id;
              return (
                <TouchableOpacity
                  key={v.id}
                  style={[styles.cardSelect, isSelected && styles.cardSelected]}
                  onPress={() => setDraftVehicle(v)}
                >
                  <View style={styles.cardHeaderRow}>
                    <Text style={{ fontSize: 24 }}>🚗</Text>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.cardTitle}>{v.plateNumber}</Text>
                      <Text style={styles.cardSub}>{v.make} {v.model} ({v.color})</Text>
                    </View>
                    <Text style={styles.tierTag}>{v.tier.toUpperCase()}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity style={styles.nextBtn} onPress={() => setCurrentStep(3)}>
              <Text style={styles.nextBtnText}>Continue to Choose Location →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 3: CHOOSE LOCATION */}
        {currentStep === 3 && (
          <View style={styles.stepBox}>
            <Text style={styles.stepTitle}>STEP 3: Choose Location</Text>
            <Text style={styles.stepSubtitle}>Select doorstep wash address and add parking notes.</Text>

            {SAVED_LOCATIONS.map((loc) => {
              const isSelected = draftLocation.id === loc.id;
              return (
                <TouchableOpacity
                  key={loc.id}
                  style={[styles.cardSelect, isSelected && styles.cardSelected]}
                  onPress={() => setDraftLocation(loc)}
                >
                  <Text style={styles.cardTitle}>📍 {loc.label}</Text>
                  <Text style={styles.cardSub}>{loc.addressLine1}, {loc.city}</Text>
                  {loc.condoBuildingName && (
                    <Text style={styles.condoText}>🏢 {loc.condoBuildingName} ({loc.unitParkingBay || 'N/A'})</Text>
                  )}
                </TouchableOpacity>
              );
            })}

            {/* Custom Notes for Washer */}
            <Text style={styles.subHeader}>Notes for Washer (Parking Bay / Lift Lobby):</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="e.g. Basement B2, Parked near lift lobby, Please call when you arrive"
              value={washerNotes}
              onChangeText={setWasherNotes}
              multiline
              numberOfLines={2}
            />

            <TouchableOpacity style={styles.nextBtn} onPress={() => setCurrentStep(4)}>
              <Text style={styles.nextBtnText}>Continue to Booking Type →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 4: CHOOSE BOOKING TYPE */}
        {currentStep === 4 && (
          <View style={styles.stepBox}>
            <Text style={styles.stepTitle}>STEP 4: Wash Now or Schedule</Text>
            <Text style={styles.stepSubtitle}>Immediate express wash or reserve a future slot.</Text>

            <TouchableOpacity
              style={[styles.cardSelect, draftBookingType === 'now' && styles.cardSelected]}
              onPress={() => setDraftBookingType('now')}
            >
              <Text style={styles.cardTitle}>⚡ Wash Now (Express)</Text>
              <Text style={styles.cardSub}>Find available nearby detailer arriving in 30 mins.</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.cardSelect, draftBookingType === 'scheduled' && styles.cardSelected]}
              onPress={() => setDraftBookingType('scheduled')}
            >
              <Text style={styles.cardTitle}>📅 Schedule for Later</Text>
              <Text style={styles.cardSub}>Select date & time slot for mobile wash.</Text>
            </TouchableOpacity>

            {draftBookingType === 'scheduled' && (
              <View style={styles.scheduleBox}>
                <Text style={styles.inputLabel}>Select Date:</Text>
                <TextInput style={styles.input} value={scheduledDate} onChangeText={setScheduledDate} />
                <Text style={styles.inputLabel}>Select Time Slot:</Text>
                <TextInput style={styles.input} value={scheduledTime} onChangeText={setScheduledTime} />
              </View>
            )}

            <TouchableOpacity style={styles.nextBtn} onPress={() => setCurrentStep(5)}>
              <Text style={styles.nextBtnText}>Continue to Add-ons →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 5: ADD-ONS */}
        {currentStep === 5 && (
          <View style={styles.stepBox}>
            <Text style={styles.stepTitle}>STEP 5: Optional Add-ons</Text>
            <Text style={styles.stepSubtitle}>Enhance your wash with specialized treatments.</Text>

            {SERVICE_ADDONS.map((addon) => {
              const isChecked = selectedAddons.some(a => a.id === addon.id);
              return (
                <TouchableOpacity
                  key={addon.id}
                  style={[styles.cardSelect, isChecked && styles.cardSelected]}
                  onPress={() => toggleAddon(addon)}
                >
                  <View style={styles.cardHeaderRow}>
                    <Text style={{ fontSize: 22 }}>{addon.icon}</Text>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.cardTitle}>{addon.name}</Text>
                      <Text style={styles.cardSub}>{addon.description}</Text>
                    </View>
                    <Text style={styles.cardPrice}>+RM{addon.priceMYR}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity style={styles.nextBtn} onPress={() => setCurrentStep(6)}>
              <Text style={styles.nextBtnText}>Review Checkout →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 6: CHECKOUT & PAYMENT */}
        {currentStep === 6 && (
          <View style={styles.stepBox}>
            <Text style={styles.stepTitle}>STEP 6: Checkout & Payment</Text>
            <Text style={styles.stepSubtitle}>Review summary and select payment method.</Text>

            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}><Text style={styles.sumLabel}>Service:</Text><Text style={styles.sumVal}>{draftService.name}</Text></View>
              <View style={styles.summaryRow}><Text style={styles.sumLabel}>Vehicle:</Text><Text style={styles.sumVal}>{draftVehicle.plateNumber} ({draftVehicle.make} {draftVehicle.model})</Text></View>
              <View style={styles.summaryRow}><Text style={styles.sumLabel}>Location:</Text><Text style={styles.sumVal}>{draftLocation.addressLine1}, {draftLocation.city}</Text></View>
              <View style={styles.summaryRow}><Text style={styles.sumLabel}>Notes:</Text><Text style={styles.sumVal}>{washerNotes}</Text></View>
              <View style={styles.summaryRow}><Text style={styles.sumLabel}>Timing:</Text><Text style={styles.sumVal}>{draftBookingType === 'now' ? 'Wash Now (ASAP)' : `${scheduledDate} ${scheduledTime}`}</Text></View>
              
              {selectedAddons.length > 0 && (
                <View style={styles.summaryRow}>
                  <Text style={styles.sumLabel}>Add-ons:</Text>
                  <Text style={styles.sumVal}>{selectedAddons.map(a => a.name).join(', ')}</Text>
                </View>
              )}

              <View style={styles.divider} />

              <View style={styles.summaryRow}><Text style={styles.sumLabel}>Subtotal:</Text><Text style={styles.sumVal}>RM {subtotal}</Text></View>
              <View style={styles.summaryRow}><Text style={styles.sumLabel}>Service Fee:</Text><Text style={styles.sumVal}>RM {serviceFee}</Text></View>
              {discountMYR > 0 && (
                <View style={styles.summaryRow}><Text style={styles.discountLabel}>Promo Discount:</Text><Text style={styles.discountVal}>-RM {discountMYR}</Text></View>
              )}
              <View style={styles.summaryRow}><Text style={styles.totalLabel}>Total Payable:</Text><Text style={styles.totalVal}>RM {grandTotal}</Text></View>
            </View>

            {/* Promo Code Entry */}
            <View style={styles.promoRow}>
              <TextInput
                style={styles.promoInput}
                placeholder="PROMO CODE (e.g. FIRSTWASH5)"
                value={promoInput}
                onChangeText={setPromoInput}
                autoCapitalize="characters"
              />
              <TouchableOpacity style={styles.applyBtn} onPress={handleApplyPromo}>
                <Text style={styles.applyBtnText}>Apply</Text>
              </TouchableOpacity>
            </View>

            {/* Payment Method Selector */}
            <Text style={styles.subHeader}>Payment Method (Malaysia)</Text>
            <View style={styles.paymentGrid}>
              <TouchableOpacity 
                style={[styles.payBtn, selectedPayment === 'fpx' && styles.payBtnSelected]} 
                onPress={() => setSelectedPayment('fpx')}
              >
                <Text style={styles.payText}>🏦 FPX</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.payBtn, selectedPayment === 'duitnow' && styles.payBtnSelected]} 
                onPress={() => setSelectedPayment('duitnow')}
              >
                <Text style={styles.payText}>📲 DuitNow</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.payBtn, selectedPayment === 'card' && styles.payBtnSelected]} 
                onPress={() => setSelectedPayment('card')}
              >
                <Text style={styles.payText}>💳 Card</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.payBtn, selectedPayment === 'tng_ewallet' && styles.payBtnSelected]} 
                onPress={() => setSelectedPayment('tng_ewallet')}
              >
                <Text style={styles.payText}>🟦 TNG Wallet</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirmOrder} activeOpacity={0.9}>
              <Text style={styles.confirmBtnText}>Confirm & Pay (RM {grandTotal}) →</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundLight },
  stepperHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.md, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  backBtn: { paddingVertical: 4, paddingHorizontal: 8 },
  backText: { color: colors.textMuted, fontWeight: '800', fontSize: 13 },
  stepIndicator: { fontSize: 12, fontWeight: '900', color: colors.primaryBlue },
  content: { padding: spacing.lg, paddingBottom: 40 },
  stepBox: { marginBottom: 12 },
  stepTitle: { fontSize: 20, fontWeight: '900', color: colors.textDark },
  stepSubtitle: { fontSize: 12, color: colors.textMuted, marginBottom: spacing.md },
  subHeader: { fontSize: 13, fontWeight: '800', color: colors.textDark, marginTop: spacing.md, marginBottom: 6 },
  addVehicleLink: { fontSize: 12, fontWeight: '800', color: colors.primaryBlue },
  addVehicleBox: { backgroundColor: '#ffffff', padding: spacing.md, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.primaryBlue, marginBottom: spacing.md, ...shadows.soft },
  tierGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: 8 },
  tierBtn: { backgroundColor: colors.backgroundLight, paddingHorizontal: 10, paddingVertical: 6, borderRadius: borderRadius.sm, borderWidth: 1, borderColor: colors.borderLight },
  tierBtnSelected: { backgroundColor: colors.primaryBlue, borderColor: colors.primaryBlue },
  tierBtnText: { fontSize: 10, fontWeight: '800', color: colors.textDark },
  tierBtnTextSelected: { color: '#ffffff' },
  saveVehicleBtn: { backgroundColor: colors.primaryBlue, paddingVertical: 10, borderRadius: borderRadius.sm, alignItems: 'center', marginTop: 8 },
  saveVehicleText: { color: '#ffffff', fontWeight: '800', fontSize: 12 },
  cardSelect: { backgroundColor: '#ffffff', borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.borderLight, ...shadows.soft },
  cardSelected: { borderColor: colors.primaryBlue, borderWidth: 2, backgroundColor: colors.primaryLight },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center' },
  cardIcon: { fontSize: 24 },
  cardTitle: { fontSize: 15, fontWeight: '800', color: colors.textDark },
  cardSub: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  cardPrice: { fontSize: 15, fontWeight: '900', color: colors.primaryBlue },
  tierTag: { fontSize: 9, fontWeight: '800', backgroundColor: colors.borderLight, color: colors.textDark, paddingHorizontal: 6, paddingVertical: 2, borderRadius: borderRadius.sm },
  featureBox: { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.borderLight },
  featureItem: { fontSize: 11, color: colors.textDark, marginBottom: 2 },
  condoText: { fontSize: 11, color: colors.primaryDark, marginTop: 4, fontWeight: '700' },
  notesInput: { backgroundColor: '#ffffff', borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.borderLight, padding: spacing.md, fontSize: 12, color: colors.textDark, textAlignVertical: 'top', marginBottom: spacing.md },
  nextBtn: { backgroundColor: colors.primaryBlue, paddingVertical: 14, borderRadius: borderRadius.md, alignItems: 'center', marginTop: spacing.md },
  nextBtnText: { color: '#ffffff', fontWeight: '900', fontSize: 15 },
  scheduleBox: { backgroundColor: '#ffffff', padding: spacing.md, borderRadius: borderRadius.md, marginBottom: spacing.md },
  inputLabel: { fontSize: 11, fontWeight: '800', color: colors.textMuted, marginBottom: 2 },
  input: { backgroundColor: colors.backgroundLight, borderRadius: borderRadius.sm, borderWidth: 1, borderColor: colors.borderLight, padding: 8, fontSize: 13, marginBottom: 8 },
  summaryCard: { backgroundColor: '#ffffff', borderRadius: borderRadius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.borderLight, marginBottom: spacing.md, ...shadows.soft },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  sumLabel: { fontSize: 12, color: colors.textMuted },
  sumVal: { fontSize: 12, fontWeight: '800', color: colors.textDark, width: '60%', textAlign: 'right' },
  discountLabel: { fontSize: 12, color: colors.successGreen, fontWeight: '800' },
  discountVal: { fontSize: 12, color: colors.successGreen, fontWeight: '900' },
  totalLabel: { fontSize: 15, fontWeight: '900', color: colors.textDark },
  totalVal: { fontSize: 20, fontWeight: '900', color: colors.primaryBlue },
  divider: { height: 1, backgroundColor: colors.borderLight, marginVertical: 8 },
  promoRow: { flexDirection: 'row', gap: 8, marginBottom: spacing.md },
  promoInput: { flex: 1, backgroundColor: '#ffffff', borderRadius: borderRadius.sm, borderWidth: 1, borderColor: colors.borderLight, paddingHorizontal: 10, fontSize: 12, fontWeight: '800' },
  applyBtn: { backgroundColor: colors.brandNavy, paddingHorizontal: 16, borderRadius: borderRadius.sm, justifyContent: 'center' },
  applyBtnText: { color: '#ffffff', fontWeight: '800', fontSize: 12 },
  paymentGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.lg },
  payBtn: { width: '48%', backgroundColor: '#ffffff', paddingVertical: 12, borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.borderLight, alignItems: 'center' },
  payBtnSelected: { borderColor: colors.primaryBlue, borderWidth: 2, backgroundColor: colors.primaryLight },
  payText: { fontSize: 13, fontWeight: '800', color: colors.textDark },
  confirmBtn: { backgroundColor: colors.successGreen, paddingVertical: 16, borderRadius: borderRadius.md, alignItems: 'center' },
  confirmBtnText: { color: '#ffffff', fontWeight: '900', fontSize: 16 },
});
