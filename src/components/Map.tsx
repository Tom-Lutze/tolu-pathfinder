import Leaflet from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import React, { useState } from 'react';
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMapEvents,
} from 'react-leaflet';
import './Map.css';

let DefaultIcon = Leaflet.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [13, 41],
  popupAnchor: [2, -40],
});

Leaflet.Marker.prototype.options.icon = DefaultIcon;

const MapLayers = () => {
  const [markers, setMarkers] = useState<[number, number][]>([]);
  const [polyline, setPolyline] = useState<[number, number][]>([]);
  const [selectedMarker, setSelectedMarker] = useState(null);

  useMapEvents({
    click(e) {
      console.log(JSON.stringify(markers));
      console.log(e.latlng);
      setMarkers([...markers, [e.latlng.lat, e.latlng.lng]]);
      setPolyline([...polyline, [e.latlng.lat, e.latlng.lng]]);
    },
  });

  return (
    <>
      {markers.map((position: any, idx) => {
        return (
          <Marker
            key={`marker-${idx}`}
            position={position}
            eventHandlers={{
              click: (e) => {
                console.log('marker clicked', e);
                console.log(e.sourceTarget);
              },
            }}
            {...{ test: idx }}
          >
            <Popup>
              <span>
                A pretty CSS3 popup. <br /> Easily customizable.
              </span>
            </Popup>
          </Marker>
        );
      })}
      <Polyline pathOptions={{ color: 'lime' }} positions={polyline} />
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
