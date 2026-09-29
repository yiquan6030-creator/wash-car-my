import React, { useEffect, useRef, useState } from 'react';
import { View, Text } from 'react-native';
import { LocationMapProps } from './LocationMap.types';
import { GoogleMapInstance, googleMapsConfigured, loadGoogleMaps } from '../lib/googleMaps';
export default function LocationMap({target,onSelect}:LocationMapProps) {
  const container=useRef<HTMLDivElement>(null);
  const mapRef=useRef<GoogleMapInstance|null>(null);
  const callback=useRef(onSelect); callback.current=onSelect;
  const latest=useRef(target); latest.current=target;
  const [status,setStatus]=useState(googleMapsConfigured?'loading':'preview');
  useEffect(()=>{
    if(!googleMapsConfigured) return;
    let disposed=false;
    const authError=()=>setStatus('error');
    window.addEventListener('washcar-map-auth-error',authError);
    loadGoogleMaps().then(maps=>{
      if(disposed||!container.current)return;
      const point=latest.current;
      const map=new maps.Map(container.current,{center:{lat:point.latitude,lng:point.longitude},zoom:16,disableDefaultUI:true,zoomControl:true,zoomControlOptions:{position:maps.ControlPosition.RIGHT_BOTTOM},gestureHandling:'greedy',clickableIcons:false,keyboardShortcuts:true,mapTypeId:'roadmap',restriction:{latLngBounds:{north:85,south:-85,east:180,west:-180},strictBounds:true}});
      mapRef.current=map;
      map.addListener('idle',()=>{if(!disposed)setStatus(s=>s==='error'?s:'ready');});
      map.addListener('dragend',()=>{const p=map.getCenter();if(p)callback.current({latitude:p.lat(),longitude:p.lng()});});
      map.addListener('click',event=>{const p=event?.latLng;if(p){map.setCenter({lat:p.lat(),lng:p.lng()});callback.current({latitude:p.lat(),longitude:p.lng()});}});
    }).catch(()=>{if(!disposed)setStatus('error');});
    return ()=>{disposed=true;window.removeEventListener('washcar-map-auth-error',authError);const map=mapRef.current;if(map){loadGoogleMaps().then(maps=>maps.event.clearInstanceListeners(map)).catch(()=>{});}mapRef.current=null;};
  },[]);
  useEffect(()=>{mapRef.current?.setCenter({lat:target.latitude,lng:target.longitude});},[target.latitude,target.longitude,target.revision]);
  const keyboard=()=>{const p=mapRef.current?.getCenter();if(p)callback.current({latitude:p.lat(),longitude:p.lng()});};
  return <View style={{flex:1,backgroundColor:'#e7eee6'}}>
    {status==='preview'?<iframe title="Google 地图浏览" src={`https://maps.google.com/maps?q=${target.latitude},${target.longitude}&z=16&hl=zh-CN&output=embed`} style={{border:0,width:'100%',height:'100%',position:'absolute',inset:0}} referrerPolicy="no-referrer-when-downgrade"/>:
    <div ref={container} role="region" aria-label="Google 上门位置地图" onKeyUp={event=>{if(event.key.startsWith('Arrow'))keyboard();}} style={{width:'100%',height:'100%',position:'absolute',inset:0}}/>}
    {status==='ready'&&<View pointerEvents="none" style={{position:'absolute',top:'50%',left:'50%',marginLeft:-16,marginTop:-43,alignItems:'center'}}><View style={{width:32,height:32,borderRadius:16,backgroundColor:'#00966a',borderWidth:4,borderColor:'#fff',alignItems:'center',justifyContent:'center'}}><Text>🚗</Text></View><View style={{width:4,height:11,backgroundColor:'#00966a'}}/></View>}
    {status==='loading'&&<Text style={{position:'absolute',top:'50%',alignSelf:'center',backgroundColor:'#fff',padding:10}}>Google 地图加载中…</Text>}
    {status==='error'&&<Text style={{position:'absolute',top:'50%',left:16,right:16,padding:12,backgroundColor:'#fff4d9',color:'#795d2c'}}>Google 地图暂不可用，仍可使用常用地址或手动填写。</Text>}
  </View>;
}
