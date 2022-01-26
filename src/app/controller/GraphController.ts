import { LatLng } from 'leaflet';
import { GraphInterface, NodeInterface } from '../../interfaces/Interfaces';

/** Provides program logic to query and manipulate the graph state. */
export default class GraphController {
  /**
   * Adds a node to the graph.
   * @param node Node object to be added
   * @param graph Current graph state object
   * @param setGraph Graphs set-state function
   * @param connect Specifies if the new node gets connected to the previously selected
   * @returns
   */
  static addNode(
    node: NodeInterface,
    graph: GraphInterface,
    setGraph: React.Dispatch<React.SetStateAction<GraphInterface>>,
    connect = true
  ) {
    const newGraph = { ...graph };

    const nextNodeIdx = newGraph.nodeIndexer + 1;
    const prevNodeIdx = newGraph.state.activeNode;
    if (connect && prevNodeIdx) {
      const prevNode = newGraph.nodes[prevNodeIdx];
      prevNode.edges = prevNode.edges ?? new Set();
      prevNode.edges.add(nextNodeIdx);
      newGraph.nodes[prevNodeIdx] = prevNode;
      node.edges = node.edges ?? new Set();
      node.edges?.add(prevNodeIdx);
    }
    newGraph.nodes[nextNodeIdx] = node;
    newGraph.state.prevActiveNode = newGraph.state.activeNode;
    newGraph.state.activeNode = nextNodeIdx;
    newGraph.nodeIndexer++;
    newGraph.state.updated = true;
    setGraph(newGraph);
    return newGraph;
  }

  /**
   * Removes a node from the graph.
   * @param idx Node index that needs to be removed
   * @param graph Current graph state object
   * @param setGraph Graphs set-state function
   * @returns Updated graph state object
   */
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
    return newGraph;
  }

  /**
   * Provides all node index values as array.
   * @param graph Current graph state object
   * @returns Array of index values
   */
  static getNodesIdx(graph: GraphInterface) {
    return Object.keys(graph.nodes).map((key) => Number(key));
  }

  /**
   * Provides the object for the given node index.
   * @param idx Node index
   * @param graph Current graph state object
   * @returns
   */
  static getNode(idx: number, graph: GraphInterface) {
    return graph.nodes[idx];
  }

  /**
   * Set's the location parameter for the specified node index.
   * @param idx Node index that get's the new location assigned
   * @param latlng Location object with latitude and longitude
   * @param graph Current graph state object
   * @param setGraph Graphs set-state function
   */
  static setNodeLocation(
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
        [idx]: { ...newGraph.nodes[idx], location: latlng },
      },
    });
  }

  /**
   * Set's the specified node index as currently active node in the graph state.
   * @param idx Node index that becomes the active node
   * @param graph Current graph state object
   * @param setGraph Graphs set-state function
   */
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

  /**
   * Set's the specified node index as start node in the graph state.
   * @param idx Node index that becomes the start node
   * @param graph Current graph state object
   * @param setGraph Graphs set-state function
   */
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

  /**
   * Set's the specified node index as end node in the graph state.
   * @param idx Node index that becomes the end node
   * @param graph Current graph state object
   * @param setGraph Graphs set-state function
   */
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

  /**
   * Creates edges between all provided {@link nodePairs}.
   * @param nodePairs Array of node pairs that need to be connected
   * @param graph Current graph state object
   * @param setGraph Graphs set-state function
   * @returns Updated graph state object
   */
  static connectNodes(
    nodePairs: [number, number][],
    graph: GraphInterface,
    setGraph: React.Dispatch<React.SetStateAction<GraphInterface>>
  ) {
    const newGraph = { ...graph };
    nodePairs.forEach((nodePair) => {
      const fromNodeIdx = nodePair[0];
      const toNodeIdx = nodePair[1];

      if (fromNodeIdx !== toNodeIdx) {
        const prevNode = newGraph.nodes[fromNodeIdx];
        const currNode = newGraph.nodes[toNodeIdx];
        if (prevNode && currNode) {
          prevNode.edges = prevNode.edges ?? new Set();
          currNode.edges = currNode.edges ?? new Set();
          prevNode.edges.add(toNodeIdx);
          currNode.edges.add(fromNodeIdx);
          newGraph.nodes[fromNodeIdx] = prevNode;
          newGraph.nodes[toNodeIdx] = currNode;
          newGraph.state.updated = true;
        }
      }
    });
    if (newGraph.state.updated) setGraph(newGraph);
    return newGraph;
  }

  /**
   * Creates an edge between the current and the previously selected nodes.
   * @param graph Current graph state object
   * @param setGraph Graphs set-state function
   */
  static connectSelectedNodes(
    graph: GraphInterface,
    setGraph: React.Dispatch<React.SetStateAction<GraphInterface>>
  ) {
    const prevNodeIdx = graph.state.prevActiveNode;
    const currNodeIdx = graph.state.activeNode;
    if (prevNodeIdx && currNodeIdx)
      this.connectNodes([[prevNodeIdx, currNodeIdx]], graph, setGraph);
  }

  /**
   * Removes an edge from the graph.
   * @param fromNodeIdx First node index - interchangeable with {@link toNodeIdx}
   * @param toNodeIdx Second node index - interchangeable with {@link fromNodeIdx}
   * @param graph Current graph state object
   * @param setGraph Graphs set-state function
   */
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

/** Helper class for the {@link GraphController} */
class GraphControllerHelper {
  /**
   * Removes the specified node index from all possible graph states.
   * @param nodeIdx Node index that needs to be removed
   * @param newGraph New graph state object
   */
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
