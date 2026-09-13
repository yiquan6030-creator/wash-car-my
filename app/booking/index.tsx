import React from 'react';
import { Redirect } from 'expo-router';

export default function BookingIndexRedirect() {
  return <Redirect href="/customer/book" />;
}
