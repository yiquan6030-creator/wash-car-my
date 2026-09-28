import { BookingStatus, CustomerBooking, ServiceCategory, VehicleTier } from '../types';
export const statusLabels: Record<BookingStatus, string> = {
    confirmed: '待接单', assigned: '已接单', on_the_way: '师傅出发', arrived: '已到达',
    washing: '清洗中', completed: '已完成', cancelled: '已取消',
};
export const nextStatus: Partial<Record<BookingStatus, BookingStatus>> = {
    assigned: 'on_the_way', on_the_way: 'arrived', arrived: 'washing', washing: 'completed',
};
export const isOpen = (b: CustomerBooking) => !['completed', 'cancelled'].includes(b.status);
export function servicePrice(service: ServiceCategory, tier: VehicleTier) {
    return Math.round(service.startingPriceMYR * ({ hatchback: 1, sedan: 1.15, suv: 1.3, mpv: 1.45, pickup: 1.5 }[tier]));
}
export function validateSchedule(date: string, time: string, now = new Date()) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time))
        throw new Error('请使用 YYYY-MM-DD 日期和 HH:mm 时间');
    const at = new Date(`${date}T${time}:00+08:00`);
    const normalized = new Date(at.getTime() + 8 * 3600000).toISOString().slice(0, 16);
    if (normalized !== `${date}T${time}` || at.getTime() <= now.getTime() + 3600000)
        throw new Error('请至少提前一小时预约有效日期');
    if (time < '08:00' || time > '18:00')
        throw new Error('服务时间为马来西亚时间 08:00–18:00');
    if (at.getTime() > now.getTime() + 30 * 86400000)
        throw new Error('可预约未来 30 天内的服务');
    return at;
}
export function transition(b: CustomerBooking, status: BookingStatus): CustomerBooking {
    if (status === b.status)
        return b;
    const allowed = status === 'cancelled' ? ['confirmed', 'assigned'].includes(b.status)
        : b.status === 'confirmed' ? status === 'assigned' : nextStatus[b.status] === status;
    if (!allowed)
        throw new Error('订单状态已变化，无法执行此操作');
    const at = new Date().toISOString();
    return { ...b, status, ...(status === 'completed' ? { completedAt: at } : {}), statusHistory: [...(b.statusHistory || []), { status, at }] };
}
