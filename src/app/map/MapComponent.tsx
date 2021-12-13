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
import GraphLayer from './layers/GraphLayer';
import PathLayer from './layers/PathLayer';
import './MapComponent.css';

const MapComponent = (props: {
  graphType: GraphCatType;
  algoType: AlgoCatType;
  preserveRef: PreserveRefInterface;
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
      state: BUILDER_STATES.Uninitialized,
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
  };
  const [graph, setGraph] = useState(initGraph);
  // const resetGraph = () => setGraph(initGraph);
  const [path, setPath] = useState(initPath);

  const graphRef = useRef(graph);
  const pathRef = useRef(path);
  // pathRef.current = path;

  return (
    <MapContainer center={[0, 0]} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url={`${process.env.PUBLIC_URL}/map-tile.png`}
      />
      <GraphLayer
        graph={graph}
        graphRef={graphRef}
        setGraph={setGraph}
        initGraph={initGraph}
        graphType={props.graphType}
        preserveRef={props.preserveRef}
      />
    </MapContainer>
  );
};

export default React.memo(MapComponent);
