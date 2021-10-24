import { LatLng } from 'leaflet';
import { GraphInterface, NodeInterface } from '../interfaces/interfaces';

let nodeIndex = 0;

const Graph = function ([graph, setGraph]: [GraphInterface, any]) {
  return {
    addNode(node: NodeInterface) {
      nodeIndex++;
      const newGraph = { ...graph };
      if (newGraph.state.activeNode !== undefined) {
        const prevNode = newGraph.nodes[newGraph.state.activeNode];
        if (!prevNode.edges) prevNode.edges = new Set();
        prevNode.edges.add(nodeIndex.toString());
        newGraph.nodes[newGraph.state.activeNode] = prevNode; //todo
      }
      newGraph.nodes[nodeIndex] = node;
      newGraph.state.activeNode = nodeIndex.toString();
      setGraph(newGraph);
    },
    getNodesIdx() {
      return Object.keys(graph.nodes);
    },
    getNode(idx: string) {
      return graph.nodes[idx];
    },
    setNodePosition(idx: string, latlng: LatLng) {
      setGraph({
        ...graph,
        nodes: {
          ...graph.nodes,
          [idx]: { ...graph.nodes[idx], position: latlng },
        },
      });
    },
    getGraph() {
      return graph;
    },
    setActiveNode(idx: string) {
      if (idx && graph.nodes[idx]) {
        setGraph({
          ...graph,
          state: { ...(graph.state ?? {}), activeNode: idx },
        });
      }
    },
    setStartNode(idx: string) {
      if (idx && graph.nodes[idx]) {
        setGraph({
          ...graph,
          state: {
            ...(graph.state ?? {}),
            startNode: idx,
            endNode:
              graph.state.endNode != idx ? graph.state.endNode : undefined,
          },
        });
      }
    },
    setEndNode(idx: string) {
      if (idx && graph.nodes[idx]) {
        setGraph({
          ...graph,
          state: {
            ...(graph.state ?? {}),
            endNode: idx,
            startNode:
              graph.state.startNode != idx ? graph.state.startNode : undefined,
          },
        });
      }
    },
    getActiveNode() {
      return graph.state?.activeNode ?? false;
    },
    getStartNode() {
      return graph.state?.startNode ?? false;
    },
    getEndNode() {
      return graph.state?.endNode ?? false;
    },
  };
};

export default Graph;
