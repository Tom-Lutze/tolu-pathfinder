import { LatLng } from 'leaflet';
import { GraphInterface } from '../interfaces/interfaces';

export const Pathfinder = function (graph: GraphInterface) {
  return {
    checkRequirements() {
      return (
        graph.state.startNode &&
        graph.state.endNode &&
        Object.keys(graph.nodes).length > 1
      );
    },
    bfs() {
      if (!this.checkRequirements()) return false;
      const path: LatLng[] = [];
      const startNodeIdx = graph.state.startNode;
      const endNodeIdx = graph.state.endNode;
      const queue = [startNodeIdx];
      while (queue.length) {
        const current = queue.shift();
        if (!current) {
          continue;
        }
        if (current == endNodeIdx) {
          // found path
          return;
        }
        const currentEdges = graph.nodes[current].edges;
        if (currentEdges) {
          queue.concat(Array.from(currentEdges));
        }
      }
      return path;
    },
  };
};
