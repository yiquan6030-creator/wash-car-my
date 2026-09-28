import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, useWindowDimensions, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useBooking } from '../../src/context/BookingContext';
import { colors, spacing, borderRadius, shadows } from '../../src/theme';
import { SAVED_LOCATIONS } from '../../src/services/mockData';
import { VehicleTier } from '../../src/types';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  badge?: string;
}

export default function CustomerProfileScreen() {
  const router = useRouter();
  const { logoutUser, savedVehicles, addVehicle, removeVehicle, draftVehicle, setDraftVehicle, t } = useBooking();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  // Add Vehicle Modal/Form State
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newPlate, setNewPlate] = useState<string>('');
  const [newMake, setNewMake] = useState<string>('Perodua');
  const [newModel, setNewModel] = useState<string>('');
  const [newColor, setNewColor] = useState<string>('⚪ 珍珠白 (Platinum White)');
  const [newTier, setNewTier] = useState<VehicleTier>('hatchback');

  const makeOptions = ['Perodua', 'Proton', 'Honda', 'Toyota', 'BYD', 'Tesla', 'BMW', 'Mercedes'];
  const colorOptions = [
    '⚪ 珍珠白 (Platinum White)',
    '⚫ 曜石黑 (Obsidian Black)',
    '🔴 烈焰红 (Ruby Red)',
    '🔵 极光蓝 (Aurora Blue)',
    '🔘 钛银灰 (Titanium Silver)',
    '🟡 炫耀黄 (Sunburst Yellow)',
  ];
  const tierOptions: { key: VehicleTier; label: string }[] = [
    { key: 'hatchback', label: '掀背 Hatchback' },
    { key: 'sedan', label: '轿车 Sedan' },
    { key: 'suv', label: '越野 SUV' },
    { key: 'mpv', label: '商务 MPV' },
    { key: 'pickup', label: '皮卡 Pickup' },
  ];

  const handleSaveNewVehicle = () => {
    if (!newPlate.trim()) {
      alert('请填写车牌号码 (Please enter vehicle plate number, e.g. VGS 8888)');
      return;
    }
    if (!newModel.trim()) {
      alert('请填写车辆型号 (Please enter model, e.g. Myvi 1.5)');
      return;
    }

    addVehicle({
      plateNumber: newPlate.toUpperCase().trim(),
      make: newMake,
      model: newModel.trim(),
      color: newColor,
      tier: newTier,
    });

    setNewPlate('');
    setNewModel('');
    setShowAddForm(false);
    alert('🎉 新爱车已成功保存至您的车库！并已设为当前洗车车辆。');
  };

  const menuSections: { title: string; items: MenuItem[] }[] = [
    {
      title: 'Account Settings',
      items: [
        { id: 'vehicles', label: 'My Vehicle Garage', icon: '🚗', badge: `${savedVehicles.length} cars registered` },
        { id: 'addresses', label: 'Saved Addresses', icon: '📍', badge: `${SAVED_LOCATIONS.length} locations` },
        { id: 'payments', label: 'Payment Methods', icon: '💳', badge: 'FPX, DuitNow, TNG' },
        { id: 'promos', label: 'Promotions & Vouchers', icon: '🏷️', badge: '2 vouchers' },
      ],
    },
    {
      title: 'Preferences & Support',
      items: [
        { id: 'notifications', label: 'Notifications & Alerts', icon: '🔔' },
        { id: 'support', label: 'Customer Support & FAQ', icon: '❓' },
        { id: 'terms', label: 'Terms & Privacy Policy', icon: '📜' },
      ],
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={[styles.mainWrapper, isDesktop && styles.mainWrapperDesktop]}>

        {/* PROFILE HEADER CARD */}
        <View style={styles.profileCard}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' }} 
            style={styles.avatarImage} 
          />
          <Text style={styles.userNameText}>Lee Wei Jian</Text>
          <Text style={styles.userContactText}>+60 12-345 6789 • weijian@example.com</Text>
          
          <View style={styles.vipBadgePill}>
            <Text style={styles.vipBadgeText}>🌟 WashPass VIP Member (Kuala Lumpur)</Text>
          </View>
        </View>

        {/* SAVED GARAGE PREVIEW & SELF-SERVICE VEHICLE ADDITION */}
        <View style={styles.garagePreviewBox}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitleText}>SAVED VEHICLES GARAGE ({savedVehicles.length} Registered)</Text>
            <TouchableOpacity onPress={() => setShowAddForm(!showAddForm)}>
              <Text style={styles.addCarLink}>{showAddForm ? '取消 ▲' : '+ 添加新爱车 (+ Add Vehicle)'}</Text>
            </TouchableOpacity>
          </View>

          {/* ADD VEHICLE FORM CARD */}
          {showAddForm && (
            <View style={styles.addVehicleCard}>
              <Text style={styles.addFormTitle}>🚗 自行添加新爱车 (Register New Car)</Text>

              <View style={styles.formFieldGroup}>
                <Text style={styles.fieldLabel}>1. 车牌号码 (Plate Number):</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="例如: VGS 8888 / JWA 1234"
                  value={newPlate}
                  onChangeText={setNewPlate}
                  autoCapitalize="characters"
                />
              </View>

              <View style={styles.formFieldGroup}>
                <Text style={styles.fieldLabel}>2. 车辆品牌 (Vehicle Make):</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
                  {makeOptions.map((mk) => (
                    <TouchableOpacity
                      key={mk}
                      style={[styles.optionChip, newMake === mk && styles.optionChipActive]}
                      onPress={() => setNewMake(mk)}
                    >
                      <Text style={[styles.optionChipText, newMake === mk && styles.optionChipTextActive]}>{mk}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.formFieldGroup}>
                <Text style={styles.fieldLabel}>3. 车辆型号 (Model):</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="例如: Myvi 1.5 AV / X70 / City V / Model 3"
                  value={newModel}
                  onChangeText={setNewModel}
                />
              </View>

              <View style={styles.formFieldGroup}>
                <Text style={styles.fieldLabel}>4. 车身颜色 (Color & Badge):</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
                  {colorOptions.map((cl) => (
                    <TouchableOpacity
                      key={cl}
                      style={[styles.optionChip, newColor === cl && styles.optionChipActive]}
                      onPress={() => setNewColor(cl)}
                    >
                      <Text style={[styles.optionChipText, newColor === cl && styles.optionChipTextActive]}>{cl}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.formFieldGroup}>
                <Text style={styles.fieldLabel}>5. 车型分类 (Vehicle Tier):</Text>
                <View style={styles.tierGridRow}>
                  {tierOptions.map((tItem) => (
                    <TouchableOpacity
                      key={tItem.key}
                      style={[styles.tierChip, newTier === tItem.key && styles.tierChipActive]}
                      onPress={() => setNewTier(tItem.key)}
                    >
                      <Text style={[styles.tierChipText, newTier === tItem.key && styles.tierChipTextActive]}>
                        {tItem.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity style={styles.saveVehicleBtn} onPress={handleSaveNewVehicle} activeOpacity={0.9}>
                <Text style={styles.saveVehicleBtnText}>✅ 保存至我的车库 (Save to Garage)</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* VEHICLES CARDS LIST */}
          <View style={styles.garageCardsGrid}>
            {savedVehicles.map((v) => {
              const isActive = draftVehicle.id === v.id;
              return (
                <View key={v.id} style={[styles.garageCardItem, isActive && styles.garageCardItemActive]}>
                  <Text style={{ fontSize: 24 }}>🚗</Text>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={styles.garagePlateText}>{v.plateNumber}</Text>
                      {isActive && (
                        <View style={styles.activeTagPill}>
                          <Text style={styles.activeTagText}>当前预约车辆</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.garageModelText}>{v.make} {v.model} • {v.color}</Text>
                  </View>

                  <View style={{ alignItems: 'flex-end', gap: 6 }}>
                    <View style={styles.tierPillTag}>
                      <Text style={styles.tierPillText}>{v.tier.toUpperCase()}</Text>
                    </View>
                    {!isActive ? (
                      <TouchableOpacity onPress={() => setDraftVehicle(v)}>
                        <Text style={styles.setAsActiveLink}>设为默认 →</Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* MENU SECTIONS */}
        {menuSections.map((section, idx) => (
          <View key={idx} style={styles.sectionContainer}>
            <Text style={styles.sectionTitleText}>{section.title.toUpperCase()}</Text>
            <View style={styles.menuCard}>
              {section.items.map((item, itemIdx) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={[
                    styles.menuItem, 
                    itemIdx < section.items.length - 1 && styles.menuItemBorder
                  ]}
                  onPress={() => alert(`Opened ${item.label}`)}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.itemIcon}>{item.icon}</Text>
                    <Text style={styles.itemLabel}>{item.label}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {item.badge && <Text style={styles.itemBadge}>{item.badge}</Text>}
                    <Text style={styles.chevronText}>›</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* LOGOUT BUTTON */}
        <TouchableOpacity 
          style={styles.logoutBtn}
          onPress={() => {
            logoutUser();
            router.replace('/');
          }}
        >
          <Text style={styles.logoutText}>Log Out of WashCar MY</Text>
        </TouchableOpacity>

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
    maxWidth: 960,
    alignSelf: 'center',
    width: '100%',
    paddingVertical: spacing.xl,
  },

  profileCard: {
    backgroundColor: colors.surfaceWhite,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.medium,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
    borderWidth: 3,
    borderColor: colors.primaryBlue,
  },
  userNameText: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.brandNavy,
  },
  userContactText: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  vipBadgePill: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: borderRadius.pill,
    marginTop: 14,
  },
  vipBadgeText: {
    color: colors.primaryDark,
    fontSize: 11,
    fontWeight: '900',
  },

  garagePreviewBox: {
    marginBottom: spacing.xl,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitleText: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.textMuted,
    letterSpacing: 0.8,
  },
  addCarLink: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primaryBlue,
  },

  addVehicleCard: {
    backgroundColor: '#f8fafc',
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1.5,
    borderColor: colors.primaryBlue,
    marginBottom: spacing.lg,
    ...shadows.soft,
  },
  addFormTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.brandNavy,
    marginBottom: 12,
  },
  formFieldGroup: {
    marginBottom: 10,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textDark,
    marginBottom: 4,
  },
  formInput: {
    backgroundColor: '#ffffff',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    color: colors.textDark,
  },
  chipRow: {
    flexDirection: 'row',
  },
  optionChip: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    marginRight: 6,
  },
  optionChipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primaryBlue,
    borderWidth: 1.5,
  },
  optionChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  optionChipTextActive: {
    color: colors.primaryDark,
    fontWeight: '900',
  },
  tierGridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tierChip: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  tierChipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primaryBlue,
    borderWidth: 1.5,
  },
  tierChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  tierChipTextActive: {
    color: colors.primaryDark,
    fontWeight: '900',
  },
  saveVehicleBtn: {
    backgroundColor: colors.primaryBlue,
    paddingVertical: 12,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: 8,
  },
  saveVehicleBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
  },

  garageCardsGrid: {
    gap: spacing.md,
  },
  garageCardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceWhite,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.subtle,
  },
  garageCardItemActive: {
    borderColor: colors.primaryBlue,
    borderWidth: 2,
    backgroundColor: colors.primaryLight,
  },
  garagePlateText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textDark,
  },
  garageModelText: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },
  activeTagPill: {
    backgroundColor: colors.primaryBlue,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  activeTagText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '900',
  },
  tierPillTag: {
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.xs,
  },
  tierPillText: {
    fontSize: 9,
    fontWeight: '900',
    color: colors.textDark,
  },
  setAsActiveLink: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primaryBlue,
  },

  sectionContainer: {
    marginBottom: spacing.xl,
  },
  menuCard: {
    backgroundColor: colors.surfaceWhite,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginTop: 8,
    ...shadows.soft,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  itemIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  itemLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textDark,
  },
  itemBadge: {
    fontSize: 11,
    color: colors.primaryBlue,
    fontWeight: '800',
    marginRight: 8,
  },
  chevronText: {
    fontSize: 18,
    color: colors.textMuted,
    fontWeight: '800',
  },

  logoutBtn: {
    backgroundColor: '#fef2f2',
    paddingVertical: 14,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fecaca',
    marginTop: spacing.md,
  },
  logoutText: {
    color: '#dc2626',
    fontWeight: '900',
    fontSize: 14,
  },
});
