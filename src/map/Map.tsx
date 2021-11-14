import 'leaflet/dist/leaflet.css';
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import {
  GraphInterface,
  GraphStateInterface,
  PathInterface,
} from '../interfaces/interfaces';
import GraphController from './graph/GraphController';
import Pathfinder from './graph/Pathfinder';
import MapLayers from './layers/MapLayers';
import './Map.css';

const Map = () => {
  const MapLayer = () => {
    const initGraph: GraphInterface = {};
    const initGraphState: GraphStateInterface = {
      activeNode: undefined,
      prevActiveNode: undefined,
      startNode: undefined,
      endNode: undefined,
    };
    const initPathState: PathInterface = {
      search: false,
      path: [],
    };
    const [graph, setGraph] = useState(initGraph);
    const [graphState, setGraphState] = useState(initGraphState);
    const [path, setPath] = useState(initPathState);
    const [findPath, setFindPath] = useState(false);

    const pathFinder = new Pathfinder(graph, graphState, setPath);

    const graphController = new GraphController(
      graph,
      setGraph,
      graphState,
      setGraphState,
      path,
      setFindPath
    );

    useMapEvents({
      click(e) {
        graphController.addNode({ position: e.latlng, edges: undefined });
      },
    });

    // useEffect(() => {
    //   Pathfinder(graphController).bfs();
    // }, [graph.state.startNode, graph.state.endNode]);
    useEffect(() => {
      // setFindPath(false);
      pathFinder.bfs();
    }, [findPath]);

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
