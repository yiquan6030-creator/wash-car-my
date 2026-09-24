export type VehicleTier = 
  | 'hatchback'
  | 'sedan'
  | 'suv'
  | 'mpv'
  | 'pickup';

export interface Vehicle {
  id: string;
  plateNumber: string;
  make: string;
  model: string;
  color: string;
  tier: VehicleTier;
  colorHex?: string;
}

export interface ServiceAddon {
  id: string;
  name: string;
  description: string;
  priceMYR: number;
  icon: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  tagline: string;
  description: string;
  startingPriceMYR: number;
  durationRange: string;
  icon: string;
  badge?: string;
  features: string[];
}

export interface LocationAddress {
  id: string;
  label: string; // e.g. "Home", "Office", "Current Location"
  addressLine1: string;
  condoBuildingName?: string;
  unitParkingBay?: string;
  postcode: string;
  city: string;
  state: string;
  latitude?: number;
  longitude?: number;
  isRealGps?: boolean;
  notesForWasher?: string;
  propertyType?: 'landed' | 'condo' | 'office';
  keyHandoverOption?: 'in_person' | 'unlocked' | 'guardhouse' | 'call_upon_arrival';
}

export type PaymentMethodType = 
  | 'fpx'
  | 'duitnow'
  | 'card'
  | 'tng_ewallet'
  | 'cash';

export type BookingStatus = 
  | 'confirmed'
  | 'assigned'
  | 'on_the_way'
  | 'arrived'
  | 'washing'
  | 'completed';

export interface WasherProfile {
  id: string;
  name: string;
  phone: string;
  avatarUrl: string;
  rating: number;
  completedJobsCount: number;
  vehicleRig: string;
  currentZone: string;
  isOnline: boolean;
  offeredServiceIds: string[]; // List of service IDs washer provides e.g. ['exterior_wash', 'interior_exterior', 'low_water_eco']
}

export interface Promotion {
  id: string;
  title: string;
  discountText: string;
  description: string;
  code: string;
  colorBg: string;
}

export interface ProductDeliveryJob {
  id: string;
  productName: string;
  hubPickup: string;
  deliveryCustomerArea: string;
  earningMYR: number;
  status: 'available' | 'accepted' | 'delivered';
}

export interface CustomerBooking {
  id: string;
  service: ServiceCategory;
  vehicle: Vehicle;
  location: LocationAddress;
  bookingType: 'now' | 'scheduled';
  scheduledDate?: string;
  scheduledTime?: string;
  selectedAddons: ServiceAddon[];
  subtotalMYR: number;
  serviceFeeMYR: number;
  discountMYR: number;
  totalMYR: number;
  paymentMethod: PaymentMethodType;
  status: BookingStatus;
  createdAt: string;
  washer?: WasherProfile;
  etaMinutes?: number;
  beforePhotoUrl?: string;
  afterPhotoUrl?: string;
  userRating?: number;
  driverTipMYR?: number;
}
