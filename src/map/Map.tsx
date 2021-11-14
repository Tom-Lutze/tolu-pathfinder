import 'leaflet/dist/leaflet.css';
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import { GraphInterface } from '../interfaces/interfaces';
import GraphController from './graph/GraphController';
import { Pathfinder } from './graph/Pathfinder';
import MapLayers from './layers/MapLayers';
import './Map.css';

const Map = () => {
  const MapLayer = () => {
    const initGraphState: GraphInterface = {
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
    };
    const [graph, setGraph] = useState(initGraphState);

    const graphController = new GraphController(graph, setGraph);

    useMapEvents({
      click(e) {
        graphController.addNode({ position: e.latlng, edges: undefined });
      },
    });

    useEffect(() => {
      Pathfinder(graphController).bfs();
    }, [graph.state.startNode, graph.state.endNode]);

    return <MapLayers graphController={graphController} />;
  };

  return (
    <MapContainer center={[0, 0]} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url={`${process.env.PUBLIC_URL}/map-tile.png`}
      />
      <MapLayer />
    </MapContainer>
  );
};

export default Map;
