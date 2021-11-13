import { GraphInterface } from '../../interfaces/interfaces';
import { sleep } from '../../utils/Helper';

export const Pathfinder = function (mapGraph: any) {
  const graph: GraphInterface = mapGraph.getGraph();
  return {
    bfs() {
      const startNodeIdx = graph.state.startNode;
      const endNodeIdx = graph.state.endNode;
      if (!startNodeIdx || !endNodeIdx || Object.keys(graph.nodes).length < 1)
        return [];
      const visitedNodes = new Set<number>();
      const loop = async (queue: number[][]) => {
        if (queue.length > 0) {
          const queueNode = queue.shift();
          if (!queueNode || !queueNode[0] || visitedNodes.has(queueNode[0])) {
            loop(queue);
          } else {
            mapGraph.setSearchPath(queueNode);
            visitedNodes.add(queueNode[0]);
            if (queueNode[0] == endNodeIdx) {
              return mapGraph.setFoundPath(queueNode);
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
    },
  };
};
