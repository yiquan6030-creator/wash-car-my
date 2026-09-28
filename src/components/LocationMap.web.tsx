import React, { useEffect, useRef, useState } from 'react';
import { View, Text } from 'react-native';
import type * as Leaflet from 'leaflet';
import { LocationMapProps } from './LocationMap.types';
import 'leaflet/dist/leaflet.css';
import './LocationMap.css';
export default function LocationMap({ target, onSelect }: LocationMapProps) {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const callback = useRef(onSelect);
  callback.current = onSelect;
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!container.current) return;
    const L: typeof Leaflet = require('leaflet');
    const map = L.map(container.current, { center: [target.latitude, target.longitude], zoom: 16, zoomControl: false, attributionControl: true, maxBounds: [[-85, -180], [85, 180]], maxBoundsViscosity: 1 });
    mapRef.current = map;
    L.control.zoom({ position: 'bottomright', zoomInTitle: '放大地图', zoomOutTitle: '缩小地图' }).addTo(map);
    map.attributionControl.setPrefix(false);
    const tiles = L.tileLayer(process.env.EXPO_PUBLIC_MAP_TILES_URL || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>', maxZoom: 19, minZoom: 3,
    }).addTo(map);
    tiles.on('tileerror', () => setFailed(true));
    tiles.on('tileload', () => setFailed(false));
    let dragged = false;
    map.on('dragstart', () => { dragged = true; });
    map.on('moveend', () => {
      if (!dragged) return;
      dragged = false;
      const point = map.getCenter();
      callback.current({ latitude: point.lat, longitude: point.wrap().lng });
    });
    map.on('click', (event: Leaflet.LeafletMouseEvent) => {
      map.panTo(event.latlng, { animate: false });
      callback.current({ latitude: event.latlng.lat, longitude: event.latlng.wrap().lng });
    });
    // Arrow-key pans are also usable for accessible map selection.
    const keyboard = (event: KeyboardEvent) => {
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(event.key)) {
        const p = map.getCenter(); callback.current({ latitude: p.lat, longitude: p.wrap().lng });
      }
    };
    container.current.addEventListener('keyup', keyboard);
    const element = container.current;
    const resize = new ResizeObserver(() => map.invalidateSize({ pan: false }));
    resize.observe(element);
    return () => { resize.disconnect(); element.removeEventListener('keyup', keyboard); map.remove(); mapRef.current = null; };
  }, []);
  useEffect(() => {
    mapRef.current?.setView([target.latitude, target.longitude], Math.max(mapRef.current.getZoom(), 16), { animate: false });
  }, [target.latitude, target.longitude, target.revision]);
  return <View style={{ flex: 1, backgroundColor: '#e7eee6' }}>
    <div ref={container} role="region" aria-label="上门位置地图，可拖动、点击或使用方向键选择停车位置" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, zIndex: 0 }} />
    <View pointerEvents="none" style={{ position: 'absolute', top: '50%', left: '50%', marginLeft: -16, marginTop: -43, alignItems: 'center' }}>
      <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#00966a', borderColor: '#fff', borderWidth: 4, alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px #0003' } as any}><Text style={{ color: '#fff', fontSize: 16 }}>🚗</Text></View>
      <View style={{ height: 11, width: 4, backgroundColor: '#00966a' }} />
      <View style={{ width: 12, height: 5, backgroundColor: '#004e3c55', borderRadius: 8 }} />
    </View>
    {failed && <Text style={{ position: 'absolute', top: 130, left: 20, right: 60, padding: 10, backgroundColor: '#fff5db', color: '#704d12', fontSize: 12 }}>地图网络暂不可用，仍可选择常用地址或手动填写。</Text>}
  </View>;
}
