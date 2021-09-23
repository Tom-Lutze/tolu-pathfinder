import React, { useCallback, useMemo, useRef, useState } from 'react';
import Leaflet from 'leaflet';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = Leaflet.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [13, 41],
  popupAnchor: [2, -40],
});

Leaflet.Marker.prototype.options.icon = DefaultIcon;

const MapLayers = () => {
  const [markers, setMarkers] = useState([[0.01, 0.015]]);

  useMapEvents({
    click(e) {
      console.log(JSON.stringify(markers));
      console.log(e.latlng);
      setMarkers([...markers, [e.latlng.lat, e.latlng.lng]]);
    },
  });

  return (
    <>
      {markers.map((position: any, idx) => (
        <Marker key={`marker-${idx}`} position={position}>
          <Popup>
            <span>
              A pretty CSS3 popup. <br /> Easily customizable.
            </span>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

const Map = () => {
  return (
    <MapContainer center={[0, 0]} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url={`${process.env.PUBLIC_URL}/map-tile.png`}
      />
      <MapLayers />
    </MapContainer>
  );
};

export default Map;
