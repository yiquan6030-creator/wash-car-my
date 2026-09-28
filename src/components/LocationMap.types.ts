import { MapPoint } from '../services/geocoding';
export interface LocationMapProps {
  target: MapPoint & { revision: number };
  onSelect: (point: MapPoint) => void;
}
