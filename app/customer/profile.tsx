import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, borderRadius, shadows } from '../../src/theme';
import { SAVED_VEHICLES, SAVED_LOCATIONS } from '../../src/services/mockData';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  badge?: string;
}

export default function CustomerProfileScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const menuSections: { title: string; items: MenuItem[] }[] = [
    {
      title: 'Account Settings',
      items: [
        { id: 'vehicles', label: 'My Vehicle Garage', icon: '🚗', badge: `${SAVED_VEHICLES.length} cars registered` },
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

        {/* SAVED GARAGE PREVIEW */}
        <View style={styles.garagePreviewBox}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitleText}>SAVED VEHICLES GARAGE</Text>
            <TouchableOpacity onPress={() => router.push('/customer/book')}>
              <Text style={styles.addCarLink}>+ Add New Car</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.garageCardsGrid}>
            {SAVED_VEHICLES.map((v) => (
              <View key={v.id} style={styles.garageCardItem}>
                <Text style={{ fontSize: 24 }}>🚗</Text>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.garagePlateText}>{v.plateNumber}</Text>
                  <Text style={styles.garageModelText}>{v.make} {v.model} ({v.color})</Text>
                </View>
                <View style={styles.tierPillTag}>
                  <Text style={styles.tierPillText}>{v.tier.toUpperCase()}</Text>
                </View>
              </View>
            ))}
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
          onPress={() => alert('Logged out successfully.')}
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
