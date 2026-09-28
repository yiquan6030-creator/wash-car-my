import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useBooking } from '../../src/context/BookingContext';
import { SERVICE_CATEGORIES } from '../../src/services/mockData';
import { Button, ui } from '../../src/components/WorkflowScreens';
import { isOpen, statusLabels } from '../../src/services/bookingRules';
export default function Home() {
    const c = useBooking();
    const router = useRouter();
    const current = c.orders.find(isOpen);
    return <ScrollView style={ui.page} contentContainerStyle={ui.content}>
  <View style={styles.hero}><Text style={styles.tag}>WASHCAR MY / 上门洗车</Text><Text style={styles.title}>车停好，剩下的交给我们。</Text><Text style={styles.subtitle}>从日常清洗到深度护理，预约师傅到你的停车位。先选服务，再安排方便的时间。</Text><View style={ui.row}><Button title="预约上门洗车 →" onPress={() => router.push('/customer/book')}/><Button muted title="查看我的订单" onPress={() => router.push('/customer/orders')}/></View></View>
  <Text style={ui.notice}>本地体验版 · 可完成预约与服务流程演练，订单不会发送给真实洗车师。当前支持服务后付款记录。</Text>
  <View style={ui.card}><Text style={ui.heading}>本次上门信息</Text><Text>🚗 {c.draftVehicle.plateNumber} · {c.draftVehicle.make} {c.draftVehicle.model}</Text><Text>📍 {c.draftLocation.addressLine1}, {c.draftLocation.city}</Text><Button muted title="管理车辆与地址" onPress={() => router.push('/customer/profile')}/></View>
  {current && <View style={ui.card}><Text style={ui.heading}>进行中的预约 · {statusLabels[current.status]}</Text><Text>{current.service.name} / {current.vehicle.plateNumber}</Text><Text style={ui.sub}>{current.scheduledDate ? `${current.scheduledDate} ${current.scheduledTime}` : '尽快上门，等待师傅确认'}</Text><Button title="查看服务进度" onPress={() => { c.selectBooking(current.id); router.push('/customer/tracking'); }}/></View>}
  <Text style={ui.title}>为你的爱车选择服务</Text><Text style={ui.sub}>以下为掀背车起价；最终价格会按车型、附加服务及优惠计算。</Text>
  <View style={styles.grid}>{SERVICE_CATEGORIES.map(s => <TouchableOpacity accessibilityRole="button" key={s.id} style={[ui.card, styles.service]} onPress={() => { c.setDraftService(s); router.push({ pathname: '/customer/service-detail', params: { id: s.id } }); }}><Text style={{ fontSize: 32 }}>{s.icon}</Text><Text style={ui.heading}>{s.name}</Text><Text style={ui.sub}>{s.tagline}</Text><Text style={ui.heading}>RM {s.startingPriceMYR} 起</Text><Text style={ui.sub}>{s.durationRange}</Text><Text style={{ color: '#087ead', fontWeight: '700' }}>查看服务内容 →</Text></TouchableOpacity>)}</View>
  <View style={ui.card}><Text style={ui.heading}>首单优惠 RM5</Text><Text style={ui.sub}>在结算时输入 FIRSTWASH5。仅限首个未取消订单，不可叠加。</Text><Button title="使用优惠预约" onPress={() => { c.applyPromoCode('FIRSTWASH5'); router.push('/customer/book'); }}/></View>
  <View style={ui.card}><Text style={ui.heading}>上门前的小准备</Text><Text style={ui.sub}>1. 确认物业允许车辆清洗。
2. 填写准确门牌、停车位和门禁说明。
3. 收好贵重物品，并确认钥匙交接方式。
4. 如遇天气或场地限制，请通过订单留言协商。</Text></View>
 </ScrollView>;
}
const styles = StyleSheet.create({ hero: { backgroundColor: '#102b46', borderRadius: 24, padding: 30, gap: 20 }, tag: { color: '#68d5de', fontWeight: '800', letterSpacing: 2 }, title: { color: '#fff', fontSize: 34, fontWeight: '900', lineHeight: 46 }, subtitle: { color: '#cadce9', fontSize: 16, lineHeight: 26, maxWidth: 680 }, grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 }, service: { flexGrow: 1, flexBasis: 280 } });
