import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
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

  const menuSections: { title: string; items: MenuItem[] }[] = [
    {
      title: 'Account Settings',
      items: [
        { id: 'vehicles', label: 'My Vehicles Garage', icon: '🚗', badge: `${SAVED_VEHICLES.length} cars` },
        { id: 'addresses', label: 'Saved Addresses', icon: '📍', badge: `${SAVED_LOCATIONS.length} saved` },
        { id: 'payments', label: 'Payment Methods', icon: '💳', badge: 'FPX, TNG' },
        { id: 'promos', label: 'Promotions & Vouchers', icon: '🏷️', badge: '2 active' },
      ],
    },
    {
      title: 'Preferences & Support',
      items: [
        { id: 'notifications', label: 'Notifications', icon: '🔔' },
        { id: 'support', label: 'Help & Support', icon: '❓' },
        { id: 'terms', label: 'Terms & Privacy Policy', icon: '📜' },
      ],
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Header */}
      <View style={styles.profileCard}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' }} 
          style={styles.avatar} 
        />
        <Text style={styles.userName}>Lee Wei Jian</Text>
        <Text style={styles.userContact}>+60 12-345 6789 • weijian@example.com</Text>
        
        <View style={styles.vipBadge}>
          <Text style={styles.vipText}>🌟 WashPass VIP Member (Malaysia)</Text>
        </View>
      </View>

      {/* Menu Sections */}
      {menuSections.map((section, idx) => (
        <View key={idx} style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
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
                  <Text style={styles.chevron}>›</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      {/* Logout Button */}
      <TouchableOpacity 
        style={styles.logoutBtn}
        onPress={() => alert('Logged out successfully.')}
      >
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundLight },
  content: { padding: spacing.lg, paddingBottom: 40 },
  profileCard: { backgroundColor: '#ffffff', borderRadius: borderRadius.xl, padding: spacing.xl, alignItems: 'center', marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.borderLight, ...shadows.soft },
  avatar: { width: 72, height: 72, borderRadius: 36, marginBottom: 10, borderWidth: 2, borderColor: colors.primaryBlue },
  userName: { fontSize: 20, fontWeight: '900', color: colors.textDark },
  userContact: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  vipBadge: { backgroundColor: colors.primaryLight, paddingHorizontal: 12, paddingVertical: 6, borderRadius: borderRadius.pill, marginTop: 12 },
  vipText: { color: colors.primaryDark, fontSize: 11, fontWeight: '800' },
  sectionContainer: { marginBottom: spacing.lg },
  sectionTitle: { fontSize: 13, fontWeight: '800', color: colors.textMuted, marginBottom: 8, letterSpacing: 0.5 },
  menuCard: { backgroundColor: '#ffffff', borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.borderLight, ...shadows.soft },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.md },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  itemIcon: { fontSize: 18, marginRight: 10 },
  itemLabel: { fontSize: 14, fontWeight: '700', color: colors.textDark },
  itemBadge: { fontSize: 11, color: colors.primaryBlue, fontWeight: '800', marginRight: 6 },
  chevron: { fontSize: 18, color: colors.textMuted, fontWeight: '800' },
  logoutBtn: { backgroundColor: '#fef2f2', paddingVertical: 14, borderRadius: borderRadius.md, alignItems: 'center', borderWidth: 1, borderColor: '#fecaca', marginTop: spacing.md },
  logoutText: { color: '#dc2626', fontWeight: '900', fontSize: 14 },
});
