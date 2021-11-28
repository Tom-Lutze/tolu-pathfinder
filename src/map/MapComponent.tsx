import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import { GraphInterface, PathInterface } from '../interfaces/interfaces';
import { BuilderStates, NODES_PER_AXIS } from './constants/Settings';
import BuilderController from './controller/BuilderController';
import GraphController from './controller/GraphController';
import PathController from './controller/PathController';
import MapLayers from './layers/MapLayers';
import './MapComponent.css';

const MapComponent = () => {
  const MapLayer = () => {
    const initGraph: GraphInterface = {
      count: 0,
      nodes: {},
      state: {
        updated: false,
        activeNode: undefined,
        prevActiveNode: undefined,
        startNode: undefined,
        endNode: undefined,
      },
      buildState: {
        state: BuilderStates.Uninitialized,
        iNext: NODES_PER_AXIS,
        jNext: -NODES_PER_AXIS,
        nodeAddresses: new Map(),
      },
    };
    const initPath: PathInterface = {
      found: false,
      nodes: [],
      searchIdx: 0,
    };

    const [graph, setGraph] = useState(initGraph);
    const [path, setPath] = useState(initPath);

    const pathRef = useRef(path);
    pathRef.current = path;

    useMapEvents({
      click(e) {
        if (graph.buildState.state === BuilderStates.Ready) {
          GraphController.addNode(
            { position: e.latlng, edges: undefined },
            graph,
            setGraph
          );
        }
      },
    });

    useEffect(() => {
      if (graph.buildState.state < BuilderStates.Ready) {
        BuilderController.buildNetwork(graph, setGraph);
      }
    }, [
      graph.buildState.state,
      graph.buildState.iNext,
      graph.buildState.jNext,
    ]);

    useEffect(() => {
      if (graph.buildState.state < BuilderStates.Ready) return;
      if (graph.state.updated && path.nodes.length > 0) {
        setPath({ ...initPath, searchIdx: path.searchIdx + 1 });
      } else if (graph.state.updated && path.nodes.length < 1) {
        setGraph({ ...graph, state: { ...graph.state, updated: false } });
        PathController.dfs(graph, pathRef, setPath);
      }
    }, [graph.buildState.state, graph.state.updated, path.nodes]);

    return <MapLayers graph={graph} setGraph={setGraph} path={path} />;
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

export default MapComponent;
