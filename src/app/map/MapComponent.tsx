import 'leaflet/dist/leaflet.css';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  FeatureGroup,
  MapContainer,
  TileLayer,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import {
  BuilderStates,
  GraphInterface,
  GraphTypes,
  MenuTypes,
  PathInterface,
  PathSearchStates,
  ProcessIdxInterface,
  SettingTypes,
} from '../../interfaces';
import { SettingContexts } from '../../utils/SettingsProvider';
import GraphController from './controller/GraphController';
import { ControlLayer } from './layers/ControlLayer';
import GraphLayer from './layers/GraphLayer';
import PathLayer from './layers/PathLayer';
import './MapComponent.less';

const MapComponent = () => {
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

  const algoContext: any = useContext(SettingContexts[MenuTypes.Algo]);
  const algoType = algoContext.stateVal;
  const grapContext: any = useContext(SettingContexts[MenuTypes.Graph]);
  const graphType = grapContext.stateVal;
  const gridNodesContext: any = useContext(
    SettingContexts[MenuTypes.Settings][SettingTypes.MaxNodesGrid]
  );
  const gridNodes = gridNodesContext.stateVal;

  const randomNodesContext: any = useContext(
    SettingContexts[MenuTypes.Settings][SettingTypes.MaxNodesRandom]
  );
  const randomNodes = randomNodesContext.stateVal;

  /** Graph type updated */
  useEffect(() => {
    resetPath();
    resetGraph();
  }, [graphType]);

  /** Algo type updated */
  useEffect(() => {
    resetPath();
  }, [algoType]);

  /** Max graph nodes setting updated */
  useEffect(() => {
    if (graphType == GraphTypes.Grid) {
      resetPath();
      resetGraph();
    }
  }, [gridNodes]);

  /** Max random nodes setting updated */
  useEffect(() => {
    if (graphType == GraphTypes.Random) {
      resetPath();
      resetGraph();
    }
  }, [randomNodes]);

  /** Graph state updated */
  useEffect(() => {
    if (graph.state.updated) {
      setGraph({ ...graph, state: { ...graph.state, updated: false } });
      resetPath();
    }
  }, [graph.state.updated]);

  const graphFeatureGroup = useRef<any>();

  const MapEventHandler = () => {
    useMapEvents({
      click(e) {
        if (graph.buildState.state === BuilderStates.Finalized) {
          GraphController.addNode(
            { position: e.latlng, edges: undefined },
            graph,
            setGraph
          );
        }
      },
    });
    return <></>;
  };

  return (
    <MapContainer center={[0, 0]} zoom={13} scrollWheelZoom={true}>
      <MapEventHandler />
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url={`${process.env.PUBLIC_URL}/map-tile.png`}
      />
      <FeatureGroup ref={graphFeatureGroup}>
        <GraphLayer
          graph={graph}
          setGraph={setGraph}
          graphType={graphType}
          processIdxRef={processIdxRef}
        />
      </FeatureGroup>
      <PathLayer
        graph={graph}
        path={path}
        setPath={setPath}
        algoType={algoType}
        processIdxRef={processIdxRef}
      />
      <ControlLayer graph={graph} path={path} />
    </MapContainer>
  );
};

export default React.memo(MapComponent);
