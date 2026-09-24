import { 
  ServiceCategory, 
  ServiceAddon, 
  Vehicle, 
  LocationAddress, 
  WasherProfile, 
  Promotion, 
  ProductDeliveryJob 
} from '../types';

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'exterior_wash',
    name: 'Exterior Wash',
    tagline: 'Basic exterior hand wash & rim wipe',
    description: 'Exterior hand wash & rim cleaning',
    startingPriceMYR: 28,
    durationRange: '30–40 min',
    icon: '🧼',
    features: ['Exterior Hand Wash', 'Rims Cleaning', 'Microfiber Drying', 'Tire Wipe'],
  },
  {
    id: 'interior_exterior',
    name: 'Interior + Exterior',
    tagline: 'Most popular full wash & vacuum',
    description: 'Full exterior foam wash, cabin vacuum & dashboard wipe',
    startingPriceMYR: 48,
    durationRange: '45–60 min',
    icon: '✨',
    badge: 'MOST POPULAR',
    features: ['Exterior Foam Wash', 'Full Interior Vacuum', 'Dashboard & Console Wipe', 'Rims Decontamination', 'Glass Clarity Clean'],
  },
  {
    id: 'low_water_eco',
    name: 'Low-Water Eco',
    tagline: 'Designed for condo & basement parking',
    description: 'Waterless biodegradable hand spray wash with zero runoff',
    startingPriceMYR: 35,
    durationRange: '30–45 min',
    icon: '💧',
    badge: 'CONDO FRIENDLY',
    features: ['Eco Waterless Spray Wash', 'Windscreen Clean', 'Door Jam Wipedown', 'Zero Water Runoff'],
  },
  {
    id: 'steam_detailing',
    name: 'Steam Detailing',
    tagline: 'Deeper thermal steam sanitization',
    description: 'Deep cabin steam sanitization & air vent treatment',
    startingPriceMYR: 88,
    durationRange: '60–75 min',
    icon: '💨',
    features: ['Thermal Steam Aircon Sanitization', 'Deep Seat & Carpet Extraction', 'Leather Conditioning', 'Hydrophobic Gloss Finish'],
  },
];

export const SERVICE_ADDONS: ServiceAddon[] = [
  { id: 'add_tyre_shine', name: 'Tyre Shine', description: 'Long-lasting wet look tyre gel dressing', priceMYR: 5, icon: '🛞' },
  { id: 'add_fragrance', name: 'Interior Fragrance', description: 'Fresh lavender or ocean breeze cabin spray', priceMYR: 5, icon: '🌸' },
  { id: 'add_rain_repellent', name: 'Rain Repellent', description: 'Hydrophobic windscreen water beading coating', priceMYR: 8, icon: '🌧️' },
  { id: 'add_glass_treatment', name: 'Glass Treatment', description: 'Anti-fog & crystal glass clarity coat', priceMYR: 10, icon: '🛡️' },
];

export const SAVED_VEHICLES: Vehicle[] = [
  { id: 'v_myvi', plateNumber: 'VWB 8819', make: 'Perodua', model: 'Myvi 1.5 AV', color: '⚪ 珍珠白 (Pearl White)', tier: 'hatchback', colorHex: '#f8fafc' },
  { id: 'v_saga', plateNumber: 'JWA 1234', make: 'Proton', model: 'Saga 1.3 Premium', color: '🔴 烈焰红 (Ruby Red)', tier: 'sedan', colorHex: '#ef4444' },
  { id: 'v_city', plateNumber: 'BKP 4321', make: 'Honda', model: 'City 1.5 V', color: '⚪ 铂金白 (Platinum White)', tier: 'sedan', colorHex: '#ffffff' },
  { id: 'v_x70', plateNumber: 'VMA 5566', make: 'Proton', model: 'X70 TGDi', color: '⚫ 曜石黑 (Obsidian Black)', tier: 'suv', colorHex: '#1e293b' },
  { id: 'v_alza', plateNumber: 'QAA 9988', make: 'Perodua', model: 'Alza 1.5 AV', color: '🟤 复古棕 (Vintage Brown)', tier: 'mpv', colorHex: '#78350f' },
];

export const SAVED_LOCATIONS: LocationAddress[] = [
  {
    id: 'loc_mcd_1',
    label: 'McDonald\'s® - Ulu Tiram DT 261',
    addressLine1: 'Mukim Tebrau, 地不佬, 81800, 新山, 柔佛, Malaysia',
    condoBuildingName: 'McDonald\'s Drive-Thru Parking',
    unitParkingBay: '露天停车场 08号车位',
    postcode: '81800',
    city: 'Johor Bahru',
    state: 'Johor',
    propertyType: 'office',
    keyHandoverOption: 'in_person',
    notesForWasher: 'Parked near Drive-Thru entrance bay 08.',
  },
  {
    id: 'loc_dnp_1',
    label: '01164032561 DNP大厦 - 主要入口',
    addressLine1: 'Plaza DNP, Jalan Dato Abdullah Tahir, 新山',
    condoBuildingName: 'Plaza DNP Block A',
    unitParkingBay: 'B1层 访客停车场 Bay 12',
    postcode: '80250',
    city: 'Johor Bahru',
    state: 'Johor',
    propertyType: 'office',
    keyHandoverOption: 'guardhouse',
    notesForWasher: 'Key left at Plaza DNP security counter.',
  },
  {
    id: 'loc_berjaya_1',
    label: '新山成功滨水酒店 (Berjaya Waterfront Hotel)',
    addressLine1: '88, Jalan Ibrahim Sultan, Stulang Laut, Bandar Johor Bahru',
    condoBuildingName: 'Berjaya Hotel Open Parking',
    unitParkingBay: 'Level 1, Bay 88',
    postcode: '80300',
    city: 'Johor Bahru',
    state: 'Johor',
    propertyType: 'condo',
    keyHandoverOption: 'unlocked',
    notesForWasher: 'Car is unlocked in open parking bay 88.',
  },
  {
    id: 'loc_current',
    label: '实时 GPS 定位 (Bangsar Residence)',
    addressLine1: 'Jalan Telawi 3, Bangsar',
    condoBuildingName: 'The Residence Condo',
    unitParkingBay: 'Basement B2, Bay #45',
    postcode: '59100',
    city: 'Kuala Lumpur',
    state: 'Kuala Lumpur',
    propertyType: 'condo',
    keyHandoverOption: 'in_person',
    notesForWasher: 'Parked near lift lobby at Basement B2. Please call when you arrive.',
  },
];

export const PROMOTIONS: Promotion[] = [
  {
    id: 'promo_first',
    title: 'First Wash Discount',
    discountText: 'RM5 OFF',
    description: 'RM5 discount on your first doorstep mobile wash.',
    code: 'FIRSTWASH5',
    colorBg: '#0284c7',
  },
  {
    id: 'promo_pack',
    title: 'Book 3 Washes & Save',
    discountText: '15% OFF',
    description: 'Save 15% when you bundle 3 wash credits.',
    code: 'SAVE15',
    colorBg: '#16a34a',
  },
  {
    id: 'promo_weekend',
    title: 'Weekend Detailing Offer',
    discountText: 'FREE TYRE SHINE',
    description: 'Complimentary high-gloss tyre shine on weekend bookings.',
    code: 'WEEKENDSHINE',
    colorBg: '#f59e0b',
  },
];

export const SAMPLE_WASHER: WasherProfile = {
  id: 'washer_amir',
  name: 'Amir Hazim',
  phone: '+60 12-345 6789',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  rating: 4.90,
  completedJobsCount: 342,
  vehicleRig: 'Perodua Axia Mobile Rig #4',
  currentZone: 'Bangsar / Mont Kiara, KL',
  isOnline: true,
  offeredServiceIds: ['exterior_wash', 'interior_exterior', 'low_water_eco'], // Does NOT offer steam_detailing by default
};

export const PRODUCT_DELIVERY_JOBS: ProductDeliveryJob[] = [
  {
    id: 'del_01',
    productName: 'WashCar Microfiber Towels (3x Pack)',
    hubPickup: 'WashCar Hub (Bangsar)',
    deliveryCustomerArea: 'Mont Kiara Palma (2.4 km away)',
    earningMYR: 6.00,
    status: 'available',
  },
  {
    id: 'del_02',
    productName: 'Hydrophobic Ceramic Spray Wax (500ml)',
    hubPickup: 'WashCar Hub (Subang SS15)',
    deliveryCustomerArea: 'Sunway Pyramid Condo (1.8 km away)',
    earningMYR: 6.00,
    status: 'available',
  },
];
