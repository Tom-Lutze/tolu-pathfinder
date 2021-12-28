import React, { useContext, useEffect, useRef } from 'react';
import { Pane, Polyline } from 'react-leaflet';
import {
  AlgoTypes,
  GraphInterface,
  PathInterface,
  PathSearchStates,
  ProcessIdxInterface,
  SettingTypes,
} from '../../../interfaces';
import { SettingContexts } from '../../../utils/SettingsProvider';
// import { SettingContexts } from '../../../utils/SettingsStore';
import GraphController from '../controller/GraphController';
import PathController from '../controller/PathController';

const PathLayer = (props: {
  graph: GraphInterface;
  path: PathInterface;
  setPath: React.Dispatch<React.SetStateAction<PathInterface>>;
  algoType: AlgoTypes;
  processIdxRef: React.MutableRefObject<ProcessIdxInterface>;
}) => {
  const { stateVal } = useContext(SettingContexts[SettingTypes.SearchSpeed]);
  const searchSpeedRef = useRef(stateVal);

  useEffect(() => {
    searchSpeedRef.current = stateVal;
  }, [stateVal]);

  /**
   * Build path
   */
  useEffect(() => {
    if (props.path.state == PathSearchStates.Uninitialized) {
      const newPath = { ...props.path };
      newPath.state = PathSearchStates.Initialized;
      props.setPath(newPath);
    } else if (props.path.state == PathSearchStates.Initialized) {
      switch (props.algoType) {
        case AlgoTypes.DFS:
          PathController.dfs(
            props.graph,
            props.path,
            props.setPath,
            props.processIdxRef,
            searchSpeedRef
          );
          break;
        case AlgoTypes.BFS:
          PathController.bfs(
            props.graph,
            props.path,
            props.setPath,
            props.processIdxRef,
            searchSpeedRef
          );
          break;
        case AlgoTypes.Dijkstra:
          PathController.dijkstra(
            props.graph,
            props.path,
            props.setPath,
            props.processIdxRef,
            searchSpeedRef
          );
          break;
        case AlgoTypes.AStarManhatten:
          PathController.aStarManhatten(
            props.graph,
            props.path,
            props.setPath,
            props.processIdxRef,
            searchSpeedRef
          );
          break;
        case AlgoTypes.AStarEuclidean:
          PathController.aStarEuclidean(
            props.graph,
            props.path,
            props.setPath,
            props.processIdxRef,
            searchSpeedRef
          );
          break;
      }
    }
  }, [props.path.state, searchSpeedRef]);

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
                color:
                  props.path.state === PathSearchStates.Finalized
                    ? 'red'
                    : 'orange',
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
