import React, { useCallback, useMemo, useRef, useState } from 'react';
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
  [0.01, 0.015],
  [0.015, 0.025],
  [0.02, 0.025],
];
const limeOptions = { color: 'lime' };

const DynamicMarkers = () => {
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

const DraggableMarker = () => {
  const [draggable, setDraggable] = useState(false);
  const [position, setPosition]: any = useState([0.03, 0]);
  const markerRef = useRef(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker: any = markerRef.current;
        if (marker != null) {
          setPosition(marker.getLatLng());
        }
      },
    }),
    []
  );

  const toggleDraggable = useCallback(() => {
    setDraggable((d) => !d);
  }, []);

  return (
    <Marker
      draggable={draggable}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    >
      <Popup minWidth={90}>
        <span onClick={toggleDraggable}>
          {draggable
            ? 'Marker is draggable'
            : 'Click here to make marker draggable'}
        </span>
      </Popup>
    </Marker>
  );
};

const Map = () => {
  return (
    <MapContainer center={[0, 0]} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url={`${process.env.PUBLIC_URL}/map-tile.png`}
      />
      <Marker position={[0.0, 0.0]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
      <DynamicMarkers />
      <Polyline pathOptions={limeOptions} positions={polyline} />
      <DraggableMarker />
    </MapContainer>
  );
};

export default Map;
