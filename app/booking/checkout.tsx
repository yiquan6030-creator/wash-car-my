import React from 'react';
import { Redirect } from 'expo-router';

export default function BookingCheckoutRedirect() {
  return <Redirect href="/customer/book" />;
}
