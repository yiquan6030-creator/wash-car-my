import React, { createContext, useContext, useState } from 'react';
import * as Location from 'expo-location';
import { 
  CustomerBooking, 
  BookingStatus, 
  Vehicle, 
  ServiceCategory, 
  LocationAddress, 
  PaymentMethodType, 
  ServiceAddon,
  ProductDeliveryJob 
} from '../types';
import { 
  SERVICE_CATEGORIES, 
  SAVED_VEHICLES, 
  SAVED_LOCATIONS, 
  SAMPLE_WASHER, 
  PRODUCT_DELIVERY_JOBS 
} from '../services/mockData';

export type AppRole = 'customer' | 'washer';

interface UserProfile {
  name: string;
  phone: string;
  email: string;
  role: AppRole;
  avatarUrl?: string;
}

interface BookingContextType {
  role: AppRole;
  currentRole: AppRole;
  setRole: (role: AppRole) => void;
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
  loginAsCustomer: (identifier?: string) => void;
  loginAsWasher: (identifier?: string) => void;
  logoutUser: () => void;
  
  // Customer Booking Draft State
  draftService: ServiceCategory;
  setDraftService: (service: ServiceCategory) => void;
  draftVehicle: Vehicle;
  setDraftVehicle: (vehicle: Vehicle) => void;
  draftLocation: LocationAddress;
  setDraftLocation: (location: LocationAddress) => void;
  isLocatingGps: boolean;
  fetchGpsLocation: () => Promise<LocationAddress | null>;
  draftBookingType: 'now' | 'scheduled';
  setDraftBookingType: (type: 'now' | 'scheduled') => void;
  scheduledDate: string;
  setScheduledDate: (date: string) => void;
  scheduledTime: string;
  setScheduledTime: (time: string) => void;
  selectedAddons: ServiceAddon[];
  toggleAddon: (addon: ServiceAddon) => void;
  discountMYR: number;
  applyPromoCode: (code: string) => boolean;

  // Active Booking
  activeBooking: CustomerBooking | null;
  confirmBooking: (paymentMethod: PaymentMethodType) => CustomerBooking;
  updateBookingStatus: (status: BookingStatus) => void;
  updateStatus: (status: BookingStatus) => void;
  submitRating: (rating: number, tipMYR?: number) => void;

  // Washer State
  isWasherOnline: boolean;
  setIsWasherOnline: (online: boolean) => void;
  washerTodayEarnings: number;
  washerCompletedJobsCount: number;
  deliveryJobs: ProductDeliveryJob[];
  acceptDeliveryJob: (id: string) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<AppRole>('customer');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>({
    name: 'Lee Wei Jian',
    phone: '+60 12-345 6789',
    email: 'weijian@example.com',
    role: 'customer',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
  });

  const loginAsCustomer = (identifier: string = '+60 12-345 6789') => {
    setRole('customer');
    setIsAuthenticated(true);
    setUserProfile({
      name: 'Lee Wei Jian',
      phone: identifier.includes('@') ? '+60 12-345 6789' : identifier,
      email: identifier.includes('@') ? identifier : 'weijian@example.com',
      role: 'customer',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    });
  };

  const loginAsWasher = (identifier: string = '+60 18-987 6543') => {
    setRole('washer');
    setIsAuthenticated(true);
    setUserProfile({
      name: SAMPLE_WASHER.name,
      phone: SAMPLE_WASHER.phone,
      email: 'amir.washer@washcar.my',
      role: 'washer',
      avatarUrl: SAMPLE_WASHER.avatarUrl,
    });
  };

  const logoutUser = () => {
    setIsAuthenticated(false);
    setUserProfile(null);
  };

  // Customer Booking Draft Defaults
  const [draftService, setDraftService] = useState<ServiceCategory>(SERVICE_CATEGORIES[1]); // Interior + Exterior
  const [draftVehicle, setDraftVehicle] = useState<Vehicle>(SAVED_VEHICLES[0]); // Myvi
  const [draftLocation, setDraftLocation] = useState<LocationAddress>(SAVED_LOCATIONS[0]);
  const [isLocatingGps, setIsLocatingGps] = useState<boolean>(false);
  const [draftBookingType, setDraftBookingType] = useState<'now' | 'scheduled'>('now');
  const [scheduledDate, setScheduledDate] = useState('Tomorrow');
  const [scheduledTime, setScheduledTime] = useState('10:00 AM');
  const [selectedAddons, setSelectedAddons] = useState<ServiceAddon[]>([]);
  const [discountMYR, setDiscountMYR] = useState<number>(0);

  const fetchGpsLocation = async (): Promise<LocationAddress | null> => {
    try {
      setIsLocatingGps(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied. Please select a saved address.');
        setIsLocatingGps(false);
        return null;
      }

      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const { latitude, longitude } = pos.coords;

      let addressLine1 = `GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      let city = 'Kuala Lumpur';
      let postcode = '50000';
      let state = 'Kuala Lumpur';

      try {
        const geocoded = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (geocoded && geocoded.length > 0) {
          const place = geocoded[0];
          const street = place.street || place.name || place.district || 'Current Location';
          const area = place.subregion || place.city || 'Kuala Lumpur';
          addressLine1 = `${street}, ${area}`;
          if (place.city) city = place.city;
          if (place.postalCode) postcode = place.postalCode;
          if (place.region) state = place.region;
        }
      } catch (e) {
        console.log('Reverse geocoding info:', e);
      }

      const gpsLoc: LocationAddress = {
        id: 'gps_' + Date.now(),
        label: '📍 Real GPS Location',
        addressLine1,
        city,
        postcode,
        state,
        latitude,
        longitude,
        isRealGps: true,
        condoBuildingName: 'Live GPS Pin',
        unitParkingBay: 'Parking Bay',
        notesForWasher: `GPS Coordinates: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}. Please call when nearby.`,
      };

      setDraftLocation(gpsLoc);
      setIsLocatingGps(false);
      return gpsLoc;
    } catch (error) {
      console.error('Error fetching GPS location:', error);
      setIsLocatingGps(false);
      return null;
    }
  };

  // Washer State
  const [isWasherOnline, setIsWasherOnline] = useState<boolean>(true);
  const [washerTodayEarnings, setWasherTodayEarnings] = useState<number>(86.00);
  const [washerCompletedJobsCount, setWasherCompletedJobsCount] = useState<number>(4);
  const [deliveryJobs, setDeliveryJobs] = useState<ProductDeliveryJob[]>(PRODUCT_DELIVERY_JOBS);

  // Initial Active Booking for Demonstration
  const [activeBooking, setActiveBooking] = useState<CustomerBooking | null>({
    id: 'MY-882194',
    service: SERVICE_CATEGORIES[1],
    vehicle: SAVED_VEHICLES[0],
    location: SAVED_LOCATIONS[0],
    bookingType: 'now',
    selectedAddons: [],
    subtotalMYR: 48,
    serviceFeeMYR: 2,
    discountMYR: 0,
    totalMYR: 50,
    paymentMethod: 'tng_ewallet',
    status: 'on_the_way',
    createdAt: new Date().toISOString(),
    washer: SAMPLE_WASHER,
    etaMinutes: 8,
    beforePhotoUrl: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=400',
    afterPhotoUrl: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=400',
  });

  const toggleAddon = (addon: ServiceAddon) => {
    if (selectedAddons.some(a => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter(a => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const applyPromoCode = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'FIRSTWASH5' || clean === 'WASHER10' || clean === 'RM5OFF') {
      setDiscountMYR(5);
      return true;
    }
    return false;
  };

  const confirmBooking = (paymentMethod: PaymentMethodType): CustomerBooking => {
    const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.priceMYR, 0);
    const subtotal = draftService.startingPriceMYR + addonsTotal;
    const serviceFee = 2;
    const total = Math.max(0, subtotal + serviceFee - discountMYR);

    const newBooking: CustomerBooking = {
      id: 'MY-' + Math.floor(100000 + Math.random() * 900000),
      service: draftService,
      vehicle: draftVehicle,
      location: draftLocation,
      bookingType: draftBookingType,
      scheduledDate: draftBookingType === 'scheduled' ? scheduledDate : undefined,
      scheduledTime: draftBookingType === 'scheduled' ? scheduledTime : undefined,
      selectedAddons,
      subtotalMYR: subtotal,
      serviceFeeMYR: serviceFee,
      discountMYR,
      totalMYR: total,
      paymentMethod,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      washer: SAMPLE_WASHER,
      etaMinutes: 10,
    };

    setActiveBooking(newBooking);
    return newBooking;
  };

  const updateBookingStatus = (status: BookingStatus) => {
    if (!activeBooking) return;
    const updated = { ...activeBooking, status };
    if (status === 'assigned' || status === 'on_the_way' || status === 'washing') {
      updated.washer = SAMPLE_WASHER;
    }
    if (status === 'arrived') {
      updated.beforePhotoUrl = 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=400';
    }
    if (status === 'completed') {
      updated.afterPhotoUrl = 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=400';
      setWasherTodayEarnings(prev => prev + Math.round(updated.totalMYR * 0.8));
      setWasherCompletedJobsCount(prev => prev + 1);
    }
    setActiveBooking(updated);
  };

  const submitRating = (rating: number, tipMYR: number = 0) => {
    if (!activeBooking) return;
    setActiveBooking({
      ...activeBooking,
      userRating: rating,
      driverTipMYR: tipMYR,
    });
    if (tipMYR > 0) {
      setWasherTodayEarnings(prev => prev + tipMYR);
    }
  };

  const acceptDeliveryJob = (id: string) => {
    setDeliveryJobs(deliveryJobs.map(j => j.id === id ? { ...j, status: 'accepted' } : j));
    setWasherTodayEarnings(prev => prev + 6.00);
  };

  return (
    <BookingContext.Provider value={{
      role,
      currentRole: role,
      setRole,
      isAuthenticated,
      userProfile,
      loginAsCustomer,
      loginAsWasher,
      logoutUser,
      draftService,
      setDraftService,
      draftVehicle,
      setDraftVehicle,
      draftLocation,
      setDraftLocation,
      isLocatingGps,
      fetchGpsLocation,
      draftBookingType,
      setDraftBookingType,
      scheduledDate,
      setScheduledDate,
      scheduledTime,
      setScheduledTime,
      selectedAddons,
      toggleAddon,
      discountMYR,
      applyPromoCode,
      activeBooking,
      confirmBooking,
      updateBookingStatus,
      updateStatus: updateBookingStatus,
      submitRating,
      isWasherOnline,
      setIsWasherOnline,
      washerTodayEarnings,
      washerCompletedJobsCount,
      deliveryJobs,
      acceptDeliveryJob,
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
