import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import { GraphInterface, PathInterface } from '../interfaces/interfaces';
import GraphController from './controller/GraphController';
import PathController from './controller/PathController';
import MapLayers from './layers/MapLayers';
import './Map.css';

const Map = () => {
  const MapLayer = () => {
    const initGraph: GraphInterface = {
      count: 0,
      nodes: {},
      state: {
        activeNode: undefined,
        prevActiveNode: undefined,
        startNode: undefined,
        endNode: undefined,
      },
    };
    const initPath: PathInterface = {
      found: false,
      path: [],
    };
    const [graph, setGraph] = useState(initGraph);
    const [path, setPath] = useState(initPath);

    const graphController = new GraphController(graph, setGraph);
    const pathController = new PathController(graph, path, setPath);

    useMapEvents({
      click(e) {
        graphController.addNode({ position: e.latlng, edges: undefined });
      },
    });

    useEffect(() => {
      pathController.bfs();
    }, [graph.state, graph.nodes]);

    return (
      <MapLayers
        graphController={graphController}
        pathController={pathController}
      />
    );
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
