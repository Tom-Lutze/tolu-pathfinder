import React, { useContext, useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import {
  BuilderStates,
  GraphInterface,
  GraphTypes,
  MenuTypes,
  ProcessIdxInterface,
  SettingTypes,
} from '../../../interfaces';
import { SettingContexts } from '../../../utils/SettingsProvider';
import { APP_SETTINGS } from '../../constants/Settings';
import BuilderController from '../controller/BuilderController';
import GraphController from '../controller/GraphController';
import MarkerConnection from '../elements/MarkerConnection';
import MarkerWithPopup from '../elements/MarkerWithPopup';

const GraphLayer = (props: {
  graph: GraphInterface;
  setGraph: React.Dispatch<React.SetStateAction<GraphInterface>>;
  graphType: GraphTypes;
  processIdxRef: React.MutableRefObject<ProcessIdxInterface>;
}) => {
  const buildSpeedContext: any = useContext(
    SettingContexts[MenuTypes.Settings][SettingTypes.BuildSpeed]
  );
  const buildSpeed = buildSpeedContext.stateVal;
  const buildSpeedRef = useRef(buildSpeed);

  const gridNodesContext: any = useContext(
    SettingContexts[MenuTypes.Settings][SettingTypes.MaxNodesGrid]
  );
  const gridNodes = gridNodesContext.stateVal;

  const randomNodesContext: any = useContext(
    SettingContexts[MenuTypes.Settings][SettingTypes.MaxNodesRandom]
  );
  const randomNodes = randomNodesContext.stateVal;

  const map = useMap();

  /** Update build speed setting */
  useEffect(() => {
    buildSpeedRef.current = buildSpeed;
  }, [buildSpeed]);

  /** Build graph */
  useEffect(() => {
    if (props.graph.buildState.state == BuilderStates.Uninitialized) {
      const newGraph = { ...props.graph };
      newGraph.buildState.state = BuilderStates.Initialized;
      props.setGraph(newGraph);
    }
    if (props.graph.buildState.state == BuilderStates.Initialized) {
      switch (props.graphType) {
        case GraphTypes.None:
          props.setGraph({
            ...props.graph,
            buildState: {
              ...props.graph.buildState,
              state: BuilderStates.Finalized,
            },
          });
          break;
        case GraphTypes.Random:
          BuilderController.buildRandomNetwork(
            props.graph,
            props.processIdxRef,
            props.setGraph,
            randomNodes,
            buildSpeedRef
          );
          map.fitBounds([
            [0, 0],
            [
              APP_SETTINGS.randomGraph.latLngMax / 100,
              APP_SETTINGS.randomGraph.latLngMax / 100,
            ],
          ]);
          break;
        case GraphTypes.Grid:
          BuilderController.buildGridNetwork(
            props.graph,
            props.processIdxRef,
            props.setGraph,
            gridNodes,
            buildSpeedRef
          );
          map.fitBounds([
            [0, 0],
            [gridNodes / 100, gridNodes / 100],
          ]);
          break;
      }
    }
  }, [props.graph.buildState.state]);

  return (
    <>
      {GraphController.getNodesIdx(props.graph).map((nodeIdx: number) => {
        return (
          <React.Fragment key={`marker-${nodeIdx}`}>
            <MarkerWithPopup
              nodeIdx={nodeIdx}
              graph={props.graph}
              setGraph={props.setGraph}
            />
            <MarkerConnection
              nodeIdx={nodeIdx}
              graph={props.graph}
              setGraph={props.setGraph}
            />
          </React.Fragment>
        );
      })}
    </>
  );
};

export default GraphLayer;
