import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Modal, useWindowDimensions, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Search, LocateFixed, ChevronRight, X, Car, Clock3, Check, Navigation, SlidersHorizontal } from 'lucide-react-native';
import { useBooking } from '../../src/context/BookingContext';
import { SERVICE_CATEGORIES } from '../../src/services/mockData';
import { isOpen, servicePrice, statusLabels } from '../../src/services/bookingRules';
import { MapPoint, reverseAddress, searchAddresses, validPoint } from '../../src/services/geocoding';
import LocationMap from '../../src/components/LocationMap';
import { LocationAddress } from '../../src/types';
const green = '#008f64';
const serviceNames: Record<string,string> = { exterior_wash: '车身快洗', interior_exterior: '内外精洗', low_water_eco: '环保少水洗', steam_detailing: '蒸汽深度护理' };
export default function Home() {
  const c = useBooking(); const router = useRouter(); const { width, height } = useWindowDimensions();
  const desktop = width >= 900;
  const initialPoint = validPoint(c.draftLocation) ? c.draftLocation : { latitude: 3.1293, longitude: 101.6784 };
  const [target, setTarget] = useState({ latitude: initialPoint.latitude, longitude: initialPoint.longitude, revision: 0 });
  const [pin, setPin] = useState<MapPoint>(initialPoint);
  const [pending, setPending] = useState(!validPoint(c.draftLocation));
  const [sheet, setSheet] = useState<'search' | 'address' | 'vehicle' | null>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationAddress[]>([]);
  const [searched, setSearched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [editor, setEditor] = useState<LocationAddress>(c.draftLocation);
  const requestId = useRef(0);
  const current = c.orders.find(isOpen);
  const basePrice = servicePrice(c.draftService, c.draftVehicle.tier);
  const recenter = (point: MapPoint) => { setPin(point); setTarget(p => ({ ...point, revision: p.revision + 1 })); };
  useEffect(() => {
    if (validPoint(c.draftLocation)) { recenter(c.draftLocation); setPending(false); }
    else setPending(true);
  }, [c.draftLocation.id, c.draftLocation.latitude, c.draftLocation.longitude]);
  useEffect(() => () => { requestId.current++; }, []);
  const blankAt = (point: MapPoint): LocationAddress => ({ id: `pin-${Date.now()}`, label: '上门位置', addressLine1: '', city: '', state: '', postcode: '', unitParkingBay: '', notesForWasher: '', ...point });
  const chooseSaved = (location: LocationAddress) => {
    requestId.current++; setBusy(false); setNotice(''); setSheet(null);
    c.setDraftLocation(location);
    if (validPoint(location)) { recenter(location); setPending(false); }
    else { setEditor(location); setSheet('address'); setNotice('此地址没有坐标，可填写完整地址预约，或先在地图选点。'); }
  };
  const find = async () => {
    if (busy) return;
    const id = ++requestId.current; setBusy(true); setNotice(''); setSearched(false);
    try { const found = await searchAddresses(query); if (id === requestId.current) { setResults(found); setSearched(true); } }
    catch(e) { if (id === requestId.current) setNotice((e as Error).message); }
    finally { if (id === requestId.current) setBusy(false); }
  };
  const identifyPin = async (point = pin) => {
    const id = ++requestId.current; setBusy(true); setNotice(''); setEditor(blankAt(point)); setSheet('address');
    try { const location = await reverseAddress(point); if (id === requestId.current) setEditor(location); }
    catch { if (id === requestId.current) setNotice('无法自动识别街道，请填写地址、城市和邮编；选中的坐标已保留。'); }
    finally { if (id === requestId.current) setBusy(false); }
  };
  const locate = async () => {
    if (c.isLocatingGps || busy) return;
    const id = ++requestId.current;
    setNotice('');
    const location = await c.fetchGpsLocation(false);
    if (id !== requestId.current) return;
    if (!location || !validPoint(location)) { setNotice('定位未成功，请允许位置权限，或搜索 / 手动选择上门地址。'); return; }
    recenter(location); setPending(true); await identifyPin(location);
  };
  const save = () => {
    try {
      c.saveLocation({ ...editor, addressLine1: editor.addressLine1.trim(), city: editor.city.trim(), postcode: editor.postcode.trim() });
      setPending(false); setSheet(null); setNotice('');
      if (validPoint(editor)) recenter(editor);
    } catch(e) { setNotice((e as Error).message); }
  };
  const onMapSelect = (point: MapPoint) => { if (!validPoint(point)) return; requestId.current++; setBusy(false); setPin(point); setPending(true); setNotice(''); };
  const close = () => { requestId.current++; setBusy(false); setSheet(null); setNotice(''); };
  const panelHeight = Math.min(310, Math.max(285, height * 0.43));
  return <View style={s.page}>
    <View style={[s.map, { bottom: desktop ? 0 : panelHeight - 20, left: desktop ? 410 : 0 }]}>
      <LocationMap target={target} onSelect={onMapSelect} />
      <View style={s.searchOverlay}>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="搜索上门地址" style={s.searchBar} onPress={() => { setSheet('search'); setNotice(''); }}>
          <View style={s.searchIcon}><Search color={green} size={20}/></View><View style={{flex:1}}><Text style={s.eyebrow}>洗车师去哪里？</Text><Text style={s.searchText} numberOfLines={1}>{c.draftLocation.addressLine1 || '搜索公寓、商场或街道'}</Text></View><SlidersHorizontal size={18} color="#577065"/>
        </TouchableOpacity>
        {desktop && <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.savedRow}>
          {c.savedLocations.slice(0,4).map((location,i) => <TouchableOpacity key={location.id} accessibilityRole="button" accessibilityLabel={`选择常用地址 ${location.label}`} onPress={() => chooseSaved(location)} style={[s.savedChip,c.draftLocation.id===location.id && s.savedSelected]}><MapPin size={13} color={green}/><Text numberOfLines={1} style={s.savedText}>{i===0?'家 · ':''}{location.label.replace(/📍/g,'')}</Text></TouchableOpacity>)}
        </ScrollView>}
      </View>
      <View pointerEvents="none" style={s.pinCaption}><Text style={s.pinCaptionText}>{pending ? '松开地图后，确认这个停车位置' : '上门洗车地点'}</Text></View>
      <TouchableOpacity accessibilityRole="button" accessibilityLabel="定位到我的当前位置" style={s.locate} onPress={locate}>{c.isLocatingGps?<ActivityIndicator color={green}/>:<LocateFixed size={23} color={green}/>}</TouchableOpacity>
      {pending && <TouchableOpacity accessibilityRole="button" style={s.pinConfirm} onPress={() => identifyPin()}><Check size={15} color="#fff"/><Text style={s.white}>确认地图位置</Text></TouchableOpacity>}
    </View>
    <View style={[s.panel, desktop ? s.desktopPanel : { height: panelHeight }]}>
      {!desktop && <View style={s.handle}/>}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.panelContent}>
        {desktop && <View style={s.titleRow}><View><Text style={s.title}>洗车，上门就好。</Text><Text style={s.subtitle}>选好位置与服务，剩下的交给我们</Text></View><View style={s.doorstep}><Car color={green} size={22}/></View></View>}
        {!!notice && !sheet && <Text accessibilityRole="alert" style={s.notice}>{notice}</Text>}
        {current && <TouchableOpacity accessibilityRole="button" style={s.orderStrip} onPress={() => { c.selectBooking(current.id); router.push('/customer/tracking'); }}><Navigation color={green} size={17}/><Text style={{flex:1,color:'#155b43',fontSize:12}}>当前订单 · {statusLabels[current.status]}</Text><ChevronRight size={16} color={green}/></TouchableOpacity>}
        <TouchableOpacity accessibilityRole="button" style={s.locationRow} onPress={() => { if (pending) { identifyPin(); return; } setEditor(c.draftLocation); setSheet('address'); setNotice(''); }}><MapPin size={20} color={green}/><View style={{flex:1}}><Text style={s.locationTitle} numberOfLines={1}>{pending ? '地图位置待确认' : c.draftLocation.label.replace('实时 GPS 定位', '示例地址')}</Text><Text style={s.locationSub} numberOfLines={1}>{pending ? `${pin.latitude.toFixed(5)}, ${pin.longitude.toFixed(5)}` : c.draftLocation.unitParkingBay || c.draftLocation.addressLine1}</Text></View><ChevronRight size={17} color="#9aaa9f"/></TouchableOpacity>
        <View style={s.optionsRow}>
          <TouchableOpacity accessibilityRole="button" style={s.option} onPress={() => setSheet('vehicle')}><Car size={16} color="#426255"/><Text style={s.optionText}>{c.draftVehicle.plateNumber}</Text><ChevronRight size={13} color="#789085"/></TouchableOpacity>
          <TouchableOpacity accessibilityRole="button" style={s.option} onPress={() => c.setDraftBookingType(c.draftBookingType==='now'?'scheduled':'now')}><Clock3 size={16} color="#426255"/><Text style={s.optionText}>{c.draftBookingType==='now'?'尽快上门':'预约时间'}</Text></TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.services}>
          {SERVICE_CATEGORIES.map(service => { const selected=c.draftService.id===service.id;return <TouchableOpacity key={service.id} accessibilityRole="button" accessibilityLabel={`选择${serviceNames[service.id]}`} accessibilityState={{selected}} style={[s.service,selected&&s.serviceSelected]} onPress={() => c.setDraftService(service)}><Text style={s.serviceIcon}>{service.icon}</Text><Text style={[s.serviceName,selected&&{color:green}]}>{serviceNames[service.id]}</Text><Text style={s.servicePrice}>RM {servicePrice(service,c.draftVehicle.tier)}</Text>{selected&&<View style={s.serviceCheck}><Check size={10} color="#fff"/></View>}</TouchableOpacity>;})}
        </ScrollView>
        {desktop && <View style={s.desktopInfo}><Text style={s.infoTitle}>到你的停车位，不用排队。</Text><Text style={s.infoText}>在地图上拖动或点击确定位置，补充停车位和门禁说明。师傅接单后可在订单中查看服务进度。</Text><Text style={s.infoText}>地图与地址来自 OpenStreetMap。附近师傅实时位置尚未接入。</Text></View>}
      </ScrollView>
      <View style={s.checkout}><View><Text style={s.total}>RM {(basePrice+2).toFixed(2)}<Text style={s.from}> 起</Text></Text><Text style={s.fee}>已含 RM2 服务费</Text></View><TouchableOpacity accessibilityRole="button" style={s.continue} onPress={() => pending?identifyPin():router.push({ pathname: '/customer/book', params: { step: '4' } })}><Text style={s.white}>{pending?'确认上门位置':'下一步 · 预约洗车'}</Text><ChevronRight size={19} color="#fff"/></TouchableOpacity></View>
    </View>
    <Modal visible={sheet!==null} transparent animationType="slide" onRequestClose={close}>
      <View style={s.modalShade}><View style={[s.modal,{maxHeight:height*0.85}]}>
        <View style={s.modalHeader}><Text style={s.modalTitle}>{sheet==='search'?'选择上门地点':sheet==='vehicle'?'选择爱车':'确认详细上门地址'}</Text><TouchableOpacity accessibilityRole="button" accessibilityLabel="关闭地址面板" onPress={close} style={{padding:8}}><X size={22} color="#526c60"/></TouchableOpacity></View>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{gap:14,paddingBottom:24}}>
          {!!notice&&<Text accessibilityRole="alert" style={s.notice}>{notice}</Text>}
          {sheet==='search'&&<>
            <View style={s.queryRow}><TextInput accessibilityLabel="搜索马来西亚地址" placeholder="输入公寓、商场或街道" style={s.query} value={query} onChangeText={setQuery} onSubmitEditing={find} returnKeyType="search"/><TouchableOpacity disabled={busy} accessibilityRole="button" accessibilityLabel="搜索地址" onPress={find} style={s.searchSubmit}>{busy?<ActivityIndicator color="#fff"/>:<Search size={20} color="#fff"/>}</TouchableOpacity></View>
            <Text style={s.locationSub}>点击搜索后由 OpenStreetMap 查询马来西亚地址。</Text>
            <TouchableOpacity accessibilityRole="button" style={s.result} onPress={locate}><LocateFixed size={19} color={green}/><Text style={s.locationTitle}>使用当前位置</Text></TouchableOpacity>
            {searched&&<Text style={s.groupTitle}>{results.length?'搜索结果':'没有找到地址，试试英文街道名或手动填写。'}</Text>}
            {results.map(location=><TouchableOpacity key={location.id} accessibilityRole="button" style={s.result} onPress={()=>{requestId.current++;setBusy(false);recenter(location as MapPoint);setPending(true);setEditor(location);setSheet('address');setNotice('');}}><MapPin size={18} color={green}/><View style={{flex:1}}><Text style={s.locationTitle}>{location.label}</Text><Text style={s.locationSub}>{location.addressLine1}, {location.city}</Text></View><ChevronRight size={16} color="#789085"/></TouchableOpacity>)}
            <Text style={s.groupTitle}>常用地址</Text>{c.savedLocations.map(location=><TouchableOpacity key={location.id} accessibilityRole="button" style={s.result} onPress={()=>chooseSaved(location)}><MapPin size={18} color={green}/><View style={{flex:1}}><Text style={s.locationTitle}>{location.label}</Text><Text style={s.locationSub}>{location.addressLine1}</Text></View></TouchableOpacity>)}
            <TouchableOpacity accessibilityRole="button" style={s.manual} onPress={()=>{requestId.current++;setBusy(false);setEditor(blankAt(pin));setSheet('address');setNotice('');}}><Text style={{color:green,fontWeight:'700'}}>+ 手动填写此地图位置的地址</Text></TouchableOpacity>
          </>}
          {sheet==='vehicle'&&c.savedVehicles.map(vehicle=><TouchableOpacity key={vehicle.id} accessibilityRole="button" style={s.result} onPress={()=>{c.setDraftVehicle(vehicle);close();}}><Car size={22} color={green}/><View style={{flex:1}}><Text style={s.locationTitle}>{vehicle.plateNumber}</Text><Text style={s.locationSub}>{vehicle.make} {vehicle.model} · {vehicle.tier}</Text></View>{c.draftVehicle.id===vehicle.id&&<Check color={green} size={20}/>}</TouchableOpacity>)}
          {sheet==='address'&&<>
            {busy?<View style={s.queryRow}><ActivityIndicator color={green}/><Text style={s.locationSub}>正在识别位置…</Text></View>:null}
            {validPoint(editor)&&<Text style={s.coordinate}>📍 {editor.latitude.toFixed(5)}, {editor.longitude.toFixed(5)} · 请核对门牌与停车位</Text>}
            {([['label','地址名称'],['addressLine1','街道、门牌 / 公寓名称 *'],['city','城市 *'],['postcode','五位邮编 *'],['unitParkingBay','楼层 / 停车位'],['notesForWasher','门禁与上门说明']] as const).map(([key,label])=><View key={key} style={{gap:6}}><Text style={s.fieldLabel}>{label}</Text><TextInput accessibilityLabel={label} editable={!busy} style={s.field} value={editor[key]||''} onChangeText={value=>setEditor(old=>({...old,[key]:value}))}/></View>)}
            <TouchableOpacity disabled={busy} accessibilityRole="button" style={[s.save,busy&&{opacity:0.5}]} onPress={save}><Text style={s.white}>确认并使用这个上门地址</Text></TouchableOpacity>
          </>}
        </ScrollView>
      </View></View>
    </Modal>
  </View>;
}
const s=StyleSheet.create({
  page:{flex:1,backgroundColor:'#e7eee6',minHeight:420},map:{position:'absolute',top:0,right:0},
  searchOverlay:{position:'absolute',top:10,left:16,right:16,gap:10},searchBar:{backgroundColor:'#fff',borderRadius:16,padding:9,flexDirection:'row',alignItems:'center',gap:10,shadowColor:'#0a3727',shadowOpacity:0.12,shadowRadius:14,elevation:4},searchIcon:{width:30,height:30,borderRadius:10,backgroundColor:'#eaf6ef',alignItems:'center',justifyContent:'center'},eyebrow:{fontSize:11,color:'#82928a',marginBottom:3},searchText:{fontSize:14,fontWeight:'700',color:'#173e2e'},savedRow:{gap:8},savedChip:{backgroundColor:'#fff',paddingHorizontal:12,paddingVertical:8,borderRadius:18,flexDirection:'row',gap:5,alignItems:'center',maxWidth:160,borderWidth:1,borderColor:'#edf1eb'},savedSelected:{borderColor:'#76bfa2',backgroundColor:'#f1fbf5'},savedText:{fontSize:11,color:'#315748',flexShrink:1},
  pinCaption:{position:'absolute',top:'50%',alignSelf:'center',marginTop:16,backgroundColor:'#ffffffed',paddingHorizontal:12,paddingVertical:7,borderRadius:20},pinCaptionText:{fontSize:11,color:'#315b49',fontWeight:'600'},locate:{position:'absolute',right:16,bottom:128,width:44,height:44,backgroundColor:'#fff',borderRadius:22,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'#dce7dd'},pinConfirm:{position:'absolute',bottom:32,alignSelf:'center',borderRadius:24,backgroundColor:green,paddingHorizontal:18,paddingVertical:12,flexDirection:'row',gap:6,alignItems:'center'},
  panel:{position:'absolute',bottom:0,left:0,right:0,backgroundColor:'#fff',borderTopLeftRadius:26,borderTopRightRadius:26,shadowColor:'#173d2c',shadowOpacity:0.1,shadowRadius:14,elevation:6},desktopPanel:{width:410,top:0,right:undefined,borderTopLeftRadius:0,borderTopRightRadius:0},handle:{width:34,height:4,borderRadius:4,backgroundColor:'#d9e1db',alignSelf:'center',marginTop:9,marginBottom:3},panelContent:{padding:16,paddingTop:10,gap:10},titleRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},title:{fontSize:23,fontWeight:'800',color:'#12372b',letterSpacing:-0.5},subtitle:{fontSize:11,color:'#85938b',marginTop:4},doorstep:{width:42,height:42,backgroundColor:'#ebf8ef',borderRadius:15,alignItems:'center',justifyContent:'center'},locationRow:{flexDirection:'row',alignItems:'center',gap:9},locationTitle:{color:'#244a39',fontSize:13,fontWeight:'700'},locationSub:{color:'#829189',fontSize:11,lineHeight:17,marginTop:3},optionsRow:{flexDirection:'row',gap:10},option:{flex:1,borderRadius:10,backgroundColor:'#f5f7f4',padding:10,flexDirection:'row',gap:7,alignItems:'center'},optionText:{color:'#345a46',fontSize:11,fontWeight:'600',flex:1},services:{gap:8,paddingBottom:2},service:{width:107,backgroundColor:'#f8faf7',borderRadius:13,padding:10,borderWidth:1,borderColor:'#ecf0e8',gap:4},serviceSelected:{borderColor:green,backgroundColor:'#edfaf2'},serviceIcon:{fontSize:23},serviceName:{fontSize:12,fontWeight:'700',color:'#355744'},servicePrice:{fontSize:12,color:'#5e7467'},serviceCheck:{position:'absolute',top:7,right:7,borderRadius:8,backgroundColor:green,padding:2},checkout:{padding:14,paddingHorizontal:18,borderTopWidth:1,borderTopColor:'#eff3ed',flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:12,backgroundColor:'#fff'},total:{fontSize:21,fontWeight:'800',color:'#123e2a'},from:{fontSize:11,fontWeight:'400',color:'#869287'},fee:{fontSize:10,color:'#839385',marginTop:3},continue:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:6,backgroundColor:green,borderRadius:13,padding:14,flex:1,maxWidth:230},white:{color:'#fff',fontWeight:'700',fontSize:13},orderStrip:{backgroundColor:'#effaf1',borderRadius:10,padding:9,flexDirection:'row',alignItems:'center',gap:8},notice:{backgroundColor:'#fff4d9',color:'#856426',padding:10,borderRadius:10,fontSize:12,lineHeight:18},desktopInfo:{borderTopWidth:1,borderTopColor:'#eff3ed',paddingTop:24,marginTop:12,gap:12},infoTitle:{fontWeight:'700',fontSize:17,color:'#285c43'},infoText:{fontSize:13,color:'#819486',lineHeight:22},
  modalShade:{flex:1,backgroundColor:'#0e271e66',justifyContent:'flex-end',alignItems:'center'},modal:{width:'100%',maxWidth:540,backgroundColor:'#fff',borderTopLeftRadius:24,borderTopRightRadius:24,padding:22},modalHeader:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:18},modalTitle:{fontSize:20,fontWeight:'800',color:'#183e2c'},queryRow:{flexDirection:'row',gap:10,alignItems:'center'},query:{flex:1,backgroundColor:'#f3f7f1',padding:13,borderRadius:10,fontSize:14,color:'#254e39'},searchSubmit:{backgroundColor:green,borderRadius:10,width:46,height:46,alignItems:'center',justifyContent:'center'},groupTitle:{fontWeight:'700',fontSize:13,color:'#557061',marginTop:10},result:{flexDirection:'row',alignItems:'center',gap:12,paddingVertical:11,borderBottomWidth:1,borderBottomColor:'#eef2ec'},manual:{padding:12,alignItems:'center'},fieldLabel:{fontSize:12,color:'#587563'},field:{borderWidth:1,borderColor:'#d9e4d9',borderRadius:10,padding:12,fontSize:14,color:'#244a35'},coordinate:{fontSize:12,color:'#4c7b61',backgroundColor:'#eef8ee',padding:10,borderRadius:8},save:{backgroundColor:green,borderRadius:12,padding:15,alignItems:'center',marginTop:8},
});
