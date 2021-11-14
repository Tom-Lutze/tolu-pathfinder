import { LatLng } from 'leaflet';
import {
  GraphInterface,
  NodeInterface,
  GraphStateInterface,
  PathInterface,
} from '../../interfaces/interfaces';
import Pathfinder from './Pathfinder';

class GraphController {
  nodeIndex = 0;
  graph: GraphInterface;
  setGraph: React.Dispatch<React.SetStateAction<GraphInterface>>;
  graphState: GraphStateInterface;
  setGraphState: React.Dispatch<React.SetStateAction<GraphStateInterface>>;
  path: PathInterface;
  setFindPath: React.Dispatch<React.SetStateAction<boolean>>;
  constructor(
    graph: GraphInterface,
    setGraph: React.Dispatch<React.SetStateAction<GraphInterface>>,
    graphState: GraphStateInterface,
    setGraphState: React.Dispatch<React.SetStateAction<GraphStateInterface>>,
    path: PathInterface,
    setFindPath: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    this.graph = graph;
    this.setGraph = setGraph;
    this.graphState = graphState;
    this.setGraphState = setGraphState;
    this.path = path;
    this.setFindPath = setFindPath;
  }

  addNode(node: NodeInterface) {
    this.nodeIndex++;
    const newGraph = { ...this.graph };
    const newGraphState = { ...this.graphState };

    const prevNodeIdx = newGraphState.activeNode;
    if (prevNodeIdx) {
      const prevNode = newGraph[prevNodeIdx];
      prevNode.edges = prevNode.edges ?? new Set();
      prevNode.edges.add(this.nodeIndex);
      newGraph[prevNodeIdx] = prevNode;
      node.edges = node.edges ?? new Set();
      node.edges?.add(prevNodeIdx);
    }
    newGraph[this.nodeIndex] = node;
    newGraphState.prevActiveNode = newGraphState.activeNode;
    newGraphState.activeNode = this.nodeIndex;
    this.setGraph(newGraph);
    this.setGraphState(newGraphState);
  }

  removeNode(idx: number) {
    let newGraph = { ...this.graph };
    const newGraphState = { ...this.graphState };
    newGraph = Object.keys(newGraph)
      .map((key) => Number(key))
      .reduce((prevNodes: any, currIdx: number) => {
        if (currIdx != idx) {
          const newNode = newGraph[currIdx];
          if (newNode.edges?.has(idx)) {
            newNode.edges.delete(idx);
          }
          prevNodes[currIdx] = newNode;
        }
        return prevNodes;
      }, {});
    if (newGraphState.activeNode === idx) {
      newGraphState.activeNode = undefined;
    }
    if (newGraphState.prevActiveNode === idx) {
      newGraphState.prevActiveNode = undefined;
    }
    if (newGraphState.startNode === idx) {
      newGraphState.startNode = undefined;
    }
    if (newGraphState.endNode === idx) {
      newGraphState.endNode = undefined;
    }
    this.setGraph(newGraph);
    this.setGraphState(newGraphState);
  }

  getNodesIdx() {
    return Object.keys(this.graph).map((key) => Number(key));
  }

  getNode(idx: number) {
    return this.graph[idx];
  }

  setNodePosition(idx: number, latlng: LatLng) {
    this.setGraph({
      ...this.graph,
      [idx]: { ...this.graph[idx], position: latlng },
    });
  }

  getGraph() {
    return this.graph;
  }

  getPath() {
    return this.path;
  }

  setActiveNode(idx: number) {
    if (idx && this.graph[idx]) {
      this.setGraphState({
        ...(this.graphState ?? {}),
        activeNode: idx,
        prevActiveNode: this.graphState.activeNode,
      });
    }
  }

  setStartNode(idx: number) {
    if (idx && this.graph[idx]) {
      this.setGraphState({
        ...(this.graphState ?? {}),
        startNode: idx,
        endNode:
          this.graphState.endNode != idx ? this.graphState.endNode : undefined,
      });
    }
  }

  setEndNode(idx: number) {
    if (idx && this.graph[idx]) {
      this.setGraphState({
        ...(this.graphState ?? {}),
        endNode: idx,
        startNode:
          this.graphState.startNode != idx
            ? this.graphState.startNode
            : undefined,
      });
    }
  }

  connectNodes() {
    const prevNodeIdx = this.graphState.prevActiveNode;
    const currNodeIdx = this.graphState.activeNode;
    if (prevNodeIdx && currNodeIdx && prevNodeIdx !== currNodeIdx) {
      const newGraph = { ...this.graph };
      const prevNode = newGraph[prevNodeIdx];
      const currNode = newGraph[currNodeIdx];
      prevNode.edges = prevNode.edges ?? new Set();
      currNode.edges = currNode.edges ?? new Set();
      prevNode.edges.add(currNodeIdx);
      currNode.edges.add(prevNodeIdx);
      newGraph[prevNodeIdx] = prevNode;
      newGraph[currNodeIdx] = currNode;
      this.setGraph(newGraph);
    }
  }

  getActiveNode() {
    return this.graphState?.activeNode ?? false;
  }

  getPrevActiveNode() {
    return this.graphState?.prevActiveNode ?? false;
  }

  getStartNode() {
    return this.graphState?.startNode ?? false;
  }

  getEndNode() {
    return this.graphState?.endNode ?? false;
  }

  // setSearchPath(searchPath: number[]) {
  //   this.setGraph({
  //     ...this.graph,
  //     path: {
  //       ...this.graph.path,
  //       foundPath: [],
  //       searchPath: searchPath,
  //     },
  //   });
  // }

  // setFoundPath(foundPath: number[]) {
  //   this.setGraph({
  //     ...this.graph,
  //     path: {
  //       ...this.graph.path,
  //       searchPath: [],
  //       foundPath: foundPath,
  //     },
  //   });
  // }
}

export default GraphController;
