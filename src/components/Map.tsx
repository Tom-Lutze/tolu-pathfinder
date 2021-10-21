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
import Graph from './util/Graph';
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
  // const [markers, setMarkers] = useState<[number, number][]>([]);
  // const [polyline, setPolyline] = useState<[number, number][]>([]);
  // const [selectedMarker, setSelectedMarker] = useState(null);
  const mapGraph = Graph(useState({}));

  useMapEvents({
    click(e) {
      // console.log(JSON.stringify(markers));
      // console.log(e.latlng);
      // setMarkers([...markers, [e.latlng.lat, e.latlng.lng]]);
      // setPolyline([...polyline, [e.latlng.lat, e.latlng.lng]]);
      mapGraph.addNode({ position: e.latlng });
    },
  });

  return (
    <>
      {mapGraph.getNodesIdx().map((nodeIdx: string) => {
        const node = mapGraph.getGraph()[nodeIdx];
        const activeNode = mapGraph.getActiveNode();
        return (
          <React.Fragment key={`marker-${nodeIdx}`}>
            <Marker
              position={node.position}
              opacity={activeNode && activeNode == nodeIdx ? 1 : 0.5}
              eventHandlers={{
                click: (e) => {
                  // console.log('marker clicked', e);
                  // console.log(e.sourceTarget);
                  mapGraph.setActiveNode(e.target.options.nodeIdx);
                  console.log(mapGraph.getGraph());
                },
              }}
              {...{ nodeIdx: nodeIdx }}
            >
              <Popup>
                <span>
                  A pretty CSS3 popup. <br /> Easily customizable.
                </span>
              </Popup>
            </Marker>
            {node.edges && node.edges.size > 0 && (
              <Polyline
                pathOptions={{ color: 'lime' }}
                positions={[
                  node.position,
                  ...[...node.edges].map(
                    (edgeIdx: string) => mapGraph.getNode(edgeIdx).position
                  ),
                ]}
              />
            )}
          </React.Fragment>
        );
      })}
      {/* <Polyline pathOptions={{ color: 'lime' }} positions={polyline} /> */}
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
