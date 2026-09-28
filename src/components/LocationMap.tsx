import React from 'react';
import { View, Text } from 'react-native';
import GoogleMapContainer from './GoogleMapContainer';
import { LocationMapProps } from './LocationMap.types';
export default function LocationMap({ target }: LocationMapProps) {
  return <View style={{ flex: 1 }}><GoogleMapContainer latitude={target.latitude} longitude={target.longitude} locationName="上门位置" address="请确认停车位置" height={300} /><Text style={{padding:16}}>原生版请使用当前位置或常用地址。拖动选点目前可在 Web 版使用。</Text></View>;
}
