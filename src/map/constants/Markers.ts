import Leaflet from 'leaflet';
import MarkerIcon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const getMarkerIconPath = (color: string) =>
  `${process.env.PUBLIC_URL}/marker/marker-icon-${color}.png`;

export const MarkerIconDefault = Leaflet.icon({
  iconUrl: MarkerIcon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [13, 41],
  popupAnchor: [2, -40],
});
Leaflet.Marker.prototype.options.icon = MarkerIconDefault;

export const MarkerIconGreen = Leaflet.icon({
  ...MarkerIconDefault.options,
  iconUrl: getMarkerIconPath('green'),
});
export const MarkerIconRed = Leaflet.icon({
  ...MarkerIconDefault.options,
  iconUrl: getMarkerIconPath('red'),
});
export const MarkerIconYellow = Leaflet.icon({
  ...MarkerIconDefault.options,
  iconUrl: getMarkerIconPath('yellow'),
});
