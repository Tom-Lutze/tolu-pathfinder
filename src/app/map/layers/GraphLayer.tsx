import React, { useEffect } from 'react';
import { useMapEvents } from 'react-leaflet';
import {
  BuilderStates,
  GraphCatType,
  GraphInterface,
  PreserveRefInterface,
  ProcessIdxInterface,
} from '../../../interfaces';
import BuilderController from '../controller/BuilderController';
import GraphController from '../controller/GraphController';
import MarkerConnection from './graphLayers/MarkerConnection';
import MarkerWithPopup from './graphLayers/MarkerWithPopup';

const GraphLayer = (props: {
  graph: GraphInterface;
  setGraph: React.Dispatch<React.SetStateAction<GraphInterface>>;
  graphType: GraphCatType;
  processIdxRef: React.MutableRefObject<ProcessIdxInterface>;
}) => {
  useMapEvents({
    click(e) {
      if (props.graph.buildState.state === BuilderStates.Finalized) {
        GraphController.addNode(
          { position: e.latlng, edges: undefined },
          props.graph,
          props.setGraph
        );
      }
    },
  });

  /**
   * Build graph
   */
  useEffect(() => {
    if (props.graph.buildState.state == BuilderStates.Uninitialized) {
      const newGraph = { ...props.graph };
      newGraph.buildState.state = BuilderStates.Initialized;
      props.setGraph(newGraph);
    }
    if (props.graph.buildState.state == BuilderStates.Initialized) {
      switch (props.graphType) {
        case GraphCatType.None:
          break;
        case GraphCatType.Random:
          BuilderController.buildRandomNetwork(
            props.graph,
            props.processIdxRef,
            props.setGraph
          );
          break;
        case GraphCatType.Square:
          BuilderController.buildSquareNetwork(
            props.graph,
            props.processIdxRef,
            props.setGraph
          );
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
