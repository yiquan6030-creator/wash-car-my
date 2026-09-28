import React from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useBooking } from '../context/BookingContext';
export default function AppHeader() {
    const c = useBooking();
    const router = useRouter();
    const { width } = useWindowDimensions();
    const prefix = c.role === 'washer' ? '/washer' : '/customer';
    const nav = c.role === 'washer' ? [['工作台', ''], ['待接订单', '/jobs'], ['收入', '/earnings'], ['消息', '/messages'], ['资料', '/profile']] : [['首页', ''], ['预约', '/book'], ['订单', '/orders'], ['消息', '/messages'], ['资料', '/profile']];
    return <View style={{ backgroundColor: '#102b46', paddingHorizontal: 16, paddingVertical: 14, gap: 12 }}><View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}><TouchableOpacity accessibilityRole="button" onPress={() => router.push(c.isAuthenticated ? prefix : '/')}><Text style={{ color: '#fff', fontSize: 21, fontWeight: '900' }}>🧼 WashCar <Text style={{ color: '#68d5de' }}>MY</Text></Text></TouchableOpacity><Text style={{ color: '#b4d0df', fontSize: 12 }}>上门洗车 · {c.isAuthenticated ? (c.role === 'washer' ? '洗车师' : '顾客') : '本地体验'}</Text></View>{width >= 768 && c.isAuthenticated && <View style={{ flexDirection: 'row', gap: 24, flexWrap: 'wrap' }}>{nav.map(([name, suffix]) => <TouchableOpacity key={name} accessibilityRole="button" onPress={() => router.push((prefix + suffix) as any)}><Text style={{ color: '#fff', fontWeight: '700' }}>{name}</Text></TouchableOpacity>)}</View>}</View>;
}
