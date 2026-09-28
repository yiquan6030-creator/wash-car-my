import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'expo-router';
import { useBooking } from '../context/BookingContext';
export default function SessionGuard() {
  const { isAuthenticated, role } = useBooking();
  const path = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (path === '/') return;
    if (!isAuthenticated) router.replace('/');
    else if (path.startsWith('/washer') && role !== 'washer') router.replace('/customer');
    else if ((path.startsWith('/customer') || path.startsWith('/booking')) && role !== 'customer') router.replace('/washer');
  }, [path, isAuthenticated, role]);
  return null;
}
