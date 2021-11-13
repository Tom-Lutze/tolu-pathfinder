import Leaflet, { map } from 'leaflet';
import MarkerIcon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useState } from 'react';
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
      path: {
        searchPath: [],
        foundPath: [],
      },
    })
  );
  const graph = mapGraph.getGraph();

  useMapEvents({
    click(e) {
      mapGraph.addNode({ position: e.latlng, edges: undefined });
    },
  });

  useEffect(() => {
    Pathfinder(mapGraph).bfs();
  }, [graph.state.startNode, graph.state.endNode]);

  const activeNode = mapGraph.getActiveNode();
  const prevActiveNode = mapGraph.getPrevActiveNode();
  const startNode = mapGraph.getStartNode();
  const endNode = mapGraph.getEndNode();
  const drawnEdges = new Set<string>();

  const showConnectOption = () => {
    if (prevActiveNode && activeNode && prevActiveNode !== activeNode) {
      return !(
        mapGraph.getNode(prevActiveNode).edges?.has(activeNode) ||
        mapGraph.getNode(activeNode).edges?.has(prevActiveNode)
      );
    }
    return false;
  };

  return (
    <>
      {mapGraph.getNodesIdx().map((nodeIdx: number) => {
        const node = graph.nodes[nodeIdx];
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
              Array.from(node.edges).reduce(
                (prevValue: any, edgeIdx: number) => {
                  if (
                    !drawnEdges.has(`${nodeIdx}-${edgeIdx}`) &&
                    !drawnEdges.has(`${edgeIdx}-${nodeIdx}`)
                  ) {
                    drawnEdges.add(`${nodeIdx}-${edgeIdx}`);
                    const edgePolyline = (
                      <Polyline
                        key={`polyline-${nodeIdx}-${edgeIdx}`}
                        pathOptions={{ color: 'lime' }}
                        positions={[
                          node.position,
                          mapGraph.getNode(edgeIdx).position,
                        ]}
                      >
                        <Popup>
                          <span>Test</span>
                        </Popup>
                      </Polyline>
                    );
                    prevValue.push(edgePolyline);
                  }
                  return prevValue;
                },
                []
              )}
          </React.Fragment>
        );
      })}
      {graph.path.searchPath.length > 1 && (
        <Pane name="tolu-search-path-pane">
          <Polyline
            pathOptions={{
              color: 'blue',
              dashArray: '20, 20',
              dashOffset: '0',
            }}
            positions={graph.path.searchPath.map(
              (nodeIdx) => mapGraph.getNode(nodeIdx).position
            )}
            {...{ zIndex: 9998 }}
          />
        </Pane>
      )}
      {graph.path.foundPath.length > 1 && (
        <Pane name="tolu-path-pane">
          <Polyline
            pathOptions={{
              color: 'red',
              dashArray: '20, 20',
              dashOffset: '0',
            }}
            positions={graph.path.foundPath.map(
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
