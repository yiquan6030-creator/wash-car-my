import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { BookingProvider } from '../src/context/BookingContext';
import DevModeSwitcher from '../src/components/DevModeSwitcher';
import BottomTabBar from '../src/components/BottomTabBar';

export default function RootLayout() {
  return (
    <BookingProvider>
      <StatusBar style="light" backgroundColor="#0f172a" />
      <View style={{ flex: 1 }}>
        <DevModeSwitcher />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#0284c7',
            },
            headerTintColor: '#ffffff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            contentStyle: {
              backgroundColor: '#f8fafc',
            },
          }}
        >
          <Stack.Screen 
            name="index" 
            options={{ title: 'WashCar MY 🇲🇾' }} 
          />
          <Stack.Screen 
            name="customer/index" 
            options={{ title: 'WashCar MY 🇲🇾' }} 
          />
          <Stack.Screen 
            name="customer/book" 
            options={{ title: 'Book a Car Wash' }} 
          />
          <Stack.Screen 
            name="customer/orders" 
            options={{ title: 'My Wash Orders' }} 
          />
          <Stack.Screen 
            name="customer/messages" 
            options={{ title: 'Chat with Detailer' }} 
          />
          <Stack.Screen 
            name="customer/service-detail" 
            options={{ title: 'Wash Package Details' }} 
          />
          <Stack.Screen 
            name="customer/searching" 
            options={{ title: 'Searching Washer...' }} 
          />
          <Stack.Screen 
            name="customer/tracking" 
            options={{ title: 'Live Washer Tracking 🛵' }} 
          />
          <Stack.Screen 
            name="customer/profile" 
            options={{ title: 'My Account & Garage' }} 
          />
          <Stack.Screen 
            name="washer/index" 
            options={{ title: 'Washer Workbench 🛵' }} 
          />
          <Stack.Screen 
            name="washer/jobs" 
            options={{ title: 'Available Wash Jobs' }} 
          />
          <Stack.Screen 
            name="washer/earnings" 
            options={{ title: 'My Earnings' }} 
          />
          <Stack.Screen 
            name="washer/messages" 
            options={{ title: 'Customer Chat' }} 
          />
          <Stack.Screen 
            name="washer/profile" 
            options={{ title: 'Detailer Rig Profile' }} 
          />
        </Stack>
        <BottomTabBar />
      </View>
    </BookingProvider>
  );
}
