import React from 'react';
import { View } from 'react-native';
import GoogleMapContainer from './GoogleMapContainer';
import { LocationMapProps } from './LocationMap.types';

export default function LocationMap({ target }: LocationMapProps) {
  return (
    <View style={{ flex: 1, width: '100%', height: '100%' }}>
      <GoogleMapContainer
        latitude={target.latitude}
        longitude={target.longitude}
        locationName="Google Maps 上门位置"
        address="请核对选中的停车位置"
        height={380}
        showOpenInAppBtn={true}
      />
    </View>
  );
}
