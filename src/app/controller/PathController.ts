import { LatLng } from 'leaflet';
import {
  AlgoTypes,
  AStarNodeInterface,
  GraphInterface,
  PathInterface,
  PathSearchStates,
  ProcessIdxInterface,
} from '../../interfaces/Interfaces';
import { sleep } from '../../utils/Utils';
import { CONSTANTS } from '../constants/Constants';

/**
 * Provides functions to calculate paths between start and end nodes.
 */
export default class PathController {
  /**
   * Executes a breadth-first-search on the current graph.
   *
   * @param graph Current graph state object
   * @param path Current path state object
   * @param setPath Paths set-state function
   * @param processIdxRef Process index reference object
   * @param searchSpeed Current search speed setting
   * @param algoType Current algorithm (for history)
   */
  static bfs(
    graph: GraphInterface,
    path: PathInterface,
    setPath: React.Dispatch<React.SetStateAction<PathInterface>>,
    processIdxRef: React.MutableRefObject<ProcessIdxInterface>,
    searchSpeed: React.MutableRefObject<any>,
    algoType: AlgoTypes
  ) {
    PathControllerHelper.searchAlgorithm(
      graph,
      path,
      setPath,
      processIdxRef,
      (array: number[][]) => array.shift(),
      searchSpeed,
      algoType
    );
  }

  /**
   * Executes a depth-first-search on the current graph.
   *
   * @param graph Current graph state object
   * @param path Current path state object
   * @param setPath Paths set-state function
   * @param processIdxRef Process index reference object
   * @param searchSpeed Current search speed setting
   * @param algoType Current algorithm (for history)
   */
  static dfs(
    graph: GraphInterface,
    path: PathInterface,
    setPath: React.Dispatch<React.SetStateAction<PathInterface>>,
    processIdxRef: React.MutableRefObject<ProcessIdxInterface>,
    searchSpeed: React.MutableRefObject<any>,
    algoType: AlgoTypes
  ) {
    PathControllerHelper.searchAlgorithm(
      graph,
      path,
      setPath,
      processIdxRef,
      (array: number[][]) => array.pop(),
      searchSpeed,
      algoType
    );
  }

  /**
   * Executes a Dijkstra-search on the current graph.
   *
   * @param graph Current graph state object
   * @param path Current path state object
   * @param setPath Paths set-state function
   * @param processIdxRef Process index reference object
   * @param searchSpeed Current search speed setting
   * @param algoType Current algorithm (for history)
   * @param processAll If true, search continues after path found
   * (should be false for normal processing)
   */
  static async dijkstra(
    graph: GraphInterface,
    path: PathInterface,
    setPath: React.Dispatch<React.SetStateAction<PathInterface>>,
    processIdxRef: React.MutableRefObject<ProcessIdxInterface>,
    searchSpeed: React.MutableRefObject<any>,
    algoType: AlgoTypes,
    processAll = false
  ) {
    PathControllerHelper.aStarAlgorithm(
      graph,
      path,
      setPath,
      processIdxRef,
      () => 0,
      searchSpeed,
      algoType,
      processAll
    );
  }

  /**
   * Executes a A*-search on the current graph with Manhatten-heuristic.
   *
   * @param graph Current graph state object
   * @param path Current path state object
   * @param setPath Paths set-state function
   * @param processIdxRef Process index reference object
   * @param searchSpeed Current search speed setting
   * @param algoType Current algorithm (for history)
   * @param processAll If true, search continues after path found
   * (should be false for normal processing)
   */
  static async aStarManhatten(
    graph: GraphInterface,
    path: PathInterface,
    setPath: React.Dispatch<React.SetStateAction<PathInterface>>,
    processIdxRef: React.MutableRefObject<ProcessIdxInterface>,
    searchSpeed: React.MutableRefObject<any>,
    algoType: AlgoTypes,
    processAll = false
  ) {
    PathControllerHelper.aStarAlgorithm(
      graph,
      path,
      setPath,
      processIdxRef,
      PathControllerHelper.manhattenDistance,
      searchSpeed,
      algoType,
      processAll
    );
  }

  /**
   * Executes a A*-search on the current graph with Euclidean-heuristic.
   *
   * @param graph Current graph state object
   * @param path Current path state object
   * @param setPath Paths set-state function
   * @param processIdxRef Process index reference object
   * @param searchSpeed Current search speed setting
   * @param algoType Current algorithm (for history)
   * @param processAll If true, search continues after path found
   * (should be false for normal processing)
   */
  static async aStarEuclidean(
    graph: GraphInterface,
    path: PathInterface,
    setPath: React.Dispatch<React.SetStateAction<PathInterface>>,
    processIdxRef: React.MutableRefObject<ProcessIdxInterface>,
    searchSpeed: React.MutableRefObject<any>,
    algoType: AlgoTypes,
    processAll = false
  ) {
    PathControllerHelper.aStarAlgorithm(
      graph,
      path,
      setPath,
      processIdxRef,
      (pos1, pos2) => pos1.distanceTo(pos2),
      searchSpeed,
      algoType,
      processAll
    );
  }
}

/**
 * Helper class for common search algorithm functionalities.
 */
class PathControllerHelper {
  /**
   * Common search algorithm for BFS and DFS which differs only in the specified {@link arrayOperation}.
   *
   * @param graph Current graph state object
   * @param path Current path state object
   * @param setPath Paths set-state function
   * @param processIdxRef Process index reference object
   * @param arrayOperation Operation on the node array to select the next node
   * @param searchSpeed Current search speed setting
   * @param algoType Current algorithm (for history)
   * @returns
   */
  static async searchAlgorithm(
    graph: GraphInterface,
    path: PathInterface,
    setPath: React.Dispatch<React.SetStateAction<PathInterface>>,
    processIdxRef: React.MutableRefObject<ProcessIdxInterface>,
    arrayOperation: (array: any) => number[] | undefined,
    searchSpeed: React.MutableRefObject<any>,
    algoType: AlgoTypes
  ) {
    const newPath = { ...path };
    newPath.state = PathSearchStates.Searching;
    const startSearchIdx = processIdxRef.current.pathIdx;
    const startNodeIdx = graph.state.startNode;
    const endNodeIdx = graph.state.endNode;

    if (!startNodeIdx || !endNodeIdx || Object.keys(graph).length < 1)
      return []; // nothing to process

    const visitedNodes = new Set<number>();

    const nodesArray: number[][] = [[startNodeIdx]];

    // loop over nodes (stop if new process was started)
    while (
      nodesArray.length > 0 &&
      startSearchIdx === processIdxRef.current.pathIdx
    ) {
      const currentNode = arrayOperation(nodesArray);
      if (!currentNode || !currentNode[0] || visitedNodes.has(currentNode[0])) {
        continue; // node has no edges or already visited
      } else {
        visitedNodes.add(currentNode[0]);
        newPath.visitedNodesCounter++;
        if (currentNode[0] == endNodeIdx) {
          // found path and stop processing
          return setPath({
            ...newPath,
            state: PathSearchStates.Finalized,
            found: true,
            nodes: currentNode,
            history: [
              {
                algo: algoType,
                visitedNodes: newPath.visitedNodesCounter,
                isCurrent: true,
              },
              ...newPath.history
                .filter((ele) => ele.algo != algoType)
                .map((ele) => {
                  return { ...ele, isCurrent: false };
                }),
            ],
          });
        } else {
          // set path and continue processing
          setPath({
            ...newPath,
            found: false,
            nodes: currentNode,
          });
        }
        const currentNodeEdges = graph.nodes[currentNode[0]].edges;
        if (currentNodeEdges) {
          currentNodeEdges.forEach((edge) => {
            nodesArray.push([edge, ...currentNode]);
          });
        }

        // slow execution down, based on search speed setting
        const sleeptime =
          CONSTANTS.baseSleepDuration * (1 - searchSpeed.current / 100);
        await sleep(sleeptime);
      }
    }
  }

  /**
   * Common search algorithm for Dijkstra and A* which differs only in the specified {@link heuristicFunction}.
   *
   * @param graph Current graph state object
   * @param path Current path state object
   * @param setPath Paths set-state function
   * @param processIdxRef Process index reference object
   * @param heuristicFunction Operation used to calculate the heuristics value
   * @param searchSpeed Current search speed setting
   * @param algoType Current algorithm (for history)
   * @param processAll If true, search continues after path found
   * (should be false for normal processing)
   * @returns
   */
  static async aStarAlgorithm(
    graph: GraphInterface,
    path: PathInterface,
    setPath: React.Dispatch<React.SetStateAction<PathInterface>>,
    processIdxRef: React.MutableRefObject<ProcessIdxInterface>,
    heuristicFunction: (pos1: LatLng, pos2: LatLng) => number,
    searchSpeed: React.MutableRefObject<any>,
    algoType: AlgoTypes,
    processAll = false
  ) {
    const newPath = { ...path, state: PathSearchStates.Searching };
    const startSearchIdx = processIdxRef.current.pathIdx;
    const startNodeIdx = graph.state.startNode;
    const endNodeIdx = graph.state.endNode;

    if (!startNodeIdx || !endNodeIdx || Object.keys(graph).length < 1)
      return []; // nothing to process

    const sleepTime =
      CONSTANTS.baseSleepDuration * (1 - searchSpeed.current / 100);

    // initialize collection for unvisited nodes
    const unvisitedNodes: { [idx: number]: AStarNodeInterface } = {};
    Object.keys(graph.nodes).forEach((key) => {
      const currNode: AStarNodeInterface = {
        ...graph.nodes[key],
        parentNodes: [],
        distanceFromStart:
          Number(key) === startNodeIdx ? 0 : Number.MAX_SAFE_INTEGER,
        combinedDistanceFromStart:
          Number(key) === startNodeIdx ? 0 : Number.MAX_SAFE_INTEGER,
      };
      unvisitedNodes[key] = currNode;
    });

    // initialize collection for visited nodes
    const visitedNodes: { [idx: number]: AStarNodeInterface } = {};

    // loop over nodes
    while (Object.keys(unvisitedNodes).length > 0) {
      // find next node based on heuristic values
      // TODO: tie breaking rule
      const nextNodeKey = Object.keys(unvisitedNodes).sort(
        (nodeA, nodeB) =>
          unvisitedNodes[nodeA].combinedDistanceFromStart -
          unvisitedNodes[nodeB].combinedDistanceFromStart
      )[0];

      const nextNode: AStarNodeInterface = unvisitedNodes[nextNodeKey];

      // calculate heuristic values for all edges
      nextNode?.edges?.forEach((edgeIdx) => {
        if (!unvisitedNodes[edgeIdx]) return;
        const distToNext =
          nextNode.distanceFromStart +
          nextNode.location.distanceTo(graph.nodes[edgeIdx].location);

        const heuristicValue = heuristicFunction(
          graph.nodes[edgeIdx].location,
          graph.nodes[endNodeIdx].location
        );

        const combinedValue = distToNext + heuristicValue;
        const currCombinedDistFromStart =
          unvisitedNodes[edgeIdx].combinedDistanceFromStart;
        if (combinedValue < currCombinedDistFromStart) {
          unvisitedNodes[edgeIdx].distanceFromStart = distToNext;
          unvisitedNodes[edgeIdx].combinedDistanceFromStart = combinedValue;
          unvisitedNodes[edgeIdx].parentNodes = [
            ...nextNode.parentNodes,
            Number(nextNodeKey),
          ];
        }
      });

      // move node from unvisited to visited collection
      visitedNodes[nextNodeKey] = nextNode;
      delete unvisitedNodes[nextNodeKey];

      newPath.found = Number(nextNodeKey) === endNodeIdx;
      newPath.nodes = [...nextNode.parentNodes, Number(nextNodeKey)];

      newPath.visitedNodesCounter++;

      // continue processing or stop if found
      if (newPath.found && !processAll) {
        Object.keys(unvisitedNodes).forEach(
          (key) => delete unvisitedNodes[key]
        );
      } else {
        await sleep(sleepTime); // slow execution down
        if (startSearchIdx != processIdxRef.current.pathIdx) return;
        setPath({
          ...newPath,
        });
      }
    }

    // set result of path search
    if (visitedNodes[endNodeIdx].parentNodes[0] === startNodeIdx) {
      newPath.nodes = [...visitedNodes[endNodeIdx].parentNodes, endNodeIdx];
      newPath.found = true;
    } else {
      newPath.nodes = [];
      newPath.found = false;
    }

    await sleep(sleepTime); // slow execution down
    if (startSearchIdx != processIdxRef.current.pathIdx) return;
    setPath({
      ...newPath,
      state: PathSearchStates.Finalized,
      history: [
        {
          algo: algoType,
          visitedNodes: newPath.visitedNodesCounter,
          isCurrent: true,
        },
        ...newPath.history
          .filter((ele) => ele.algo != algoType)
          .map((ele) => {
            return { ...ele, isCurrent: false };
          }),
      ],
    });
  }

  /**
   * Calculates the Manhatten-distance between to locations.
   * @param loc1 The first location
   * @param loc2 The second location
   * @returns Manhatten distance
   */
  static manhattenDistance = (loc1: LatLng, loc2: LatLng) => {
    // use haversine formula for earth's spherical coordinates
    const haversine = (l1: number, l2: number) => {
      const R = 6371000; // earth radius
      const d = Math.abs(l1 - l2);
      const a = Math.pow(Math.sin(d / 2), 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const dist = R * c;
      return dist;
    };

    return (
      Math.abs(haversine(loc1.lat, loc2.lat)) +
      Math.abs(haversine(loc1.lng, loc2.lng))
    );
  };
}
