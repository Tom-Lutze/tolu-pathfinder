import React, { useEffect } from 'react';
import { Pane, Polyline } from 'react-leaflet';
import {
  AlgoCatType,
  GraphInterface,
  PathInterface,
  PathSearchStates,
  ProcessIdxInterface,
} from '../../../interfaces';
import GraphController from '../controller/GraphController';
import PathController from '../controller/PathController';

const PathLayer = (props: {
  graph: GraphInterface;
  path: PathInterface;
  setPath: React.Dispatch<React.SetStateAction<PathInterface>>;
  algoType: AlgoCatType;
  processIdxRef: React.MutableRefObject<ProcessIdxInterface>;
}) => {
  /**
   * Build path
   */
  useEffect(() => {
    console.log('uE - build path');
    if (props.path.state == PathSearchStates.Uninitialized) {
      const newPath = { ...props.path };
      newPath.state = PathSearchStates.Initialized;
      props.setPath(newPath);
    } else if (props.path.state == PathSearchStates.Initialized) {
      console.log('uE - path finding');
      switch (props.algoType) {
        case AlgoCatType.DFS:
          PathController.dfs(
            props.graph,
            props.path,
            props.setPath,
            props.processIdxRef
          );
          break;
        case AlgoCatType.BFS:
          PathController.bfs(
            props.graph,
            props.path,
            props.setPath,
            props.processIdxRef
          );
          break;
      }
    }
  }, [props.path.state]);

  return (
    <>
      {!props.path.found && props.path.nodes.length > 1 && (
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
      {props.path.found && props.path.nodes.length > 1 && (
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
