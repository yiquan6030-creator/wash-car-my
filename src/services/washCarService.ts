import { VehicleTier, ServiceCategory, CustomerBooking, LocationAddress, PaymentMethodType, Vehicle } from '../types';
import { SERVICE_CATEGORIES, SAMPLE_WASHER, SAVED_LOCATIONS } from './mockData';

export function calculateTotalPrice(service: ServiceCategory, tier: VehicleTier): number {
  const multiplierMap: Record<VehicleTier, number> = {
    hatchback: 1.0,
    sedan: 1.15,
    suv: 1.3,
    mpv: 1.45,
    pickup: 1.5,
  };

  const multiplier = multiplierMap[tier] || 1.0;
  return Math.round(service.startingPriceMYR * multiplier);
}

let currentActiveBooking: CustomerBooking | null = null;

export function createNewBooking(
  vehicle: Vehicle,
  service: ServiceCategory,
  location: LocationAddress,
  paymentMethod: PaymentMethodType
): CustomerBooking {
  const subtotalMYR = calculateTotalPrice(service, vehicle.tier);
  const serviceFeeMYR = 2.0;

  const newBooking: CustomerBooking = {
    id: 'MY-WASH-' + Math.floor(100000 + Math.random() * 900000),
    service,
    vehicle,
    location,
    bookingType: 'now',
    selectedAddons: [],
    subtotalMYR,
    serviceFeeMYR,
    discountMYR: 0,
    totalMYR: subtotalMYR + serviceFeeMYR,
    paymentMethod,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    washer: SAMPLE_WASHER,
    etaMinutes: 8,
  };

  currentActiveBooking = newBooking;
  return newBooking;
}

export function getCurrentBooking(): CustomerBooking | null {
  if (!currentActiveBooking) {
    const defaultVehicle: Vehicle = {
      id: 'v1',
      plateNumber: 'VJL 8899',
      make: 'Perodua',
      model: 'Myvi 1.5 AV',
      color: 'Granite Grey',
      tier: 'hatchback',
    };
    currentActiveBooking = createNewBooking(
      defaultVehicle,
      SERVICE_CATEGORIES[1],
      SAVED_LOCATIONS[0],
      'tng_ewallet'
    );
  }
  return currentActiveBooking;
}

export function updateBookingStatus(status: CustomerBooking['status']): CustomerBooking | null {
  if (!currentActiveBooking) return null;

  currentActiveBooking.status = status;
  if (status === 'assigned' || status === 'on_the_way' || status === 'washing') {
    currentActiveBooking.washer = SAMPLE_WASHER;
  }
  if (status === 'arrived') {
    currentActiveBooking.beforePhotoUrl = 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=400';
  }
  if (status === 'completed') {
    currentActiveBooking.afterPhotoUrl = 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=400';
  }

  return currentActiveBooking;
}
