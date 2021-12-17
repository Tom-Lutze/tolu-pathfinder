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
    interface DjikstraNodeInterface extends NodeInterface {
      distanceFromStart: number;
      parentNode: number | undefined;
    }
    const newPath = { ...path };
    newPath.state = PathSearchStates.Searching;
    const startSearchIdx = processIdxRef.current.pathIdx;
    const startNodeIdx = graph.state.startNode;
    const endNodeIdx = graph.state.endNode;
    if (!startNodeIdx || !endNodeIdx || Object.keys(graph).length < 1)
      return [];

    const unvisitedNodes = Object.keys(graph.nodes).map((key) => {
      const djikstraNode: DjikstraNodeInterface = {
        ...graph.nodes[key],
        distanceFromStart:
          Number(key) === startNodeIdx ? 0 : Number.MAX_SAFE_INTEGER,
      };
      return djikstraNode;
    });
    const visitedNodes: DjikstraNodeInterface[] = [];
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
