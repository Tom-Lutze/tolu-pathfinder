import React, { useEffect, useRef, useState } from 'react';
import { useMapEvents } from 'react-leaflet';
import {
  AlgoCatType,
  GraphCatType,
  GraphInterface,
  PathInterface,
  PreserveRefInterface,
} from '../../../interfaces';
import { BUILDER_STATES } from '../constants/Settings';
import BuilderController from '../controller/BuilderController';
import GraphController from '../controller/GraphController';
import PathController from '../controller/PathController';
import MarkerConnection from './graphLayers/MarkerConnection';
import MarkerWithPopup from './graphLayers/MarkerWithPopup';

const GraphLayer = (props: {
  graph: GraphInterface;
  graphRef: React.MutableRefObject<GraphInterface>;
  setGraph: React.Dispatch<React.SetStateAction<GraphInterface>>;
  // resetGraph: () => void;
  initGraph: GraphInterface;
  // path: PathInterface;
  preserveRef: PreserveRefInterface;
  graphType: GraphCatType;
  // algoType: AlgoCatType;
}) => {
  useMapEvents({
    click(e) {
      if (props.graph.buildState.state === BUILDER_STATES.Ready) {
        GraphController.addNode(
          { position: e.latlng, edges: undefined },
          props.graph,
          props.setGraph
        );
      }
    },
  });

  /**
   * Preserve graph state for re-render
   */
  // useEffect(() => {
  //   console.log('uE - preserve graph');
  //   if (props.graph.buildState.state >= BUILDER_STATES.Ready) {
  //     props.preserveRef.current.prevGraph = props.graph;
  //   }
  // }, [props.graph]);

  /**
   * New graph type
   */
  // useEffect(() => {
  //   console.log('uE - new graph type');
  //   const initGraph: GraphInterface = {
  //     nodeCount: 0,
  //     nodes: {},
  //     state: {
  //       updated: false,
  //       activeNode: undefined,
  //       prevActiveNode: undefined,
  //       startNode: undefined,
  //       endNode: undefined,
  //     },
  //     buildState: {
  //       state: BUILDER_STATES.Uninitialized,
  //       counterA: 0,
  //       counterB: 0,
  //       nodeAddresses: new Map(),
  //       nodeDistances: undefined,
  //     },
  //     processIdx: 0,
  //   };
  //   props.setGraph(initGraph);
  // }, [props.graphType]);

  /**
   * Build graph
   */
  useEffect(() => {
    // if (props.graph.buildState.state < BUILDER_STATES.Ready) {
    if (props.graph.buildState.state == BUILDER_STATES.Uninitialized) {
      console.log('uE - build graph: ' + props.graphType);
      switch (props.graphType) {
        case GraphCatType.None:
          break;
        case GraphCatType.Random:
          BuilderController.buildRandomNetwork(props.graph, props.setGraph);
          break;
        case GraphCatType.Square:
          BuilderController.buildSquareNetwork(props.graph, props.setGraph);
      }
    }
  }, [
    props.graph.buildState.state,
    props.graph.buildState.counterA,
    props.graph.buildState.counterB,
  ]);

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
