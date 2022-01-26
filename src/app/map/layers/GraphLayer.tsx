import React, { useContext, useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import {
  BuilderStates,
  GraphInterface,
  GraphTypes,
  MenuTypes,
  ProcessIdxInterface,
  SettingTypes,
} from '../../../interfaces/Interfaces';
import { SettingContexts } from '../../settings/SettingsProvider';
import { CONSTANTS } from '../../constants/Constants';
import BuilderController from '../../controller/BuilderController';
import GraphController from '../../controller/GraphController';
import Edge from './graph/Edge';
import Node from './graph/Node';

/** Representation of the graph with map markers and polylines. */
const GraphLayer = (props: {
  graph: GraphInterface;
  setGraph: React.Dispatch<React.SetStateAction<GraphInterface>>;
  graphType: GraphTypes;
  processIdxRef: React.MutableRefObject<ProcessIdxInterface>;
}) => {
  // integrate user setting values from contexts to perform conditional rerendering
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

  // updates the build speed setting in reference object
  useEffect(() => {
    buildSpeedRef.current = buildSpeed;
  }, [buildSpeed]);

  // build graph based on selected type
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
          // set map focus on generated graph
          map.fitBounds([
            [0, 0],
            [
              CONSTANTS.randomGraph.latLngMax / 100,
              CONSTANTS.randomGraph.latLngMax / 100,
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
          // set map focus on generated graph
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
            <Node
              nodeIdx={nodeIdx}
              graph={props.graph}
              setGraph={props.setGraph}
            />
            <Edge
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
