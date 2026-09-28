import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Switch, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useBooking } from '../context/BookingContext';
import { isOpen, nextStatus, statusLabels } from '../services/bookingRules';
import { CustomerBooking, LocationAddress, VehicleTier } from '../types';
import { SERVICE_CATEGORIES } from '../services/mockData';
export const ui = StyleSheet.create({ page: { flex: 1, backgroundColor: '#f4f7fb' }, content: { padding: 20, paddingBottom: 100, width: '100%', maxWidth: 1040, alignSelf: 'center', gap: 16 }, title: { fontSize: 28, fontWeight: '800', color: '#102b46' }, sub: { color: '#61758b', lineHeight: 23 }, card: { backgroundColor: '#fff', padding: 22, borderRadius: 18, borderWidth: 1, borderColor: '#e0e8f0', gap: 12 }, heading: { fontSize: 19, fontWeight: '700', color: '#102b46' }, row: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, alignItems: 'center' }, btn: { backgroundColor: '#087ead', paddingHorizontal: 18, paddingVertical: 12, borderRadius: 10 }, btnText: { color: '#fff', fontWeight: '700' }, input: { padding: 13, borderWidth: 1, borderColor: '#cad6e3', borderRadius: 10, color: '#102b46', backgroundColor: '#fff', minHeight: 46 }, notice: { backgroundColor: '#e7f4fb', padding: 14, borderRadius: 12, color: '#17506c', lineHeight: 22 }, error: { color: '#a33421', padding: 12, backgroundColor: '#fff0e8', borderRadius: 10 } });
export function Button({ title, onPress, muted = false }: {
    title: string;
    onPress: () => void;
    muted?: boolean;
}) { return <TouchableOpacity accessibilityRole="button" onPress={onPress} style={[ui.btn, muted && { backgroundColor: '#52697c' }]}><Text style={ui.btnText}>{title}</Text></TouchableOpacity>; }
export function Field({ label, value, onChangeText, multiline = false }: {
    label: string;
    value: string;
    onChangeText: (v: string) => void;
    multiline?: boolean;
}) { return <View style={{ gap: 7 }}><Text style={ui.sub}>{label}</Text><TextInput accessibilityLabel={label} style={ui.input} value={value} onChangeText={onChangeText} multiline={multiline}/></View>; }
function Page({ title, children }: {
    title: string;
    children: React.ReactNode;
}) { return <ScrollView style={ui.page} contentContainerStyle={ui.content}><Text style={ui.title}>{title}</Text>{children}</ScrollView>; }
export function OrderScreen({ detail = false, washer = false }: {
    detail?: boolean;
    washer?: boolean;
}) {
    const c = useBooking();
    const router = useRouter();
    const [filter, setFilter] = useState('all');
    const [error, setError] = useState('');
    const [actionId, setActionId] = useState('');
    const [action, setAction] = useState('');
    const [reason, setReason] = useState('');
    const [date, setDate] = useState(c.scheduledDate);
    const [time, setTime] = useState('10:00');
    const [rating, setRating] = useState(5);
    const [review, setReview] = useState('');
    const [inspection, setInspection] = useState('');
    const run = (fn: () => void) => { try {
        fn();
        setError('');
    }
    catch (e) {
        setError((e as Error).message);
    } };
    const orders = detail ? (c.activeBooking ? [c.activeBooking] : []) : c.orders.filter(b => filter === 'all' || (filter === 'active' ? isOpen(b) : b.status === filter));
    return <Page title={washer ? '洗车师工作台' : detail ? '订单详情与服务进度' : '我的洗车订单'}>
    <Text style={ui.notice}>本地体验模式 · 数据保存在此设备。切换顾客 / 洗车师可体验完整流程；尚未连接线上派单、支付或实时定位。</Text>
    {washer && <View style={ui.card}><View style={ui.row}><Text style={ui.heading}>{c.isWasherOnline ? '在线接单' : '暂停接单'}</Text><Switch value={c.isWasherOnline} onValueChange={c.setIsWasherOnline}/></View><Text style={ui.sub}>今日完成 {c.washerCompletedJobsCount} 单 · 预计服务收入 RM {c.washerTodayEarnings.toFixed(2)}</Text><Button title="查看待接订单" onPress={() => router.push('/washer/jobs')}/></View>}
    {!detail && <View style={ui.row}>{[['all', '全部'], ['active', '进行中'], ['completed', '已完成'], ['cancelled', '已取消']].map(([id, label]) => <Button key={id} title={label} muted={filter !== id} onPress={() => setFilter(id)}/>)}</View>}
    {!!error && <Text accessibilityRole="alert" style={ui.error}>{error}</Text>}
    {!orders.length && <View style={ui.card}><Text style={ui.heading}>暂无订单</Text><Text style={ui.sub}>预约上门服务后，可以在这里查看进度。</Text><Button title={washer ? '查看待接订单' : '预约洗车'} onPress={() => router.push(washer ? '/washer/jobs' : '/customer/book')}/></View>}
    {orders.map(b => <View key={b.id} style={ui.card}>
      <View style={[ui.row, { justifyContent: 'space-between' }]}><Text style={ui.heading}>{b.service.icon} {b.service.name}</Text><Text style={ui.notice}>{statusLabels[b.status]}</Text></View>
      <Text style={ui.sub}>{b.id} · {new Date(b.createdAt).toLocaleString()}</Text><Text>{b.vehicle.plateNumber} · {b.vehicle.make} {b.vehicle.model}</Text>
      <Text>{b.location.addressLine1}, {b.location.city} {b.location.postcode}</Text><Text style={ui.sub}>{b.location.condoBuildingName} {b.location.unitParkingBay}</Text>
      <Text>{b.bookingType === 'scheduled' ? `${b.scheduledDate} ${b.scheduledTime}（马来西亚时间）` : '尽快上门 · 等待师傅确认时间'}</Text>
      {!!b.location.notesForWasher && <Text style={ui.notice}>上门备注：{b.location.notesForWasher}</Text>}
      <Text style={ui.sub}>服务及附加项 RM {b.subtotalMYR.toFixed(2)} + 服务费 RM {b.serviceFeeMYR.toFixed(2)} − 优惠 RM {b.discountMYR.toFixed(2)}</Text>
      <Text style={ui.heading}>{b.status === 'cancelled' ? '已取消 · 无需付款（原价 RM ' + b.totalMYR.toFixed(2) + '）' : '应付 RM ' + b.totalMYR.toFixed(2) + ' · 服务后付款'}</Text>
      {!!b.selectedAddons.length && <Text style={ui.sub}>{b.selectedAddons.map(a => a.name).join(' / ')}</Text>}
      {b.washer && <Text>服务师傅：{b.washer.name}</Text>}
      {detail && <View style={{ gap: 8 }}>{b.statusHistory?.map((h, i) => <Text key={i} style={ui.sub}>● {statusLabels[h.status]} · {new Date(h.at).toLocaleString()}</Text>)}</View>}
      {!!b.inspectionNotes && <Text style={ui.notice}>洗前记录：{b.inspectionNotes}</Text>}
      {!!b.cancelledReason && <Text style={ui.sub}>取消原因：{b.cancelledReason}</Text>}
      {b.userRating && <Text style={ui.notice}>{'★'.repeat(b.userRating)} {b.review || '已评价，感谢反馈'}</Text>}
      <View style={ui.row}>
        {!detail && <Button title="查看详情" onPress={() => { c.selectBooking(b.id); router.push('/customer/tracking'); }}/>}
        {isOpen(b) && <Button muted title="订单消息" onPress={() => { c.selectBooking(b.id); router.push(washer ? '/washer/messages' : '/customer/messages'); }}/>}
        {!washer && ['confirmed', 'assigned'].includes(b.status) && <Button muted title="取消订单" onPress={() => { setActionId(b.id); setAction('cancel'); }}/>}
        {!washer && b.status === 'confirmed' && <Button muted title="修改预约时间" onPress={() => { setActionId(b.id); setAction('schedule'); }}/>}
        {!washer && b.status === 'completed' && !b.userRating && <Button title="评价服务" onPress={() => { setActionId(b.id); setAction('rate'); }}/>}
        {!washer && !isOpen(b) && <Button title="再次预约" onPress={() => { c.setDraftService(b.service); if (c.savedVehicles.some(v => v.id === b.vehicle.id))
            c.setDraftVehicle(b.vehicle); c.setDraftLocation(b.location); router.push('/customer/book'); }}/>}
        {washer && b.status === 'confirmed' && <Button title="接下此订单" onPress={() => run(() => { if (!c.grabOrder(b.id))
            throw new Error('接单失败：请确认在线、服务能力匹配，且没有正在执行的订单'); })}/>}
        {washer && b.status === 'arrived' && <Button title="保存洗前检查" onPress={() => { setActionId(b.id); setAction('inspect'); setInspection(b.inspectionNotes || ''); }}/>}
        {washer && nextStatus[b.status] && <Button title={statusLabels[nextStatus[b.status]!]} onPress={() => run(() => c.updateBookingStatus(nextStatus[b.status]!))}/>}
      </View>
      {washer && b.status === 'washing' && <View style={{ gap: 10 }}><Text style={ui.heading}>完成服务检查项</Text>{b.service.features.map(task => <Button key={task} title={`${b.checklist?.includes(task) ? '✓' : '○'} ${task}`} muted={!b.checklist?.includes(task)} onPress={() => c.toggleTask(task)}/>)}</View>}
      {actionId === b.id && <View style={{ gap: 12 }}>
        {action === 'cancel' && <><Field label="取消原因" value={reason} onChangeText={setReason}/><Button title="确认取消" onPress={() => run(() => { c.cancelBooking(b.id, reason); setActionId(''); })}/></>}
        {action === 'schedule' && <><Field label="日期 YYYY-MM-DD" value={date} onChangeText={setDate}/><Field label="时间 HH:mm（08:00–18:00）" value={time} onChangeText={setTime}/><Button title="确认改期" onPress={() => run(() => { c.rescheduleBooking(b.id, date, time); setActionId(''); })}/></>}
        {action === 'rate' && <><View style={ui.row}>{[1, 2, 3, 4, 5].map(n => <Button key={n} title={`${n} ★`} muted={rating !== n} onPress={() => setRating(n)}/>)}</View><Field label="服务评价（选填）" value={review} onChangeText={setReview} multiline/><Button title="提交评价" onPress={() => run(() => { c.submitRating(rating, 0, review, b.id); setActionId(''); })}/></>}
        {action === 'inspect' && <><Field label="记录车辆状况及已有损伤，无损伤请明确填写" value={inspection} onChangeText={setInspection} multiline/><Button title="保存检查记录" onPress={() => run(() => { c.updateInspection(inspection); setActionId(''); })}/></>}
        <Button muted title="收起" onPress={() => setActionId('')}/>
      </View>}
    </View>)}
  </Page>;
}
export function MessagesScreen() {
    const c = useBooking();
    const [text, setText] = useState('');
    const [error, setError] = useState('');
    const b = c.activeBooking;
    return <Page title="订单消息"><Text style={ui.notice}>此处为本地订单留言，切换角色可查看。尚未连接在线聊天或客服。</Text><View style={ui.row}>{c.orders.map(o => <Button key={o.id} title={o.vehicle.plateNumber + ' · ' + statusLabels[o.status]} muted={b?.id !== o.id} onPress={() => c.selectBooking(o.id)}/>)}</View>{!b ? <Text>暂无订单，预约后可以留下上门说明。</Text> : <><Text style={ui.heading}>{b.id}</Text>{c.messages.filter(m => m.orderId === b.id).map(m => <View key={m.id} style={ui.card}><Text style={ui.sub}>{m.sender === 'washer' ? '洗车师' : '顾客'} · {new Date(m.at).toLocaleString()}</Text><Text>{m.text}</Text></View>)}<Field label="留言（最多 1000 字）" value={text} onChangeText={setText} multiline/>{!!error && <Text style={ui.error}>{error}</Text>}<Button title="保存留言" onPress={() => { try {
        c.sendMessage(b.id, text);
        setText('');
        setError('');
    }
    catch (e) {
        setError((e as Error).message);
    } }}/></>}</Page>;
}
export function AccountScreen() {
    const c = useBooking();
    const router = useRouter();
    const [message, setMessage] = useState('');
    const [name, setName] = useState(c.userProfile.name);
    const [phone, setPhone] = useState(c.userProfile.phone);
    const [plate, setPlate] = useState('');
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [tier, setTier] = useState<VehicleTier>('hatchback');
    const blank: LocationAddress = { id: '', label: '家', addressLine1: '', city: '', state: '', postcode: '', unitParkingBay: '', notesForWasher: '' };
    const [address, setAddress] = useState<LocationAddress>(blank);
    const run = (fn: () => void) => { try {
        fn();
        setMessage('已保存');
    }
    catch (e) {
        setMessage((e as Error).message);
    } };
    return <Page title="我的资料与上门地址"><Text style={ui.notice}>本地体验资料，非已验证账号。请勿在演示中填写敏感信息。</Text>{!!message && <Text accessibilityRole="alert" style={ui.notice}>{message}</Text>}
    <View style={ui.card}><Text style={ui.heading}>个人资料</Text><Field label="称呼" value={name} onChangeText={setName}/><Field label="联系电话" value={phone} onChangeText={setPhone}/><Button title="保存资料" onPress={() => run(() => { if (!name.trim())
        throw new Error('请填写称呼'); if (phone && !/^\+?[\d\s-]{8,20}$/.test(phone))
        throw new Error('请填写有效电话'); c.updateProfile({ ...c.userProfile, name: name.trim(), phone: phone.trim() }); })}/></View>
    <View style={ui.card}><Text style={ui.heading}>车辆管理</Text>{c.savedVehicles.map(v => <View key={v.id} style={ui.row}><Text style={{ flex: 1 }}>{v.plateNumber} · {v.make} {v.model}</Text><Button title={c.draftVehicle.id === v.id ? '已选' : '选择'} onPress={() => c.setDraftVehicle(v)}/><Button muted title="删除" onPress={() => run(() => c.removeVehicle(v.id))}/></View>)}<Field label="车牌" value={plate} onChangeText={setPlate}/><Field label="品牌" value={make} onChangeText={setMake}/><Field label="型号" value={model} onChangeText={setModel}/><View style={ui.row}>{(['hatchback', 'sedan', 'suv', 'mpv', 'pickup'] as const).map(v => <Button key={v} title={v} muted={tier !== v} onPress={() => setTier(v)}/>)}</View><Button title="添加车辆" onPress={() => run(() => { c.addVehicle({ plateNumber: plate, make, model, color: '', tier }); setPlate(''); setModel(''); })}/></View>
    <View style={ui.card}><Text style={ui.heading}>上门地址</Text>{c.savedLocations.map(l => <View key={l.id} style={{ gap: 8 }}><Text>{l.label} · {l.addressLine1}, {l.city}</Text><View style={ui.row}><Button title={c.draftLocation.id === l.id ? '已选' : '选择'} onPress={() => c.setDraftLocation(l)}/><Button muted title="编辑" onPress={() => setAddress(l)}/><Button muted title="删除" onPress={() => run(() => c.removeLocation(l.id))}/></View></View>)}
      {([['label', '地址名称'], ['addressLine1', '街道及门牌'], ['city', '城市'], ['state', '州属'], ['postcode', '五位邮编'], ['unitParkingBay', '楼层 / 停车位'], ['notesForWasher', '门禁、停车及上门备注']] as const).map(([key, label]) => <Field key={key} label={label} value={address[key] || ''} onChangeText={v => setAddress({ ...address, [key]: v })}/>)}
      <Button title={c.isLocatingGps ? '定位中…' : '使用当前位置并补全地址'} onPress={async () => { if (c.isLocatingGps)
        return; const loc = await c.fetchGpsLocation(); if (loc) {
        setAddress(loc);
        setMessage('已取得坐标，请核对并补全详细地址');
    }
    else
        setMessage('定位失败或权限未开启，请手动填写地址'); }}/>
      <View style={ui.row}><Button title="保存地址" onPress={() => run(() => { c.saveLocation({ ...address, id: address.id || `loc-${Date.now()}` }); setAddress(blank); })}/><Button muted title="新建地址" onPress={() => setAddress(blank)}/></View></View>
    <View style={ui.card}><Text style={ui.heading}>服务说明</Text><Text style={ui.sub}>• 预约时间为马来西亚时间，08:00–18:00，至少提前一小时。
• 师傅出发前可取消；待接单订单可改期。
• 请确保物业允许洗车，并提供可进入的停车位置。
• FIRSTWASH5 可用于首个有效订单，优惠 RM5。
• 支付、短信验证、在线客服与跨设备同步尚未接入。</Text></View>
    <Button muted title="退出本地体验" onPress={() => { c.logoutUser(); router.replace('/'); }}/>
  </Page>;
}
export function JobsScreen() { const c = useBooking(); const router = useRouter(); const [error, setError] = useState(''); return <Page title="可接上门洗车订单"><Text style={ui.notice}>只有此设备创建的订单会显示在这里。接单后请到工作台更新服务进度。</Text><View style={ui.card}><View style={ui.row}><Text>在线接单</Text><Switch value={c.isWasherOnline} onValueChange={c.setIsWasherOnline}/></View><Text style={ui.heading}>服务能力</Text><View style={ui.row}>{SERVICE_CATEGORIES.map(s => <Button key={s.id} title={s.name} muted={!c.washerOfferedServices.includes(s.id)} onPress={() => c.toggleWasherService(s.id)}/>)}</View></View>{!!error && <Text style={ui.error}>{error}</Text>}{!c.availableCustomerOrders.length && <Text>暂无待接订单。</Text>}{c.availableCustomerOrders.map(b => <View key={b.id} style={ui.card}><Text style={ui.heading}>{b.service.name} · RM {b.totalMYR.toFixed(2)}</Text><Text>{b.vehicle.plateNumber} · {b.location.addressLine1}</Text><Text>{b.scheduledDate ? `${b.scheduledDate} ${b.scheduledTime}` : '尽快上门'}</Text><Button title="确认接单" onPress={() => { if (c.grabOrder(b.id)) {
    router.replace('/washer');
}
else
    setError('接单失败：请开启在线状态、选择对应服务能力，并先完成当前服务'); }}/></View>)}</Page>; }
export function EarningsScreen() { const c = useBooking(); const completed = c.orders.filter(b => b.status === 'completed'); return <Page title="服务收入明细"><Text style={ui.notice}>预计收入按扣除服务费后的订单金额 × 80% 计算。未接入结算或提现，不代表已入账。</Text><View style={ui.card}><Text style={ui.heading}>今日预计收入 RM {c.washerTodayEarnings.toFixed(2)}</Text><Text>今日完成 {c.washerCompletedJobsCount} 单</Text></View>{!completed.length && <Text>完成服务后会显示明细。</Text>}{completed.map(b => <View key={b.id} style={ui.card}><Text>{b.id} · {b.service.name}</Text><Text style={ui.heading}>RM {((b.totalMYR - b.serviceFeeMYR) * 0.8).toFixed(2)}</Text><Text style={ui.sub}>{b.completedAt && new Date(b.completedAt).toLocaleString()}</Text></View>)}</Page>; }
