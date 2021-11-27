import { GraphInterface, PathInterface } from '../../interfaces/interfaces';
import { sleep } from '../../utils/Helper';

export default class PathController {
  static bfs(
    graph: GraphInterface,
    pathRef: React.MutableRefObject<PathInterface>,
    setPath: React.Dispatch<React.SetStateAction<PathInterface>>
  ) {
    PathControllerHelper.searchAlgorithm(
      graph,
      pathRef,
      setPath,
      (array: number[][]) => array.shift()
    );
  }

  static dfs(
    graph: GraphInterface,
    pathRef: React.MutableRefObject<PathInterface>,
    setPath: React.Dispatch<React.SetStateAction<PathInterface>>
  ) {
    PathControllerHelper.searchAlgorithm(
      graph,
      pathRef,
      setPath,
      (array: number[][]) => array.pop()
    );
  }
}

class PathControllerHelper {
  static searchAlgorithm(
    graph: GraphInterface,
    pathRef: React.MutableRefObject<PathInterface>,
    setPath: React.Dispatch<React.SetStateAction<PathInterface>>,
    arrayOperation: (array: any) => number[] | undefined
  ) {
    const startSearchIdx = pathRef.current.searchIdx;
    const startNodeIdx = graph.state.startNode;
    const endNodeIdx = graph.state.endNode;
    if (!startNodeIdx || !endNodeIdx || Object.keys(graph).length < 1)
      return [];
    const visitedNodes = new Set<number>();
    const loop = async (nodesArray: number[][]) => {
      if (
        nodesArray.length > 0 &&
        startSearchIdx === pathRef.current.searchIdx
      ) {
        const currentNode = arrayOperation(nodesArray);
        if (
          !currentNode ||
          !currentNode[0] ||
          visitedNodes.has(currentNode[0])
        ) {
          loop(nodesArray);
        } else {
          setPath({
            ...pathRef.current,
            found: false,
            nodes: currentNode,
          });
          visitedNodes.add(currentNode[0]);
          if (currentNode[0] == endNodeIdx) {
            return setPath({
              ...pathRef.current,
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
          loop(nodesArray);
        }
      }
    };
    loop([[startNodeIdx]]);
  }
}
