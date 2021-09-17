import React, { useState } from 'react';
import Leaflet from 'leaflet';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMapEvents,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = Leaflet.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

Leaflet.Marker.prototype.options.icon = DefaultIcon;

const polyline: [number, number][] = [
  [51.505, -0.09],
  [51.51, -0.1],
  [51.51, -0.12],
];
const limeOptions = { color: 'lime' };

const MapEvents = () => {
  useMapEvents({
    click(e) {
      console.log(e.latlng);
    },
  });

  return null;
};

const Map = () => {
  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url={`${process.env.PUBLIC_URL}/map-tile.png`}
      />
      <Marker position={[51.505, -0.09]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
      <Polyline pathOptions={limeOptions} positions={polyline} />
      <MapEvents />
    </MapContainer>
  );
};

export default Map;
