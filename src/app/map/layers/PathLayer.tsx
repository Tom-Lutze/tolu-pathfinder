import React, { useContext, useEffect, useRef } from 'react';
import { Pane, Polyline } from 'react-leaflet';
import {
  AlgoTypes,
  GraphInterface,
  MenuTypes,
  PathInterface,
  PathSearchStates,
  ProcessIdxInterface,
  SettingTypes,
} from '../../../interfaces';
import { SettingContexts } from '../../../utils/SettingsProvider';
import GraphController from '../controller/GraphController';
import PathController from '../controller/PathController';

/** Represents the path search state with Leaflet polylines. */
const PathLayer = (props: {
  graph: GraphInterface;
  path: PathInterface;
  setPath: React.Dispatch<React.SetStateAction<PathInterface>>;
  algoType: AlgoTypes;
  processIdxRef: React.MutableRefObject<ProcessIdxInterface>;
}) => {
  // integrate user setting values from contexts to perform conditional rerendering
  const searchSpeedContext: any = useContext(
    SettingContexts[MenuTypes.Settings][SettingTypes.SearchSpeed]
  );
  const searchSpeed = searchSpeedContext.stateVal;
  const searchSpeedRef = useRef(searchSpeed);

  // updates the search speed setting in reference object
  useEffect(() => {
    searchSpeedRef.current = searchSpeed;
  }, [searchSpeed]);

  // build path based on selected type
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
            searchSpeedRef,
            props.algoType
          );
          break;
        case AlgoTypes.BFS:
          PathController.bfs(
            props.graph,
            props.path,
            props.setPath,
            props.processIdxRef,
            searchSpeedRef,
            props.algoType
          );
          break;
        case AlgoTypes.Dijkstra:
          PathController.dijkstra(
            props.graph,
            props.path,
            props.setPath,
            props.processIdxRef,
            searchSpeedRef,
            props.algoType
          );
          break;
        case AlgoTypes.AStarManhatten:
          PathController.aStarManhatten(
            props.graph,
            props.path,
            props.setPath,
            props.processIdxRef,
            searchSpeedRef,
            props.algoType
          );
          break;
        case AlgoTypes.AStarEuclidean:
          PathController.aStarEuclidean(
            props.graph,
            props.path,
            props.setPath,
            props.processIdxRef,
            searchSpeedRef,
            props.algoType
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
                color: 'yellow',
                dashArray: '10, 10',
                dashOffset: '0',
              }}
              positions={props.path.nodes.map(
                (nodeIdx) =>
                  GraphController.getNode(nodeIdx, props.graph).location
              )}
              interactive={false}
            />
          </Pane>
        )}
      {!props.graph.state.updated &&
        props.path.found &&
        props.path.nodes.length > 1 && (
          <Polyline
            pathOptions={{
              color:
                props.path.state === PathSearchStates.Finalized
                  ? 'lime'
                  : 'orange',
              dashArray: '10, 10',
              dashOffset: '0',
            }}
            positions={props.path.nodes.map(
              (nodeIdx) =>
                GraphController.getNode(nodeIdx, props.graph).location
            )}
            interactive={false}
          />
        )}
    </>
  );
};

export default PathLayer;
