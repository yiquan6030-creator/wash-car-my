import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useBooking } from '../src/context/BookingContext';
import { Button, ui } from '../src/components/WorkflowScreens';
export default function Entrance() { const c = useBooking(); const router = useRouter(); return <ScrollView style={ui.page} contentContainerStyle={ui.content}><View style={[ui.card, { marginTop: 40, padding: 32, gap: 24 }]}><Text style={ui.sub}>WASHCAR MY · 上门洗车</Text><Text style={ui.title}>让洗车，配合你的生活。</Text><Text style={ui.sub}>选择套餐、车辆、上门地点与预约时间。顾客和洗车师使用同一份本地订单，体验完整服务流程。</Text><Text style={ui.notice}>当前为本地体验版，没有真实账号登录、在线支付或远程派单。数据保存在本设备，进入体验无需密码。</Text><Button title="我是顾客 · 预约洗车" onPress={() => { c.loginAsCustomer(); router.replace('/customer'); }}/><Button muted title="我是洗车师 · 服务工作台" onPress={() => { c.loginAsWasher(); router.replace('/washer'); }}/></View></ScrollView>; }
