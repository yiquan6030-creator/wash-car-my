import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import * as Location from 'expo-location';
import { CustomerBooking, BookingStatus, Vehicle, ServiceCategory, LocationAddress, PaymentMethodType, ServiceAddon } from '../types';
import { SERVICE_CATEGORIES, SAVED_VEHICLES, SAVED_LOCATIONS, SAMPLE_WASHER } from '../services/mockData';
import { translations, Language, TranslationKey } from '../i18n/translations';
import { isOpen, servicePrice, transition, validateSchedule } from '../services/bookingRules';
import { readLocal, writeLocal } from '../lib/storage';
export type AppRole = 'customer' | 'washer';
interface UserProfile {
    name: string;
    phone: string;
    email: string;
    role: AppRole;
    avatarUrl?: string;
}
interface Message {
    id: string;
    orderId: string;
    sender: AppRole;
    text: string;
    at: string;
}
interface LocalState {
    version: 2;
    orders: CustomerBooking[];
    vehicles: Vehicle[];
    locations: LocationAddress[];
    messages: Message[];
    profile: UserProfile;
    language: Language;
    selectedLocationId?: string;
}
const initial: LocalState = { version: 2, orders: [], vehicles: SAVED_VEHICLES, locations: SAVED_LOCATIONS, messages: [], profile: { name: '本地体验用户', phone: '', email: '', role: 'customer' }, language: 'zh' };
function useBookingState() {
    const [data, setData] = useState<LocalState>(initial);
    const ref = useRef(data);
    const [ready, setReady] = useState(false);
    const [storageError, setStorageError] = useState('');
    const writes = useRef(Promise.resolve());
    const commit = (fn: (s: LocalState) => LocalState) => { const next = fn(ref.current); ref.current = next; setData(next); };
    useEffect(() => {
        let mounted = true;
        readLocal().then(raw => {
            if (!mounted)
                return;
            const saved = raw as LocalState | null;
            if (saved) {
                if (saved.version !== 2 || !Array.isArray(saved.orders) || !Array.isArray(saved.vehicles) || !saved.vehicles.length || !Array.isArray(saved.locations) || !saved.locations.length || !Array.isArray(saved.messages) || !saved.profile || !['zh', 'en', 'ms'].includes(saved.language))
                    throw new Error('存档格式不受支持');
                ref.current = saved;
                setData(saved);
                setDraftVehicle(saved.vehicles[0]);
                _setDraftLocation(saved.locations.find(l => l.id === saved.selectedLocationId) || saved.locations[0]);
            }
        }).catch(() => { if (mounted)
            setStorageError('无法读取本地存档，当前修改不会覆盖旧存档。请检查浏览器存储权限。'); }).finally(() => { if (mounted)
            setReady(true); });
        return () => { mounted = false; };
    }, []);
    useEffect(() => { if (!ready || storageError)
        return; writes.current = writes.current.then(() => writeLocal(data)).catch(() => setStorageError('保存失败，请检查设备剩余空间或浏览器存储权限。')); }, [data, ready]);
    const [role, setRole] = useState<AppRole>('customer');
    const [isAuthenticated, setAuthenticated] = useState(false);
    const loginAsCustomer = (identifier = '') => { setRole('customer'); setAuthenticated(true); };
    const loginAsWasher = (identifier = '') => { setRole('washer'); setAuthenticated(true); };
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const activeBooking = (role === 'washer' ? data.orders.find(b => b.washer && isOpen(b)) : data.orders.find(b => b.id === selectedId)) || data.orders.find(isOpen) || (role === 'washer' ? data.orders.find(b => b.status === 'completed') : null) || null;
    const [draftService, setDraftService] = useState<ServiceCategory>(SERVICE_CATEGORIES[1]);
    const [draftVehicle, setDraftVehicle] = useState<Vehicle>(SAVED_VEHICLES[0]);
    const [draftLocation, _setDraftLocation] = useState<LocationAddress>(SAVED_LOCATIONS[0]);
    const setDraftLocation = (location: LocationAddress) => { _setDraftLocation(location); commit(s => ({ ...s, selectedLocationId: location.id })); };
    const [draftBookingType, setDraftBookingType] = useState<'now' | 'scheduled'>('now');
    const [scheduledDate, setScheduledDate] = useState(new Date(Date.now() + 86400000 + 8 * 3600000).toISOString().slice(0, 10));
    const [scheduledTime, setScheduledTime] = useState('10:00');
    const [selectedAddons, setSelectedAddons] = useState<ServiceAddon[]>([]);
    const [discountMYR, setDiscountMYR] = useState(0);
    const [isLocatingGps, setIsLocatingGps] = useState(false);
    const [isWasherOnline, setIsWasherOnline] = useState(true);
    const [washerOfferedServices, setWasherOfferedServices] = useState(SERVICE_CATEGORIES.map(s => s.id));
    const addVehicle = (v: Omit<Vehicle, 'id'>) => {
        if (!v.plateNumber.trim() || !v.make.trim() || !v.model.trim())
            throw new Error('请填写车牌、品牌和车型');
        if (ref.current.vehicles.some(x => x.plateNumber.replace(/\s/g, '').toUpperCase() === v.plateNumber.replace(/\s/g, '').toUpperCase()))
            throw new Error('这个车牌已经存在');
        const item = { ...v, plateNumber: v.plateNumber.trim().toUpperCase(), id: `v-${Date.now()}` };
        commit(s => ({ ...s, vehicles: [...s.vehicles, item] }));
        setDraftVehicle(item);
        return item;
    };
    const removeVehicle = (id: string) => {
        if (ref.current.vehicles.length <= 1)
            throw new Error('请至少保留一辆车');
        commit(s => ({ ...s, vehicles: s.vehicles.filter(v => v.id !== id) }));
        if (draftVehicle.id === id)
            setDraftVehicle(ref.current.vehicles[0]);
    };
    const saveLocation = (location: LocationAddress) => {
        if (!location.addressLine1.trim() || !location.city.trim() || !/^\d{5}$/.test(location.postcode))
            throw new Error('请填写地址、城市和五位邮编');
        commit(s => ({ ...s, locations: [...s.locations.filter(l => l.id !== location.id), location] }));
        setDraftLocation(location);
    };
    const removeLocation = (id: string) => {
        if (ref.current.locations.length <= 1)
            throw new Error('请至少保留一个地址');
        commit(s => ({ ...s, locations: s.locations.filter(l => l.id !== id) }));
        if (draftLocation.id === id)
            setDraftLocation(ref.current.locations[0]);
    };
    const fetchGpsLocation = async (applyToDraft = true) => {
        setIsLocatingGps(true);
        try {
            const permission = await Location.requestForegroundPermissionsAsync();
            if (permission.status !== 'granted')
                return null;
            const position = await Promise.race([Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }), new Promise<never>((_, reject) => setTimeout(() => reject(new Error('定位超时')), 15000))]);
            const { latitude, longitude } = position.coords;
            const places = await Location.reverseGeocodeAsync({ latitude, longitude }).catch(() => []);
            const p = places[0];
            const item: LocationAddress = { id: `gps-${Date.now()}`, label: '当前位置', addressLine1: [p?.streetNumber, p?.street || p?.name].filter(Boolean).join(' '), city: p?.city || '', state: p?.region || '', postcode: p?.postalCode || '', latitude, longitude, isRealGps: true };
            if (applyToDraft) setDraftLocation(item);
            return item;
        }
        catch {
            return null;
        }
        finally {
            setIsLocatingGps(false);
        }
    };
    const getOrder = (id?: string) => { const b = ref.current.orders.find(x => x.id === (id || activeBooking?.id)); if (!b)
        throw new Error('未找到订单'); return b; };
    const replaceOrder = (b: CustomerBooking) => commit(s => ({ ...s, orders: s.orders.map(x => x.id === b.id ? b : x) }));
    const confirmBooking = (paymentMethod: PaymentMethodType, locationOverride?: LocationAddress) => {
        if (!isAuthenticated)
            throw new Error('请先进入本地体验');
        if (paymentMethod !== 'cash')
            throw new Error('线上支付尚未接入，请选择服务后付款');
        const location = locationOverride || draftLocation;
        if (!location.addressLine1.trim() || !location.city.trim() || !/^\d{5}$/.test(location.postcode))
            throw new Error('请完善上门地址、城市及五位邮编');
        if (!ref.current.vehicles.some(v => v.id === draftVehicle.id))
            throw new Error('请先保存车辆');
        if (draftBookingType === 'scheduled')
            validateSchedule(scheduledDate, scheduledTime);
        if (ref.current.orders.some(b => isOpen(b) && b.vehicle.id === draftVehicle.id && (draftBookingType === 'now' ? b.bookingType === 'now' : b.scheduledDate === scheduledDate && b.scheduledTime === scheduledTime)))
            throw new Error('这辆车已有同时间预约，请在订单中查看或改期');
        const subtotalMYR = servicePrice(draftService, draftVehicle.tier) + selectedAddons.reduce((sum, a) => sum + a.priceMYR, 0);
        const discount = discountMYR && !ref.current.orders.some(b => b.status !== 'cancelled') ? 5 : 0;
        const createdAt = new Date().toISOString();
        const booking: CustomerBooking = { id: `MY-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`, service: draftService, vehicle: { ...draftVehicle }, location: { ...location }, bookingType: draftBookingType, scheduledDate: draftBookingType === 'scheduled' ? scheduledDate : undefined, scheduledTime: draftBookingType === 'scheduled' ? scheduledTime : undefined, selectedAddons: [...selectedAddons], subtotalMYR, serviceFeeMYR: 2, discountMYR: discount, totalMYR: subtotalMYR + 2 - discount, paymentMethod, status: 'confirmed', createdAt, statusHistory: [{ status: 'confirmed', at: createdAt }] };
        commit(s => ({ ...s, orders: [booking, ...s.orders] }));
        setSelectedId(booking.id);
        setDiscountMYR(0);
        setSelectedAddons([]);
        return booking;
    };
    const updateBookingStatus = (status: BookingStatus) => {
        if (role !== 'washer')
            throw new Error('请由洗车师更新服务状态');
        const b = getOrder();
        if (!b.washer)
            throw new Error('请先接单');
        if (status === 'washing' && !b.inspectionNotes?.trim())
            throw new Error('请先记录洗前检查');
        if (status === 'completed' && !b.service.features.every(f => b.checklist?.includes(f)))
            throw new Error('请完成所有服务检查项');
        replaceOrder(transition(b, status));
    };
    const cancelBooking = (id: string, reason: string) => { if (!reason.trim())
        throw new Error('请填写取消原因'); replaceOrder({ ...transition(getOrder(id), 'cancelled'), cancelledReason: reason.trim() }); };
    const rescheduleBooking = (id: string, date: string, time: string) => {
        const b = getOrder(id);
        if (b.status !== 'confirmed')
            throw new Error('仅待接单订单可自助改期');
        validateSchedule(date, time);
        if (ref.current.orders.some(x => x.id !== id && isOpen(x) && x.vehicle.id === b.vehicle.id && x.scheduledDate === date && x.scheduledTime === time))
            throw new Error('该时段已有预约');
        replaceOrder({ ...b, bookingType: 'scheduled', scheduledDate: date, scheduledTime: time });
    };
    const grabOrder = (id: string) => {
        const b = getOrder(id);
        if (role !== 'washer' || !isWasherOnline || b.status !== 'confirmed' || !washerOfferedServices.includes(b.service.id) || ref.current.orders.some(x => x.washer && isOpen(x)))
            return false;
        replaceOrder({ ...transition(b, 'assigned'), washer: SAMPLE_WASHER });
        setSelectedId(id);
        return true;
    };
    const submitRating = (rating: number, tipMYR = 0, review = '', id?: string) => {
        const b = getOrder(id);
        if (b.status !== 'completed' || b.userRating)
            throw new Error('仅已完成且未评价的订单可评价');
        if (!Number.isInteger(rating) || rating < 1 || rating > 5 || tipMYR !== 0)
            throw new Error('请选择 1–5 星；线上小费尚未接入');
        replaceOrder({ ...b, userRating: rating, driverTipMYR: 0, review: review.trim() });
    };
    const day = (value: string) => new Date(new Date(value).getTime() + 8 * 3600000).toISOString().slice(0, 10);
    const completed = data.orders.filter(b => b.status === 'completed' && b.completedAt && day(b.completedAt) === day(new Date().toISOString()));
    return {
        ready, storageError, role, currentRole: role, setRole, isAuthenticated, userProfile: data.profile,
        loginAsCustomer, loginAsWasher, logoutUser: () => setAuthenticated(false),
        updateProfile: (profile: UserProfile) => commit(s => ({ ...s, profile })),
        language: data.language, setLanguage: (language: Language) => commit(s => ({ ...s, language })), t: (key: TranslationKey) => translations[data.language]?.[key] || translations.zh[key] || key,
        draftService, setDraftService, savedVehicles: data.vehicles, draftVehicle, setDraftVehicle, addVehicle, removeVehicle,
        savedLocations: data.locations, saveLocation, removeLocation, draftLocation, setDraftLocation, isLocatingGps, fetchGpsLocation,
        draftBookingType, setDraftBookingType, scheduledDate, setScheduledDate, scheduledTime, setScheduledTime, selectedAddons,
        toggleAddon: (addon: ServiceAddon) => setSelectedAddons(prev => prev.some(a => a.id === addon.id) ? prev.filter(a => a.id !== addon.id) : [...prev, addon]),
        discountMYR, applyPromoCode: (code: string) => { const valid = code.trim().toUpperCase() === 'FIRSTWASH5' && !ref.current.orders.some(b => b.status !== 'cancelled'); setDiscountMYR(valid ? 5 : 0); return valid; },
        orders: data.orders, activeBooking, selectBooking: setSelectedId, confirmBooking, updateBookingStatus, updateStatus: updateBookingStatus, cancelBooking, rescheduleBooking, submitRating,
        updateInspection: (notes: string) => { const b = getOrder(); if (role !== 'washer' || b.status !== 'arrived')
            throw new Error('到达后可填写检查'); replaceOrder({ ...b, inspectionNotes: notes }); },
        toggleTask: (task: string) => { const b = getOrder(); if (role !== 'washer' || b.status !== 'washing')
            return; const list = b.checklist || []; replaceOrder({ ...b, checklist: list.includes(task) ? list.filter(x => x !== task) : [...list, task] }); },
        isWasherOnline, setIsWasherOnline, washerOfferedServices, toggleWasherService: (id: string) => setWasherOfferedServices(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]),
        washerTodayEarnings: completed.reduce((sum, b) => sum + Math.round((b.totalMYR - b.serviceFeeMYR) * 80) / 100, 0), washerCompletedJobsCount: completed.length,
        deliveryJobs: [] as import('../types').ProductDeliveryJob[], acceptDeliveryJob: (id: string) => { }, availableCustomerOrders: data.orders.filter(b => b.status === 'confirmed'), grabOrder,
        messages: data.messages, sendMessage: (orderId: string, text: string) => { getOrder(orderId); if (!text.trim())
            return; if (text.length > 1000)
            throw new Error('消息最多 1000 字'); commit(s => ({ ...s, messages: [...s.messages, { id: `m-${Date.now()}-${Math.random()}`, orderId, sender: role, text: text.trim(), at: new Date().toISOString() }] })); },
    };
}
type BookingContextType = ReturnType<typeof useBookingState>;
const BookingContext = createContext<BookingContextType | undefined>(undefined);
export function BookingProvider({ children }: {
    children: React.ReactNode;
}) {
    const value = useBookingState();
    if (!value.ready)
        return <View style={{ padding: 32 }}><Text>正在恢复本地订单…</Text></View>;
    return <BookingContext.Provider value={value}>{value.storageError ? <Text style={{ padding: 12, backgroundColor: '#fef3c7' }}>{value.storageError}</Text> : null}{children}</BookingContext.Provider>;
}
export function useBooking() { const context = useContext(BookingContext); if (!context)
    throw new Error('BookingProvider required'); return context; }
