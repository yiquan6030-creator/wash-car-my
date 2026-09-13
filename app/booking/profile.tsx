import React from 'react';
import { Redirect } from 'expo-router';

export default function BookingProfileRedirect() {
  return <Redirect href="/customer/profile" />;
}
