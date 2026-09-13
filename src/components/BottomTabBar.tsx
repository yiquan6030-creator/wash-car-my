import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, usePathname } from 'expo-router';

export default function BottomTabBar() {
  const router = useRouter();
  const pathname = usePathname();

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
    borderTopColor: '#e2e8f0',
    paddingVertical: 8,
    paddingBottom: 12,
    justifyContent: 'space-around',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  tabItem: {
    alignItems: 'center',
    flex: 1,
  },
  tabIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  tabLabelActiveCustomer: {
    color: '#0284c7',
    fontWeight: '800',
  },
  tabLabelActiveWasher: {
    color: '#16a34a',
    fontWeight: '800',
  },
});
