import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { BookingProvider } from '../src/context/BookingContext';
import AppHeader from '../src/components/AppHeader';
import DevModeSwitcher from '../src/components/DevModeSwitcher';
import BottomTabBar from '../src/components/BottomTabBar';

export default function RootLayout() {
  return (
    <BookingProvider>
      <StatusBar style="light" backgroundColor="#0f172a" />
      <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
        <AppHeader />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: '#f8fafc',
            },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="customer/index" />
          <Stack.Screen name="customer/book" />
          <Stack.Screen name="customer/orders" />
          <Stack.Screen name="customer/messages" />
          <Stack.Screen name="customer/service-detail" />
          <Stack.Screen name="customer/searching" />
          <Stack.Screen name="customer/tracking" />
          <Stack.Screen name="customer/profile" />
          <Stack.Screen name="washer/index" />
          <Stack.Screen name="washer/jobs" />
          <Stack.Screen name="washer/earnings" />
          <Stack.Screen name="washer/messages" />
          <Stack.Screen name="washer/profile" />
        </Stack>
        <BottomTabBar />
        <DevModeSwitcher />
      </View>
    </BookingProvider>
  );
}

