import { LatLng } from 'leaflet';
import { GraphInterface, NodeInterface } from '../../interfaces/interfaces';

let nodeIndex = 0;

class GraphController {
  graph: GraphInterface;
  setGraph: React.Dispatch<React.SetStateAction<GraphInterface>>;
  constructor(
    graph: GraphInterface,
    setGraph: React.Dispatch<React.SetStateAction<GraphInterface>>
  ) {
    this.graph = graph;
    this.setGraph = setGraph;
  }

  addNode(node: NodeInterface) {
    nodeIndex++;
    const newGraph = { ...this.graph };
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
    this.setGraph(newGraph);
  }

  removeNode(idx: number) {
    const newGraph = { ...this.graph };
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
    this.setGraph(newGraph);
  }

  getNodesIdx() {
    return Object.keys(this.graph.nodes).map((key) => Number(key));
  }

  getNode(idx: number) {
    return this.graph.nodes[idx];
  }

  setNodePosition(idx: number, latlng: LatLng) {
    this.setGraph({
      ...this.graph,
      nodes: {
        ...this.graph.nodes,
        [idx]: { ...this.graph.nodes[idx], position: latlng },
      },
    });
  }

  getGraph() {
    return this.graph;
  }

  setActiveNode(idx: number) {
    if (idx && this.graph.nodes[idx]) {
      this.setGraph({
        ...this.graph,
        state: {
          ...(this.graph.state ?? {}),
          activeNode: idx,
          prevActiveNode: this.graph.state.activeNode,
        },
      });
    }
  }

  setStartNode(idx: number) {
    if (idx && this.graph.nodes[idx]) {
      this.setGraph({
        ...this.graph,
        state: {
          ...(this.graph.state ?? {}),
          startNode: idx,
          endNode:
            this.graph.state.endNode != idx
              ? this.graph.state.endNode
              : undefined,
        },
      });
    }
  }

  setEndNode(idx: number) {
    if (idx && this.graph.nodes[idx]) {
      this.setGraph({
        ...this.graph,
        state: {
          ...(this.graph.state ?? {}),
          endNode: idx,
          startNode:
            this.graph.state.startNode != idx
              ? this.graph.state.startNode
              : undefined,
        },
      });
    }
  }

  connectNodes() {
    const prevNodeIdx = this.graph.state.prevActiveNode;
    const currNodeIdx = this.graph.state.activeNode;
    if (prevNodeIdx && currNodeIdx && prevNodeIdx !== currNodeIdx) {
      const newGraph = { ...this.graph };
      const prevNode = newGraph.nodes[prevNodeIdx];
      const currNode = newGraph.nodes[currNodeIdx];
      prevNode.edges = prevNode.edges ?? new Set();
      currNode.edges = currNode.edges ?? new Set();
      prevNode.edges.add(currNodeIdx);
      currNode.edges.add(prevNodeIdx);
      newGraph.nodes[prevNodeIdx] = prevNode;
      newGraph.nodes[currNodeIdx] = currNode;
      this.setGraph(newGraph);
    }
  }

  getActiveNode() {
    return this.graph.state?.activeNode ?? false;
  }

  getPrevActiveNode() {
    return this.graph.state?.prevActiveNode ?? false;
  }

  getStartNode() {
    return this.graph.state?.startNode ?? false;
  }

  getEndNode() {
    return this.graph.state?.endNode ?? false;
  }

  setSearchPath(searchPath: number[]) {
    this.setGraph({
      ...this.graph,
      path: {
        ...this.graph.path,
        foundPath: [],
        searchPath: searchPath,
      },
    });
  }

  setFoundPath(foundPath: number[]) {
    this.setGraph({
      ...this.graph,
      path: {
        ...this.graph.path,
        searchPath: [],
        foundPath: foundPath,
      },
    });
  }
}

export default GraphController;
