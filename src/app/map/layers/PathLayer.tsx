import React, { useEffect } from 'react';
import { Pane, Polyline } from 'react-leaflet';
import {
  AlgoCatType,
  GraphInterface,
  PathInterface,
  PreserveRefInterface,
} from '../../../interfaces';
import { BUILDER_STATES } from '../constants/Settings';
import GraphController from '../controller/GraphController';
import PathController from '../controller/PathController';

const PathLayer = (props: {
  graph: GraphInterface;
  setGraph: React.Dispatch<React.SetStateAction<GraphInterface>>;
  path: PathInterface;
  setPath: React.Dispatch<React.SetStateAction<PathInterface>>;
  pathRef: React.MutableRefObject<PathInterface>;
  initPath: PathInterface;
  preserveRef: PreserveRefInterface;
  // graphType: GraphCatType;
  algoType: AlgoCatType;
}) => {
  /**
   * Preserve graph state for re-render
   */
  useEffect(() => {
    if (props.graph.buildState.state >= BUILDER_STATES.Ready) {
      props.preserveRef.current.prevGraph = props.graph;
    }
  }, [props.graph]);

  /**
   * Build path
   */
  useEffect(() => {
    if (props.graph.buildState.state < BUILDER_STATES.Ready) return;
    if (props.graph.state.updated && props.path.nodes.length > 0) {
      props.setPath({
        ...props.initPath,
        processIdx: props.path.processIdx + 1,
      });
    } else if (props.graph.state.updated && props.path.nodes.length < 1) {
      props.setGraph({
        ...props.graph,
        state: { ...props.graph.state, updated: false },
      });
      switch (props.algoType) {
        case AlgoCatType.DFS:
          PathController.dfs(props.graph, props.pathRef, props.setPath);
          break;
        case AlgoCatType.BFS:
          PathController.bfs(props.graph, props.pathRef, props.setPath);
          break;
      }
    }
  }, [
    props.graph.buildState.state,
    props.graph.state.updated,
    props.path.nodes,
    props.algoType,
  ]);

  return (
    <>
      {!props.graph.state.updated &&
        !props.path.found &&
        props.path.nodes.length > 1 && (
          <Pane name="tolu-search-path-pane">
            <Polyline
              pathOptions={{
                color: 'blue',
                dashArray: '10, 10',
                dashOffset: '0',
              }}
              positions={props.path.nodes.map(
                (nodeIdx) =>
                  GraphController.getNode(nodeIdx, props.graph).position
              )}
              {...{ zIndex: 9998 }}
            />
          </Pane>
        )}
      {!props.graph.state.updated &&
        props.path.found &&
        props.path.nodes.length > 1 && (
          <Pane name="tolu-path-pane">
            <Polyline
              pathOptions={{
                color: 'red',
                dashArray: '10, 10',
                dashOffset: '0',
              }}
              positions={props.path.nodes.map(
                (nodeIdx) =>
                  GraphController.getNode(nodeIdx, props.graph).position
              )}
              {...{ zIndex: 9999 }}
            />
          </Pane>
        )}
    </>
  );
};

export default PathLayer;
