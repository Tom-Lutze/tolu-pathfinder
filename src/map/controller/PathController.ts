import { GraphInterface, PathInterface } from '../../interfaces/interfaces';
import { sleep } from '../../utils/Helper';

export default class PathController {
  static bfs(
    graph: GraphInterface,
    pathRef: React.MutableRefObject<PathInterface>,
    setPath: React.Dispatch<React.SetStateAction<PathInterface>>
  ) {
    const startSearchIdx = pathRef.current.searchIdx;
    const startNodeIdx = graph.state.startNode;
    const endNodeIdx = graph.state.endNode;
    if (!startNodeIdx || !endNodeIdx || Object.keys(graph).length < 1)
      return [];
    const visitedNodes = new Set<number>();
    const loop = async (queue: number[][]) => {
      if (queue.length > 0 && startSearchIdx === pathRef.current.searchIdx) {
        const queueNode = queue.shift();
        if (!queueNode || !queueNode[0] || visitedNodes.has(queueNode[0])) {
          loop(queue);
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
              queue.push([edge, ...queueNode]);
            });
          }
          await sleep(1000);
          loop(queue);
        }
      }
    };
    let queue = [[startNodeIdx]];
    loop(queue);
  }
}
