import { LatLng } from 'leaflet';
import { GraphInterface, NodeInterface } from '../../interfaces/interfaces';

let nodeIndex = 0;

const Graph = function ([graph, setGraph]: [GraphInterface, any]) {
  return {
    addNode(node: NodeInterface) {
      nodeIndex++;
      const newGraph = { ...graph };
      const prevNodeIdx = newGraph.state.activeNode;
      if (prevNodeIdx) {
        const prevNode = newGraph.nodes[prevNodeIdx];
        prevNode.edges = prevNode.edges ?? new Set();
        prevNode.edges.add(nodeIndex);
        newGraph.nodes[prevNodeIdx] = prevNode;
        node.edges = node.edges ?? new Set();
        node.edges?.add(prevNodeIdx);
      }
      newGraph.nodes[nodeIndex] = node;
      newGraph.state.prevActiveNode = newGraph.state.activeNode;
      newGraph.state.activeNode = nodeIndex;
      setGraph(newGraph);
    },
    removeNode(idx: number) {
      const newGraph = { ...graph };
      newGraph.nodes = Object.keys(newGraph.nodes)
        .map((key) => Number(key))
        .reduce((prevNodes: any, currIdx: number) => {
          if (currIdx != idx) {
            const newNode = newGraph.nodes[currIdx];
            if (newNode.edges?.has(idx)) {
              newNode.edges.delete(idx);
            }
            prevNodes[currIdx] = newNode;
          }
          return prevNodes;
        }, {});
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
      return Object.keys(graph.nodes).map((key) => Number(key));
    },
    getNode(idx: number) {
      return graph.nodes[idx];
    },
    setNodePosition(idx: number, latlng: LatLng) {
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
    setActiveNode(idx: number) {
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
    setStartNode(idx: number) {
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
    setEndNode(idx: number) {
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
      const prevNodeIdx = graph.state.prevActiveNode;
      const currNodeIdx = graph.state.activeNode;
      if (prevNodeIdx && currNodeIdx && prevNodeIdx !== currNodeIdx) {
        const newGraph = { ...graph };
        const prevNode = newGraph.nodes[prevNodeIdx];
        const currNode = newGraph.nodes[currNodeIdx];
        prevNode.edges = prevNode.edges ?? new Set();
        currNode.edges = currNode.edges ?? new Set();
        prevNode.edges.add(currNodeIdx);
        currNode.edges.add(prevNodeIdx);
        newGraph.nodes[prevNodeIdx] = prevNode;
        newGraph.nodes[currNodeIdx] = currNode;
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
    setSearchPath(searchPath: number[]) {
      setGraph({
        ...graph,
        path: {
          ...graph.path,
          foundPath: [],
          searchPath: searchPath,
        },
      });
    },
    setFoundPath(foundPath: number[]) {
      setGraph({
        ...graph,
        path: {
          ...graph.path,
          searchPath: [],
          foundPath: foundPath,
        },
      });
    },
  };
};

export default Graph;
