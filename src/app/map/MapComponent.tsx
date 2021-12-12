import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import {
  AlgoCatType,
  GraphCatType,
  GraphInterface,
  PathInterface,
  PreserveRefInterface,
} from '../../interfaces';
import { BUILDER_STATES } from './constants/Settings';
import BuilderController from './controller/BuilderController';
import GraphController from './controller/GraphController';
import PathController from './controller/PathController';
import MapLayers from './layers/MapLayers';
import './MapComponent.css';

const MapComponent = (param: {
  graphType: GraphCatType;
  algoType: AlgoCatType;
  preserveRef: PreserveRefInterface;
}) => {
  const MapLayer = () => {
    const initGraph: GraphInterface = {
      nodeCount: 0,
      nodes: {},
      state: {
        updated: false,
        activeNode: undefined,
        prevActiveNode: undefined,
        startNode: undefined,
        endNode: undefined,
      },
      buildState: {
        state: BUILDER_STATES.Uninitialized,
        counterA: 0,
        counterB: 0,
        nodeAddresses: new Map(),
        nodeDistances: undefined,
      },
    };

    const initPath: PathInterface = {
      found: false,
      nodes: [],
      searchProcessIdx: 0,
    };
    const [graph, setGraph] = useState(initGraph);
    const [path, setPath] = useState(initPath);

    const pathRef = useRef(path);
    pathRef.current = path;

    useMapEvents({
      click(e) {
        if (graph.buildState.state === BUILDER_STATES.Ready) {
          GraphController.addNode(
            { position: e.latlng, edges: undefined },
            graph,
            setGraph
          );
        }
      },
    });

    /**
     * Preserve graph state for re-render
     */
    useEffect(() => {
      if (graph.buildState.state >= BUILDER_STATES.Ready) {
        param.preserveRef.current.prevGraph = graph;
      }
    }, [graph]);

    /**
     * Build graph
     */
    useEffect(() => {
      if (
        param.preserveRef.current.prevGraph &&
        param.algoType !== param.preserveRef.current.prevAlgo
      ) {
        const prevGraphState: GraphInterface =
          param.preserveRef.current.prevGraph;
        setGraph({
          ...prevGraphState,
          state: { ...prevGraphState.state, updated: true },
        });
        param.preserveRef.current.prevAlgo = param.algoType;
      } else if (graph.buildState.state < BUILDER_STATES.Ready) {
        switch (param.graphType) {
          case GraphCatType.None:
            break;
          case GraphCatType.Random:
            BuilderController.buildRandomNetwork(graph, setGraph);
            break;
          case GraphCatType.Square:
            BuilderController.buildSquareNetwork(graph, setGraph);
        }
      }
    }, [
      param.algoType,
      graph.buildState.state,
      graph.buildState.counterA,
      graph.buildState.counterB,
    ]);

    /**
     * Build path
     */
    useEffect(() => {
      if (graph.buildState.state < BUILDER_STATES.Ready) return;
      if (graph.state.updated && path.nodes.length > 0) {
        setPath({ ...initPath, searchProcessIdx: path.searchProcessIdx + 1 });
      } else if (graph.state.updated && path.nodes.length < 1) {
        setGraph({ ...graph, state: { ...graph.state, updated: false } });
        switch (param.algoType) {
          case AlgoCatType.DFS:
            PathController.dfs(graph, pathRef, setPath);
            break;
          case AlgoCatType.BFS:
            PathController.bfs(graph, pathRef, setPath);
            break;
        }
      }
    }, [
      graph.buildState.state,
      graph.state.updated,
      path.nodes,
      param.algoType,
    ]);

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

export default React.memo(MapComponent);
