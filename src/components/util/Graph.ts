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
      newGraph.state.prevActiveNode = newGraph.state.activeNode;
      newGraph.state.activeNode = nodeIndex.toString();
      setGraph(newGraph);
    },
    removeNode(idx: string) {
      const newGraph = { ...graph };
      newGraph.nodes = Object.keys(newGraph.nodes).reduce(
        (prevNodes: any, currIdx: string) => {
          if (currIdx !== idx) {
            const newNode = newGraph.nodes[currIdx];
            if (newNode.edges?.has(idx)) {
              newNode.edges.delete(idx);
            }
            prevNodes[currIdx] = newNode;
          }
          return prevNodes;
        },
        {}
      );
      if (newGraph.state.activeNode === idx) {
        newGraph.state.activeNode = undefined;
      }
      if (newGraph.state.prevActiveNode === idx) {
        newGraph.state.prevActiveNode = undefined;
      }
      if (newGraph.state.startNode === idx) {
        newGraph.state.startNode = undefined;
      }
      if (newGraph.state.endNode === idx) {
        newGraph.state.endNode = undefined;
      }
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
          state: {
            ...(graph.state ?? {}),
            activeNode: idx,
            prevActiveNode: graph.state.activeNode,
          },
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
    connectNodes() {
      if (
        graph.state.activeNode &&
        graph.state.prevActiveNode &&
        graph.state.activeNode !== graph.state.prevActiveNode
      ) {
        const newGraph = { ...graph };
        const newNode = newGraph.nodes[graph.state.prevActiveNode];
        if (!newNode.edges) {
          newNode.edges = new Set();
        }
        newNode.edges.add(graph.state.activeNode);
        newGraph.nodes[graph.state.prevActiveNode] = newNode;
        setGraph(newGraph);
      }
    },
    getActiveNode() {
      return graph.state?.activeNode ?? false;
    },
    getPrevActiveNode() {
      return graph.state?.prevActiveNode ?? false;
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
