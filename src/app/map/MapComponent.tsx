import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import {
  AlgoCatType,
  BuilderStates,
  GraphCatType,
  GraphInterface,
  PathInterface,
  PathSearchStates,
  ProcessIdxInterface,
} from '../../interfaces';
import GraphLayer from './layers/GraphLayer';
import PathLayer from './layers/PathLayer';
import './MapComponent.css';

const MapComponent = (props: {
  graphType: GraphCatType;
  algoType: AlgoCatType;
}) => {
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
      state: BuilderStates.Uninitialized,
      counterA: 0,
      counterB: 0,
      nodeAddresses: new Map(),
      nodeDistances: undefined,
    },
    processIdx: 0,
  };

  const initPath: PathInterface = {
    found: false,
    nodes: [],
    processIdx: 0,
    state: PathSearchStates.Uninitialized,
  };
  const [graph, setGraph] = useState(initGraph);
  const [path, setPath] = useState(initPath);

  const processIdx: ProcessIdxInterface = {
    graphIdx: 0,
    pathIdx: 0,
  };

  const processIdxRef = useRef(processIdx);
  const resetGraph = () => {
    const newGraph = { ...initGraph };
    processIdxRef.current = {
      ...processIdxRef.current,
      graphIdx: processIdxRef.current.graphIdx + 1,
    };
    setGraph(newGraph);
  };

  const resetPath = () => {
    const newPath = { ...initPath };
    processIdxRef.current = {
      ...processIdxRef.current,
      pathIdx: processIdxRef.current.pathIdx + 1,
    };
    setPath(newPath);
  };

  useEffect(() => {
    resetPath();
    resetGraph();
  }, [props.graphType]);

  useEffect(() => {
    resetPath();
  }, [props.algoType]);

  useEffect(() => {
    if (graph.state.updated) {
      setGraph({ ...graph, state: { ...graph.state, updated: false } });
      resetPath();
    }
  }, [graph.state.updated]);

  return (
    <MapContainer center={[0, 0]} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url={`${process.env.PUBLIC_URL}/map-tile.png`}
      />
      <GraphLayer
        graph={graph}
        setGraph={setGraph}
        graphType={props.graphType}
        processIdxRef={processIdxRef}
      />

      <PathLayer
        graph={graph}
        path={path}
        setPath={setPath}
        algoType={props.algoType}
        processIdxRef={processIdxRef}
      />
    </MapContainer>
  );
};

export default React.memo(MapComponent);
