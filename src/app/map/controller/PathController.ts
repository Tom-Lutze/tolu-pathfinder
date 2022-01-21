import { LatLng } from 'leaflet';
import {
  AlgoTypes,
  AStarNodeInterface,
  GraphInterface,
  PathInterface,
  PathSearchStates,
  ProcessIdxInterface,
} from '../../../interfaces';
import { sleep } from '../../../utils/Helper';
import { APP_SETTINGS } from '../../constants/Settings';

export default class PathController {
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

class PathControllerHelper {
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
      return [];
    const visitedNodes = new Set<number>();

    const nodesArray: number[][] = [[startNodeIdx]];
    while (
      nodesArray.length > 0 &&
      startSearchIdx === processIdxRef.current.pathIdx
    ) {
      const currentNode = arrayOperation(nodesArray);
      if (!currentNode || !currentNode[0] || visitedNodes.has(currentNode[0])) {
        continue;
      } else {
        visitedNodes.add(currentNode[0]);
        newPath.visitedNodesCounter++;
        if (currentNode[0] == endNodeIdx) {
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
        const sleeptime =
          APP_SETTINGS.baseSleepDuration * (1 - searchSpeed.current / 100);
        await sleep(sleeptime);
      }
    }
  }

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
      return [];

    const sleepTime =
      APP_SETTINGS.baseSleepDuration * (1 - searchSpeed.current / 100);

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
    const visitedNodes: { [idx: number]: AStarNodeInterface } = {};

    while (Object.keys(unvisitedNodes).length > 0) {
      const nextNodeKey = Object.keys(unvisitedNodes).sort(
        (nodeA, nodeB) =>
          unvisitedNodes[nodeA].combinedDistanceFromStart -
          unvisitedNodes[nodeB].combinedDistanceFromStart
      )[0];

      const nextNode: AStarNodeInterface = unvisitedNodes[nextNodeKey];

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

      visitedNodes[nextNodeKey] = nextNode;
      delete unvisitedNodes[nextNodeKey];

      newPath.found = Number(nextNodeKey) === endNodeIdx;
      newPath.nodes = [...nextNode.parentNodes, Number(nextNodeKey)];

      newPath.visitedNodesCounter++;
      if (newPath.found && !processAll) {
        Object.keys(unvisitedNodes).forEach(
          (key) => delete unvisitedNodes[key]
        );
      } else {
        await sleep(sleepTime);
        if (startSearchIdx != processIdxRef.current.pathIdx) return;
        setPath({
          ...newPath,
        });
      }
    }

    if (visitedNodes[endNodeIdx].parentNodes[0] === startNodeIdx) {
      newPath.nodes = [...visitedNodes[endNodeIdx].parentNodes, endNodeIdx];
      newPath.found = true;
    } else {
      newPath.nodes = [];
      newPath.found = false;
    }

    await sleep(sleepTime);
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

  static manhattenDistance = (pos1: LatLng, pos2: LatLng) => {
    const haversine = (p1: number, p2: number) => {
      const R = 6371000; // earth radius
      const d = Math.abs(p1 - p2);
      const a = Math.pow(Math.sin(d / 2), 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const dist = R * c;
      return dist;
    };

    return (
      Math.abs(haversine(pos1.lat, pos2.lat)) +
      Math.abs(haversine(pos1.lng, pos2.lng))
    );
  };
}
