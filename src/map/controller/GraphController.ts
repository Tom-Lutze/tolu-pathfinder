import { LatLng } from 'leaflet';
import { GraphInterface, NodeInterface } from '../../interfaces/interfaces';
export default class GraphController {
  static addNode(
    node: NodeInterface,
    graph: GraphInterface,
    setGraph: React.Dispatch<React.SetStateAction<GraphInterface>>
  ) {
    const newGraph = { ...graph };
    newGraph.count = newGraph.count + 1;

    const prevNodeIdx = newGraph.state.activeNode;
    if (prevNodeIdx) {
      const prevNode = newGraph.nodes[prevNodeIdx];
      prevNode.edges = prevNode.edges ?? new Set();
      prevNode.edges.add(newGraph.count);
      newGraph.nodes[prevNodeIdx] = prevNode;
      node.edges = node.edges ?? new Set();
      node.edges?.add(prevNodeIdx);
    }
    newGraph.nodes[newGraph.count] = node;
    newGraph.state.prevActiveNode = newGraph.state.activeNode;
    newGraph.state.activeNode = newGraph.count;
    newGraph.state.updated = true;
    setGraph(newGraph);
  }

  static removeNode(
    idx: number,
    graph: GraphInterface,
    setGraph: React.Dispatch<React.SetStateAction<GraphInterface>>
  ) {
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
    GraphControllerHelper.removeNodeFromState(idx, newGraph);
    newGraph.state.updated = true;
    setGraph(newGraph);
  }

  static getNodesIdx(graph: GraphInterface) {
    return Object.keys(graph.nodes).map((key) => Number(key));
  }

  static getNode(idx: number, graph: GraphInterface) {
    return graph.nodes[idx];
  }

  static setNodePosition(
    idx: number,
    latlng: LatLng,
    graph: GraphInterface,
    setGraph: React.Dispatch<React.SetStateAction<GraphInterface>>
  ) {
    const newGraph = { ...graph };
    newGraph.state.updated = true;
    setGraph({
      ...newGraph,
      nodes: {
        ...newGraph.nodes,
        [idx]: { ...newGraph.nodes[idx], position: latlng },
      },
    });
  }

  static setActiveNode(
    idx: number,
    graph: GraphInterface,
    setGraph: React.Dispatch<React.SetStateAction<GraphInterface>>
  ) {
    if (idx && graph.nodes[idx]) {
      const newGraph = { ...graph };

      setGraph({
        ...newGraph,
        state: {
          ...(graph.state ?? {}),
          activeNode: idx,
          prevActiveNode: newGraph.state.activeNode,
        },
      });
    }
  }

  static setStartNode(
    idx: number,
    graph: GraphInterface,
    setGraph: React.Dispatch<React.SetStateAction<GraphInterface>>
  ) {
    if (idx && graph.nodes[idx]) {
      const newGraph = { ...graph };
      newGraph.state.updated = true;
      setGraph({
        ...newGraph,
        state: {
          ...(graph.state ?? {}),
          startNode: idx,
          endNode:
            newGraph.state.endNode != idx ? newGraph.state.endNode : undefined,
        },
      });
    }
  }

  static setEndNode(
    idx: number,
    graph: GraphInterface,
    setGraph: React.Dispatch<React.SetStateAction<GraphInterface>>
  ) {
    if (idx && graph.nodes[idx]) {
      const newGraph = { ...graph };
      newGraph.state.updated = true;
      setGraph({
        ...newGraph,
        state: {
          ...(graph.state ?? {}),
          endNode: idx,
          startNode:
            newGraph.state.startNode != idx
              ? newGraph.state.startNode
              : undefined,
        },
      });
    }
  }

  static connectNodes(
    graph: GraphInterface,
    setGraph: React.Dispatch<React.SetStateAction<GraphInterface>>
  ) {
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
      newGraph.state.updated = true;
      setGraph(newGraph);
    }
  }

  static disconnectNodes(
    fromNodeIdx: number,
    toNodeIdx: number,
    graph: GraphInterface,
    setGraph: React.Dispatch<React.SetStateAction<GraphInterface>>
  ) {
    const newGraph = { ...graph };
    Object.keys(newGraph.nodes).forEach((key) => {
      const currentIdx = Number(key);
      const currentNode = newGraph.nodes[currentIdx];
      let found = false;
      if (currentIdx === toNodeIdx && currentNode.edges?.has(fromNodeIdx)) {
        found = true;
        currentNode.edges.delete(fromNodeIdx);
      }
      if (currentIdx === fromNodeIdx && currentNode.edges?.has(toNodeIdx)) {
        found = true;
        currentNode.edges.delete(toNodeIdx);
      }
      if (found) newGraph.nodes[currentIdx] = currentNode;
    });
    newGraph.state.updated = true;
    setGraph(newGraph);
  }
}

class GraphControllerHelper {
  static removeNodeFromState(nodeIdx: number, newGraph: GraphInterface) {
    if (newGraph.state.activeNode === nodeIdx) {
      newGraph.state.activeNode = undefined;
    }
    if (newGraph.state.prevActiveNode === nodeIdx) {
      newGraph.state.prevActiveNode = undefined;
    }
    if (newGraph.state.startNode === nodeIdx) {
      newGraph.state.startNode = undefined;
    }
    if (newGraph.state.endNode === nodeIdx) {
      newGraph.state.endNode = undefined;
    }
  }
}
