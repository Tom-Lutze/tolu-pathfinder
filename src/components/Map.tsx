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
  const mapGraph = Graph(useState({}));

  useMapEvents({
    click(e) {
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
              draggable={true}
              position={node.position}
              opacity={activeNode && activeNode == nodeIdx ? 1 : 0.5}
              eventHandlers={{
                click: (e) => {
                  mapGraph.setActiveNode(e.target.options.nodeIdx);
                  // console.log(mapGraph.getGraph());
                },
                dragend: (e) => {
                  // console.log(e.target.getLatLng());
                  mapGraph.setNodePosition(
                    e.target.options.nodeIdx,
                    e.target.getLatLng()
                  );
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
            {node.edges &&
              node.edges.size > 0 &&
              [...node.edges].map((edgeIdx: string) => (
                <Polyline
                  key={`polyline-${nodeIdx}-${edgeIdx}`}
                  pathOptions={{ color: 'lime' }}
                  positions={[
                    node.position,
                    mapGraph.getNode(edgeIdx).position,
                  ]}
                />
              ))}
          </React.Fragment>
        );
      })}
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
