import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useBooking } from '../context/BookingContext';
export default function RoleSwitcher() { const c = useBooking(); const router = useRouter(); if (!c.isAuthenticated)
    return null; return <View style={{ padding: 8, backgroundColor: '#e7f4fb', flexDirection: 'row', justifyContent: 'center', gap: 12 }}><Text style={{ color: '#17506c' }}>本地体验 · {c.role === 'washer' ? '洗车师' : '顾客'}</Text><TouchableOpacity accessibilityRole="button" onPress={() => { const washer = c.role !== 'washer'; c.setRole(washer ? 'washer' : 'customer'); router.replace(washer ? '/washer' : '/customer'); }}><Text style={{ color: '#087ead', fontWeight: '800' }}>切换到{c.role === 'washer' ? '顾客' : '洗车师'} →</Text></TouchableOpacity></View>; }
