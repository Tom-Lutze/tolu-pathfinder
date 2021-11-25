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
  static searchAlgorithm = (
    graph: GraphInterface,
    pathRef: React.MutableRefObject<PathInterface>,
    setPath: React.Dispatch<React.SetStateAction<PathInterface>>,
    arrayOperation: (array: any) => number[] | undefined
  ) => {
    const startSearchIdx = pathRef.current.searchIdx;
    const startNodeIdx = graph.state.startNode;
    const endNodeIdx = graph.state.endNode;
    if (!startNodeIdx || !endNodeIdx || Object.keys(graph).length < 1)
      return [];
    const visitedNodes = new Set<number>();
    const loop = async (stack: number[][]) => {
      if (stack.length > 0 && startSearchIdx === pathRef.current.searchIdx) {
        const queueNode = arrayOperation(stack);
        if (!queueNode || !queueNode[0] || visitedNodes.has(queueNode[0])) {
          loop(stack);
        } else {
          setPath({
            ...pathRef.current,
            found: false,
            nodes: queueNode,
          });
          visitedNodes.add(queueNode[0]);
          if (queueNode[0] == endNodeIdx) {
            return setPath({
              ...pathRef.current,
              found: true,
              nodes: queueNode,
            });
          }
          const queueNodeEdges = graph.nodes[queueNode[0]].edges;
          if (queueNodeEdges) {
            queueNodeEdges.forEach((edge) => {
              stack.push([edge, ...queueNode]);
            });
          }
          await sleep(1000);
          loop(stack);
        }
      }
    };
    let stack = [[startNodeIdx]];
    loop(stack);
  };
}
