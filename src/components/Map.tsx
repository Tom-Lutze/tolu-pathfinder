import Leaflet from 'leaflet';
import MarkerIcon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import React, { useState } from 'react';
import {
  MapContainer,
  Marker,
  Pane,
  Polyline,
  Popup,
  TileLayer,
  useMapEvents,
} from 'react-leaflet';
import Graph from './util/Graph';
import './Map.css';
import { Pathfinder } from './util/Pathfinder';

const MarkerIconDefault = Leaflet.icon({
  iconUrl: MarkerIcon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [13, 41],
  popupAnchor: [2, -40],
});

const getMarkerIconPath = (color: string) =>
  `${process.env.PUBLIC_URL}/marker/marker-icon-${color}.png`;

const MarkerIconGreen = Leaflet.icon({
  ...MarkerIconDefault.options,
  iconUrl: getMarkerIconPath('green'),
});
const MarkerIconRed = Leaflet.icon({
  ...MarkerIconDefault.options,
  iconUrl: getMarkerIconPath('red'),
});
const MarkerIconYellow = Leaflet.icon({
  ...MarkerIconDefault.options,
  iconUrl: getMarkerIconPath('yellow'),
});

Leaflet.Marker.prototype.options.icon = MarkerIconDefault;

const MapLayers = () => {
  const mapGraph = Graph(
    useState({
      nodes: {},
      state: {
        activeNode: undefined,
        prevActiveNode: undefined,
        startNode: undefined,
        endNode: undefined,
      },
    })
  );

  useMapEvents({
    click(e) {
      mapGraph.addNode({ position: e.latlng, edges: undefined });
    },
  });

  const activeNode = mapGraph.getActiveNode();
  const prevActiveNode = mapGraph.getPrevActiveNode();
  const startNode = mapGraph.getStartNode();
  const endNode = mapGraph.getEndNode();
  const pathBfs = Pathfinder(mapGraph.getGraph()).bfs();

  const showConnectOption = () => {
    if (prevActiveNode && activeNode && prevActiveNode !== activeNode) {
      if (
        mapGraph.getNode(prevActiveNode).edges?.has(activeNode) ||
        mapGraph.getNode(activeNode).edges?.has(prevActiveNode)
      ) {
        return false;
      } else {
        return true;
      }
    }
    return false;
  };

  return (
    <>
      {mapGraph.getNodesIdx().map((nodeIdx: number) => {
        const node = mapGraph.getGraph().nodes[nodeIdx];
        return (
          <React.Fragment key={`marker-${nodeIdx}`}>
            <Marker
              draggable={true}
              position={node.position}
              opacity={
                activeNode == nodeIdx
                  ? 1
                  : prevActiveNode == nodeIdx
                  ? 0.75
                  : 0.3
              }
              icon={
                nodeIdx === startNode
                  ? MarkerIconRed
                  : nodeIdx === endNode
                  ? MarkerIconGreen
                  : MarkerIconDefault
              }
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
              {...{
                nodeIdx: nodeIdx,
              }}
            >
              <Popup>
                <span>
                  <a onClick={() => mapGraph.setStartNode(nodeIdx)}>Start</a>
                  {' | '}
                  {showConnectOption() && (
                    <>
                      <a onClick={() => mapGraph.connectNodes()}>Connect</a>
                      {' | '}
                    </>
                  )}
                  <a onClick={() => mapGraph.setEndNode(nodeIdx)}>End</a>
                  <br />
                  <a onClick={() => mapGraph.removeNode(nodeIdx)}>Remove</a>
                </span>
              </Popup>
            </Marker>
            {node.edges &&
              node.edges.size > 0 &&
              Array.from(node.edges).map((edgeIdx: number) => (
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
      {pathBfs.length > 1 && (
        <Pane name="tolu-path-pane">
          <Polyline
            pathOptions={{
              color: 'red',
              dashArray: '20, 20',
              dashOffset: '0',
            }}
            positions={pathBfs.map(
              (nodeIdx) => mapGraph.getNode(nodeIdx).position
            )}
            {...{ zIndex: 9999 }}
          />
        </Pane>
      )}
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
