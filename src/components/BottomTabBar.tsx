import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useBooking } from '../context/BookingContext';
import { colors, shadows } from '../theme';

export default function BottomTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const { isAuthenticated } = useBooking();

  // Hide mobile bottom navigation bar on desktop/tablet views, login screen, or unauthenticated state
  if (width >= 768 || pathname === '/' || !isAuthenticated) {
    return null;
  }

  const isWasherMode = pathname.startsWith('/washer');

  if (isWasherMode) {
    // Washer Bottom Navigation Tabs
    const tabs = [
      { id: 'home', label: 'Home', icon: '🏠', path: '/washer' },
      { id: 'jobs', label: 'Jobs', icon: '💼', path: '/washer/jobs' },
      { id: 'earnings', label: 'Earnings', icon: '💰', path: '/washer/earnings' },
      { id: 'messages', label: 'Messages', icon: '💬', path: '/washer/messages' },
      { id: 'profile', label: 'Profile', icon: '👤', path: '/washer/profile' },
    ];

    return (
      <View style={styles.tabContainer}>
        {tabs.map((tab) => {
          const isActive = pathname === tab.path || (tab.id === 'home' && (pathname === '/washer' || pathname === '/washer/'));
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tabItem}
              onPress={() => router.push(tab.path as any)}
              activeOpacity={0.8}
            >
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActiveWasher]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  // Customer Bottom Navigation Tabs
  const customerTabs = [
    { id: 'home', label: 'Home', icon: '🏠', path: '/customer' },
    { id: 'book', label: 'Book', icon: '🧼', path: '/customer/book' },
    { id: 'orders', label: 'Orders', icon: '📋', path: '/customer/orders' },
    { id: 'messages', label: 'Messages', icon: '💬', path: '/customer/messages' },
    { id: 'profile', label: 'Profile', icon: '👤', path: '/customer/profile' },
  ];

  return (
    <View style={styles.tabContainer}>
      {customerTabs.map((tab) => {
        const isActive = pathname === tab.path || (tab.id === 'home' && (pathname === '/' || pathname === '/customer' || pathname === '/customer/'));
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tabItem}
            onPress={() => router.push(tab.path as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActiveCustomer]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingVertical: 10,
    paddingBottom: 16,
    justifyContent: 'space-around',
    ...shadows.medium,
  },
  tabItem: {
    alignItems: 'center',
    flex: 1,
  },
  tabIcon: {
    fontSize: 19,
    marginBottom: 3,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
  },
  tabLabelActiveCustomer: {
    color: colors.primaryBlue,
    fontWeight: '900',
  },
  tabLabelActiveWasher: {
    color: colors.washerAccent,
    fontWeight: '900',
  },
});

