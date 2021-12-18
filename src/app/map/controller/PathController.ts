import {
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

  static djikstra(
    graph: GraphInterface,
    path: PathInterface,
    setPath: React.Dispatch<React.SetStateAction<PathInterface>>,
    processIdxRef: React.MutableRefObject<ProcessIdxInterface>
  ) {
    interface DijkstraNodeInterface extends NodeInterface {
      distanceFromStart: number;
      parentNode: number;
    }
    const newPath = { ...path };
    newPath.state = PathSearchStates.Searching;
    setPath(newPath);
    const startSearchIdx = processIdxRef.current.pathIdx; //TODO implement termination and timeout
    const startNodeIdx = graph.state.startNode;
    const endNodeIdx = graph.state.endNode;
    if (!startNodeIdx || !endNodeIdx || Object.keys(graph).length < 1)
      return [];

    const unvisitedNodes: { [idx: number]: DijkstraNodeInterface } = {};
    Object.keys(graph.nodes).forEach((key) => {
      const dijkstraNode: DijkstraNodeInterface = {
        ...graph.nodes[key],
        parentNode: Number(key),
        distanceFromStart:
          Number(key) === startNodeIdx ? 0 : Number.MAX_SAFE_INTEGER,
      };
      unvisitedNodes[key] = dijkstraNode;
    });
    const visitedNodes: { [idx: number]: DijkstraNodeInterface } = {};

    const totalNodes = Object.keys(graph.nodes).length;
    while (Object.keys(visitedNodes).length < totalNodes) {
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
          unvisitedNodes[edgeIdx].parentNode = Number(nextNodeKey);
        }
      });

      visitedNodes[nextNodeKey] = nextNode;
      delete unvisitedNodes[nextNodeKey];
    }

    if (visitedNodes[endNodeIdx].distanceFromStart < Number.MAX_SAFE_INTEGER) {
      let currNode = endNodeIdx;
      const pathNodes = [];

      while (currNode != startNodeIdx) {
        pathNodes.unshift(currNode);
        currNode = visitedNodes[currNode].parentNode;
      }
      pathNodes.unshift(startNodeIdx);
      newPath.found = true;
      newPath.nodes = pathNodes;
    } else {
      newPath.found = false;
    }
    newPath.state = PathSearchStates.Finalized;
    setPath(newPath);
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
