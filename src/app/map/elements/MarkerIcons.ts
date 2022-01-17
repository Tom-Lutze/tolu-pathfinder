import Leaflet from 'leaflet';
import MarkerIcon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import marker_icon_green from '../../../assets/marker/marker-icon-green.png';
import marker_icon_red from '../../../assets/marker/marker-icon-red.png';
import marker_icon_yellow from '../../../assets/marker/marker-icon-yellow.png';

export const MarkerIconDefault = Leaflet.icon({
  iconUrl: MarkerIcon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [13, 41],
  popupAnchor: [-1, -40],
});
Leaflet.Marker.prototype.options.icon = MarkerIconDefault;

export const MarkerIconGreen = Leaflet.icon({
  ...MarkerIconDefault.options,
  iconUrl: marker_icon_green,
});
export const MarkerIconRed = Leaflet.icon({
  ...MarkerIconDefault.options,
  iconUrl: marker_icon_red,
});
export const MarkerIconYellow = Leaflet.icon({
  ...MarkerIconDefault.options,
  iconUrl: marker_icon_yellow,
});
