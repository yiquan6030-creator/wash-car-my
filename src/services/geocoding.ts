import { LocationAddress } from '../types';
export interface MapPoint { latitude: number; longitude: number }
interface Place { place_id: number; lat: string; lon: string; display_name: string; name?: string; address?: Record<string, string> }
const endpoint = process.env.EXPO_PUBLIC_GEOCODING_URL || 'https://nominatim.openstreetmap.org';
const cache = new Map<string, unknown>();
let queue = Promise.resolve();
let lastRequest = 0;
// Public geocoding is user-triggered only; no autocomplete or requests during map dragging.
function request<T>(path: string): Promise<T> {
  if (cache.has(path)) return Promise.resolve(cache.get(path) as T);
  const task = queue.then(async () => {
    if (cache.has(path)) return cache.get(path) as T;
    const delay = Math.max(0, 1100 - (Date.now() - lastRequest));
    if (delay) await new Promise(resolve => setTimeout(resolve, delay));
    lastRequest = Date.now();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(`${endpoint.replace(/\/$/, '')}/${path}`, { signal: controller.signal, headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error('地址服务暂时不可用，请手动填写地址');
      const data = await response.json();
      if (data.error) throw new Error('没有找到这个位置的地址，请手动填写');
      cache.set(path, data);
      return data as T;
    } catch (error) {
      if ((error as Error).name === 'AbortError') throw new Error('地址查询超时，可继续手动填写');
      throw error;
    } finally { clearTimeout(timeout); }
  });
  queue = task.then(() => {}, () => {});
  return task;
}
export function validPoint(point: Partial<MapPoint>): point is MapPoint {
  return Number.isFinite(point.latitude) && Number.isFinite(point.longitude) && Math.abs(point.latitude!) <= 85 && Math.abs(point.longitude!) <= 180;
}
export function placeToAddress(place: Place): LocationAddress {
  const a = place.address || {};
  const latitude = Number(place.lat), longitude = Number(place.lon);
  if (!validPoint({ latitude, longitude })) throw new Error('地址服务返回了无效坐标');
  return { id: `map-${place.place_id}`, label: place.name || a.amenity || a.building || '地图选点', addressLine1: [a.house_number, a.road].filter(Boolean).join(', ') || place.display_name.split(',').slice(0, 2).join(','), city: a.city || a.town || a.municipality || a.village || a.county || '', state: a.state || '', postcode: a.postcode || '', latitude, longitude, isRealGps: false, condoBuildingName: a.building || '', notesForWasher: '' };
}
export async function searchAddresses(query: string): Promise<LocationAddress[]> {
  if (query.trim().length < 3) throw new Error('请输入至少 3 个字符，例如商场、街道或公寓名称');
  const places = await request<Place[]>(`search?format=jsonv2&addressdetails=1&countrycodes=my&limit=5&q=${encodeURIComponent(query.trim())}`);
  return places.map(placeToAddress);
}
export async function reverseAddress(point: MapPoint): Promise<LocationAddress> {
  const place = await request<Place>(`reverse?format=jsonv2&addressdetails=1&lat=${point.latitude.toFixed(6)}&lon=${point.longitude.toFixed(6)}`);
  // Preserve the exact parking pin, rather than moving to the geocoder's nearby street centroid.
  return { ...placeToAddress(place), ...point, id: `pin-${Date.now()}` };
}
