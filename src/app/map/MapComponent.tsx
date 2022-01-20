import { Spin } from 'antd';
import 'leaflet/dist/leaflet.css';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  FeatureGroup,
  MapContainer,
  TileLayer,
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
import { appStrings } from '../constants/Strings';
import GraphController from './controller/GraphController';
import GraphLayer from './layers/GraphLayer';
import PathLayer from './layers/PathLayer';
import { StatisticsLayer } from './layers/StatisticsLayer';
import map_tile from '../../assets/map-tile.png';

/** A leaflet {@link MapContainer} wrapped with a {@link Spin} component that
 * initializes and handles updates on the graph and path states. */
const MapComponent = () => {
  // initialize the graph state
  const initGraph: GraphInterface = {
    nodeIndexer: 0,
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
  const [graph, setGraph] = useState(initGraph);

  // initialize the path state
  const initPath: PathInterface = {
    found: false,
    nodes: [],
    processIdx: 0,
    visitedNodesCounter: 0,
    state: PathSearchStates.Uninitialized,
    history: [],
  };
  const [path, setPath] = useState(initPath);

  // initialize the process reference
  const processIdx: ProcessIdxInterface = {
    graphIdx: 0,
    pathIdx: 0,
  };
  const processIdxRef = useRef(processIdx);

  // reset graph to it's initial values
  const resetGraph = () => {
    const newGraph = { ...initGraph };
    processIdxRef.current = {
      ...processIdxRef.current,
      graphIdx: processIdxRef.current.graphIdx + 1,
    };
    setGraph(newGraph);
  };

  // reset path to it's initial values (optionally can keep the path search history)
  const resetPath = (keepHistory = false) => {
    const newPath = { ...initPath };
    if (keepHistory) newPath.history = path.history;
    processIdxRef.current = {
      ...processIdxRef.current,
      pathIdx: processIdxRef.current.pathIdx + 1,
    };
    setPath(newPath);
  };

  // integrate user setting values from contexts to perform conditional rerendering
  const algoContext: any = useContext(SettingContexts[MenuTypes.Algo]);
  const algoType = algoContext.stateVal;
  const graphContext: any = useContext(SettingContexts[MenuTypes.Graph]);
  const graphType = graphContext.stateVal;
  const gridNodesContext: any = useContext(
    SettingContexts[MenuTypes.Settings][SettingTypes.MaxNodesGrid]
  );
  const gridNodes = gridNodesContext.stateVal;
  const randomNodesContext: any = useContext(
    SettingContexts[MenuTypes.Settings][SettingTypes.MaxNodesRandom]
  );
  const randomNodes = randomNodesContext.stateVal;

  // Graph type updated
  useEffect(() => {
    resetPath();
    resetGraph();
  }, [graphType]);

  // Algo type updated
  useEffect(() => {
    resetPath(true);
  }, [algoType]);

  // Max graph nodes setting updated
  useEffect(() => {
    if (graphType == GraphTypes.Grid) {
      resetPath();
      resetGraph();
    }
  }, [gridNodes]);

  // Max random nodes setting updated
  useEffect(() => {
    if (graphType == GraphTypes.Random) {
      resetPath();
      resetGraph();
    }
  }, [randomNodes]);

  // Graph state updated
  useEffect(() => {
    if (graph.state.updated) {
      setGraph({
        ...graph,
        state: {
          ...graph.state,
          updated: false,
        },
      });
      resetPath();
    }
  }, [graph.state.updated]);

  // handle click events on the map container
  const MapEventHandler = () => {
    useMapEvents({
      click(e) {
        if (graph.buildState.state === BuilderStates.Finalized) {
          GraphController.addNode(
            {
              position: e.latlng,
              edges: undefined,
            },
            graph,
            setGraph
          );
        }
      },
    });
    return <></>;
  };

  return (
    <Spin
      spinning={graph.buildState.state < BuilderStates.Finalized}
      size="large"
      tip={appStrings.spinTip}
    >
      <MapContainer
        center={[0, 0]}
        zoom={13}
        scrollWheelZoom={true}
        id="leaflet-map-container"
      >
        <TileLayer
          attribution={`&copy; <a href="https://lutze-it.com" title="${appStrings.attributionTitle}" target="_blank">Lutze-IT</a>`}
          url={map_tile}
        />
        <GraphLayer
          graph={graph}
          setGraph={setGraph}
          graphType={graphType}
          processIdxRef={processIdxRef}
        />
        <PathLayer
          graph={graph}
          path={path}
          setPath={setPath}
          algoType={algoType}
          processIdxRef={processIdxRef}
        />
        <div className="leaflet-control-container">
          <StatisticsLayer graph={graph} path={path} />
        </div>
        <MapEventHandler />
      </MapContainer>
    </Spin>
  );
};

export default React.memo(MapComponent);
