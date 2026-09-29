export interface GoogleLatLng { lat(): number; lng(): number }
export interface GoogleGeocoderResult {
  place_id: string;
  formatted_address: string;
  address_components: { long_name: string; short_name: string; types: string[] }[];
  geometry: { location: GoogleLatLng };
}
interface Listener { remove(): void }
export interface GoogleMapInstance {
  setCenter(point: { lat: number; lng: number }): void;
  getCenter(): GoogleLatLng | undefined;
  setZoom(zoom: number): void;
  addListener(name: string, callback: (event?: { latLng?: GoogleLatLng }) => void): Listener;
}
export interface GoogleMapsApi {
  Map: new (element: HTMLElement, options: Record<string, unknown>) => GoogleMapInstance;
  Geocoder: new () => { geocode(request: Record<string, unknown>): Promise<{ results: GoogleGeocoderResult[] }> };
  ControlPosition: { RIGHT_BOTTOM: number };
  event: { clearInstanceListeners(instance: GoogleMapInstance): void };
}
export const googleMapsConfigured = Boolean(process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY?.trim());
let loading: Promise<GoogleMapsApi> | undefined;
export function loadGoogleMaps(): Promise<GoogleMapsApi> {
  if (!googleMapsConfigured) return Promise.reject(new Error('地址搜索暂未开启，请使用常用地址或手动填写'));
  if (typeof window === 'undefined') return Promise.reject(new Error('Google 交互地图目前在 Web 版提供'));
  const w = window as typeof window & { google?: { maps: GoogleMapsApi }; washCarMapsReady?: () => void; gm_authFailure?: () => void };
  if (w.google?.maps?.Map) return Promise.resolve(w.google.maps);
  if (loading) return loading;
  loading = new Promise<GoogleMapsApi>((resolve,reject) => {
    const script = document.createElement('script');
    let settled = false;
    const fail = () => {
      if (settled) return;
      settled = true; clearTimeout(timer); script.remove(); loading = undefined;
      reject(new Error('Google 地图加载失败，请检查网络或地图服务配置'));
    };
    const timer = setTimeout(fail, 15000);
    w.washCarMapsReady = () => {
      if (settled) return;
      if (!w.google?.maps?.Map) { fail(); return; }
      settled = true; clearTimeout(timer); resolve(w.google.maps);
    };
    w.gm_authFailure = () => { fail(); window.dispatchEvent(new Event('washcar-map-auth-error')); };
    const params = new URLSearchParams({ key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY!.trim(), loading: 'async', callback: 'washCarMapsReady', language: 'zh-CN', region: 'MY', v: 'weekly' });
    script.src = `https://maps.googleapis.com/maps/api/js?${params}`;
    script.async = true; script.onerror = fail; document.head.appendChild(script);
  });
  return loading;
}
