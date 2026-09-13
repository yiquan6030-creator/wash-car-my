import React from 'react';
import { Redirect } from 'expo-router';

export default function BookingOrdersRedirect() {
  return <Redirect href="/customer/orders" />;
}
