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
    retracePath(
      parentNodes: { [parent: string]: string },
      start: string,
      end: string
    ) {
      let currentNode = end;
      const path = [];
      while (currentNode != start) {
        if (currentNode === undefined) return [];
        path.push(currentNode);
        currentNode = parentNodes[currentNode];
      }
      path.push(start);
      return path.reverse();
    },
    bfs() {
      if (!this.checkRequirements()) return [];
      const parentNodes: { [parent: string]: string } = {};
      const startNodeIdx = graph.state.startNode;
      const endNodeIdx = graph.state.endNode;
      let queue = [startNodeIdx];
      while (queue.length > 0) {
        const current = queue.shift();
        if (!current) {
          continue;
        }
        if (current == endNodeIdx && startNodeIdx != undefined) {
          // found path
          return this.retracePath(parentNodes, startNodeIdx, endNodeIdx);
        }
        const currentEdges = graph.nodes[current].edges;
        if (currentEdges) {
          const currentEdgesArr = Array.from(currentEdges);
          queue = queue.concat(currentEdgesArr);
          currentEdgesArr.forEach((node) => (parentNodes[node] = current));
        }
      }
      return [];
    },
  };
};
