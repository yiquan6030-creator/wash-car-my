import React from 'react';
import { Redirect } from 'expo-router';

export default function BookingPackageRedirect() {
  return <Redirect href="/customer/book" />;
}
