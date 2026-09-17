import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useBooking } from '../context/BookingContext';
import { colors, borderRadius, shadows, spacing } from '../theme';

export default function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const { role, setRole, draftLocation } = useBooking();

  const isDesktop = width >= 768;
  const isWasherMode = pathname.startsWith('/washer') || role === 'washer';

  const handleRoleToggle = (targetRole: 'customer' | 'washer') => {
    setRole(targetRole);
    if (targetRole === 'washer' && !pathname.startsWith('/washer')) {
      router.replace('/washer');
    } else if (targetRole === 'customer' && pathname.startsWith('/washer')) {
      router.replace('/customer');
    }
  };

  const navItems = isWasherMode
    ? [
        { label: 'Workbench', path: '/washer' },
        { label: 'Available Jobs', path: '/washer/jobs' },
        { label: 'Earnings', path: '/washer/earnings' },
        { label: 'Messages', path: '/washer/messages' },
        { label: 'Detailer Profile', path: '/washer/profile' },
      ]
    : [
        { label: 'Home', path: '/customer' },
        { label: 'Book Wash', path: '/customer/book' },
        { label: 'My Orders', path: '/customer/orders' },
        { label: 'Messages', path: '/customer/messages' },
        { label: 'Garage & Profile', path: '/customer/profile' },
      ];

  return (
    <View style={styles.headerWrapper}>
      <View style={[styles.headerContainer, isDesktop && styles.headerDesktopContainer]}>
        
        {/* Left: Brand Identity */}
        <TouchableOpacity
          style={styles.brandRow}
          onPress={() => router.push(isWasherMode ? '/washer' : '/customer')}
          activeOpacity={0.8}
        >
          <View style={[styles.logoBadge, isWasherMode && styles.logoBadgeWasher]}>
            <Text style={styles.logoIcon}>{isWasherMode ? '🛵' : '🧼'}</Text>
          </View>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={styles.brandTitle}>WashCar</Text>
              <View style={[styles.myTag, isWasherMode && styles.myTagWasher]}>
                <Text style={styles.myTagText}>MY 🇲🇾</Text>
              </View>
            </View>
            <Text style={styles.brandTagline}>
              {isWasherMode ? 'Pro Detailer Partner' : 'Doorstep Mobile Detailing'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Center: Desktop Navigation Links */}
        {isDesktop && (
          <View style={styles.navLinksRow}>
            {navItems.map((item) => {
              const isActive = pathname === item.path || (item.path === '/customer' && (pathname === '/' || pathname === '/customer/'));
              return (
                <TouchableOpacity
                  key={item.path}
                  style={[styles.navLinkItem, isActive && styles.navLinkItemActive]}
                  onPress={() => router.push(item.path as any)}
                >
                  <Text style={[styles.navLinkText, isActive && (isWasherMode ? styles.navTextActiveWasher : styles.navTextActiveCustomer)]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Right Controls: Location, Mode Switcher, Notifications, Profile */}
        <View style={styles.headerRight}>
          
          {/* Location Badge (Desktop/Tablet) */}
          {isDesktop && !isWasherMode && (
            <TouchableOpacity
              style={styles.locationPill}
              onPress={() => router.push('/customer/book')}
            >
              <Text style={styles.locationIcon}>📍</Text>
              <Text style={styles.locationText} numberOfLines={1}>
                {draftLocation?.city || 'Bangsar, KL'}
              </Text>
            </TouchableOpacity>
          )}

          {/* Role Segmented Switcher Pill */}
          <View style={styles.roleSwitcherPill}>
            <TouchableOpacity
              style={[styles.roleOption, !isWasherMode && styles.roleOptionActiveCustomer]}
              onPress={() => handleRoleToggle('customer')}
            >
              <Text style={[styles.roleOptionText, !isWasherMode && styles.roleOptionTextActive]}>
                Customer
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleOption, isWasherMode && styles.roleOptionActiveWasher]}
              onPress={() => handleRoleToggle('washer')}
            >
              <Text style={[styles.roleOptionText, isWasherMode && styles.roleOptionTextActive]}>
                Washer 🛵
              </Text>
            </TouchableOpacity>
          </View>

          {/* Notification Button */}
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => alert('Notifications: Your washer Amir is 8 minutes away!')}
          >
            <Text style={{ fontSize: 16 }}>🔔</Text>
            <View style={styles.notificationDot} />
          </TouchableOpacity>

          {/* Profile Avatar */}
          <TouchableOpacity onPress={() => router.push(isWasherMode ? '/washer/profile' : '/customer/profile')}>
            <Image
              source={{ uri: isWasherMode ? 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120' : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120' }}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    zIndex: 100,
    ...shadows.medium,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
  },
  headerDesktopContainer: {
    maxWidth: 1360,
    alignSelf: 'center',
    width: '100%',
  },

  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBadgeWasher: {
    backgroundColor: colors.washerAccent,
  },
  logoIcon: {
    fontSize: 20,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.3,
  },
  myTag: {
    backgroundColor: colors.primaryBlue,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
  },
  myTagWasher: {
    backgroundColor: colors.washerAccent,
  },
  myTagText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '900',
  },
  brandTagline: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 1,
    fontWeight: '500',
  },

  navLinksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1e293b',
    padding: 4,
    borderRadius: borderRadius.pill,
  },
  navLinkItem: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: borderRadius.pill,
  },
  navLinkItemActive: {
    backgroundColor: '#0f172a',
  },
  navLinkText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
  },
  navTextActiveCustomer: {
    color: '#38bdf8',
    fontWeight: '800',
  },
  navTextActiveWasher: {
    color: '#34d399',
    fontWeight: '800',
  },

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1e293b',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: borderRadius.pill,
    maxWidth: 140,
  },
  locationIcon: {
    fontSize: 12,
  },
  locationText: {
    color: '#e2e8f0',
    fontSize: 11,
    fontWeight: '700',
  },

  roleSwitcherPill: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    padding: 3,
    borderRadius: borderRadius.pill,
  },
  roleOption: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.pill,
  },
  roleOptionActiveCustomer: {
    backgroundColor: colors.primaryBlue,
  },
  roleOptionActiveWasher: {
    backgroundColor: colors.washerAccent,
  },
  roleOptionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
  },
  roleOptionTextActive: {
    color: '#ffffff',
    fontWeight: '900',
  },

  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    borderWidth: 1.5,
    borderColor: '#0f172a',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: colors.primaryBlue,
  },
});
