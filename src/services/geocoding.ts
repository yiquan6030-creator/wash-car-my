import { LocationAddress } from '../types';
import { GoogleGeocoderResult, loadGoogleMaps } from '../lib/googleMaps';
export interface MapPoint { latitude: number; longitude: number }
export function validPoint(point: Partial<MapPoint>): point is MapPoint {
  return Number.isFinite(point.latitude) && Number.isFinite(point.longitude) && Math.abs(point.latitude!) <= 85 && Math.abs(point.longitude!) <= 180;
}
export function placeToAddress(place: GoogleGeocoderResult): LocationAddress {
  const part = (type: string) => place.address_components.find(p => p.types.includes(type))?.long_name || '';
  const latitude = place.geometry.location.lat(), longitude = place.geometry.location.lng();
  if (!validPoint({latitude,longitude})) throw new Error('地址服务返回了无效坐标');
  const street = [part('street_number'),part('route')].filter(Boolean).join(', ');
  return { id: `google-${place.place_id}`, label: part('premise') || part('point_of_interest') || street || '地图选点', addressLine1: street || place.formatted_address, city: part('locality') || part('postal_town') || part('administrative_area_level_2') || part('administrative_area_level_1'), state: part('administrative_area_level_1'), postcode: part('postal_code'), latitude, longitude, isRealGps:false, condoBuildingName:part('premise'), notesForWasher:'' };
}
async function geocode(request: Record<string,unknown>) {
  const maps = await loadGoogleMaps();
  try { return (await new maps.Geocoder().geocode(request)).results; }
  catch(error) {
    if (String(error).includes('ZERO_RESULTS')) return [];
    throw new Error('Google 地址查询暂不可用，请稍后重试或手动填写');
  }
}
export async function searchAddresses(query: string): Promise<LocationAddress[]> {
  if(query.trim().length<3) throw new Error('请输入至少 3 个字符，例如街道或公寓名称');
  return (await geocode({address:query.trim(),componentRestrictions:{country:'MY'},region:'MY'})).slice(0,5).map(placeToAddress);
}
export async function reverseAddress(point: MapPoint): Promise<LocationAddress> {
  if(!validPoint(point)) throw new Error('请选择有效位置');
  const results = await geocode({location:{lat:point.latitude,lng:point.longitude}});
  if(!results.length) throw new Error('没有找到此位置的地址，请手动填写');
  return {...placeToAddress(results[0]),...point,id:`pin-${Date.now()}`};
}
