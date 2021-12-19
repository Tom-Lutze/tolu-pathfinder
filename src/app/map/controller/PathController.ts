import {
  DijkstraNodeInterface,
  GraphInterface,
  NodeInterface,
  PathInterface,
  PathSearchStates,
  ProcessIdxInterface,
} from '../../../interfaces';
import { sleep } from '../../../utils/Helper';

export default class PathController {
  static bfs(
    graph: GraphInterface,
    path: PathInterface,
    setPath: React.Dispatch<React.SetStateAction<PathInterface>>,
    processIdxRef: React.MutableRefObject<ProcessIdxInterface>
  ) {
    PathControllerHelper.searchAlgorithm(
      graph,
      path,
      setPath,
      processIdxRef,
      (array: number[][]) => array.shift()
    );
  }

  static dfs(
    graph: GraphInterface,
    path: PathInterface,
    setPath: React.Dispatch<React.SetStateAction<PathInterface>>,
    processIdxRef: React.MutableRefObject<ProcessIdxInterface>
  ) {
    PathControllerHelper.searchAlgorithm(
      graph,
      path,
      setPath,
      processIdxRef,
      (array: number[][]) => array.pop()
    );
  }

  static async dijkstra(
    graph: GraphInterface,
    path: PathInterface,
    setPath: React.Dispatch<React.SetStateAction<PathInterface>>,
    processIdxRef: React.MutableRefObject<ProcessIdxInterface>,
    processAll = false
  ) {
    const newPath = { ...path, state: PathSearchStates.Searching };
    const startSearchIdx = processIdxRef.current.pathIdx;
    const startNodeIdx = graph.state.startNode;
    const endNodeIdx = graph.state.endNode;
    if (!startNodeIdx || !endNodeIdx || Object.keys(graph).length < 1)
      return [];

    const unvisitedNodes: { [idx: number]: DijkstraNodeInterface } = {};
    Object.keys(graph.nodes).forEach((key) => {
      const dijkstraNode: DijkstraNodeInterface = {
        ...graph.nodes[key],
        parentNodes: [],
        distanceFromStart:
          Number(key) === startNodeIdx ? 0 : Number.MAX_SAFE_INTEGER,
      };
      unvisitedNodes[key] = dijkstraNode;
    });
    const visitedNodes: { [idx: number]: DijkstraNodeInterface } = {};

    while (Object.keys(unvisitedNodes).length > 0) {
      const nextNodeKey = Object.keys(unvisitedNodes).sort(
        (nodeA, nodeB) =>
          unvisitedNodes[nodeA].distanceFromStart -
          unvisitedNodes[nodeB].distanceFromStart
      )[0];

      const nextNode: DijkstraNodeInterface = unvisitedNodes[nextNodeKey];

      nextNode?.edges?.forEach((edgeIdx) => {
        if (!unvisitedNodes[edgeIdx]) return;
        const distToNext =
          nextNode.distanceFromStart +
          nextNode.position.distanceTo(graph.nodes[edgeIdx].position);
        const currDistFromStart = unvisitedNodes[edgeIdx].distanceFromStart;
        if (distToNext < currDistFromStart) {
          unvisitedNodes[edgeIdx].distanceFromStart = distToNext;
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

      if (newPath.found && !processAll) {
        Object.keys(unvisitedNodes).forEach(
          (key) => delete unvisitedNodes[key]
        );
      } else {
        await sleep(400);
        if (startSearchIdx != processIdxRef.current.pathIdx) return;
        setPath({ ...newPath });
      }
    }

    if (visitedNodes[endNodeIdx].parentNodes[0] === startNodeIdx) {
      newPath.nodes = [...visitedNodes[endNodeIdx].parentNodes, endNodeIdx];
      newPath.found = true;
    } else {
      newPath.nodes = [];
      newPath.found = false;
    }

    await sleep(400);
    if (startSearchIdx != processIdxRef.current.pathIdx) return;
    setPath({ ...newPath, state: PathSearchStates.Finalized });
  }
}

class PathControllerHelper {
  static async searchAlgorithm(
    graph: GraphInterface,
    path: PathInterface,
    setPath: React.Dispatch<React.SetStateAction<PathInterface>>,
    processIdxRef: React.MutableRefObject<ProcessIdxInterface>,
    arrayOperation: (array: any) => number[] | undefined
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
        setPath({
          ...newPath,
          found: false,
          nodes: currentNode,
        });
        visitedNodes.add(currentNode[0]);
        if (currentNode[0] == endNodeIdx) {
          return setPath({
            ...newPath,
            state: PathSearchStates.Finalized,
            found: true,
            nodes: currentNode,
          });
        }
        const currentNodeEdges = graph.nodes[currentNode[0]].edges;
        if (currentNodeEdges) {
          currentNodeEdges.forEach((edge) => {
            nodesArray.push([edge, ...currentNode]);
          });
        }
        await sleep(200);
      }
    }
  }
}
