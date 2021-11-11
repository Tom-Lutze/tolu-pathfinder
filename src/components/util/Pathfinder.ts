import { LatLng } from 'leaflet';
import { GraphInterface } from '../interfaces/interfaces';

export const Pathfinder = function (graph: GraphInterface) {
  return {
    bfs() {
      const startNodeIdx = graph.state.startNode;
      const endNodeIdx = graph.state.endNode;
      if (!startNodeIdx || endNodeIdx || Object.keys(graph.nodes).length < 1)
        return [];
      const visitedNodes = new Set<string>();
      let queue = [[startNodeIdx]];
      while (queue.length > 0) {
        const queueNode = queue.shift();
        if (!queueNode || !queueNode[0] || visitedNodes.has(queueNode[0])) {
          continue;
        }
        visitedNodes.add(queueNode[0]);
        if (queueNode[0] == endNodeIdx) {
          return queueNode;
        }
        const queueNodeEdges = graph.nodes[queueNode[0]].edges;
        if (queueNodeEdges) {
          queueNodeEdges.forEach((edge) => {
            queue.push([edge, ...queueNode]);
          });
        }
      }
      return [];
    },
  };
};
