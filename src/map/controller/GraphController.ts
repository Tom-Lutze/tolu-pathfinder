import { LatLng } from 'leaflet';
import {
  GraphInterface,
  NodeInterface,
  GraphStateInterface,
  PathInterface,
} from '../../interfaces/interfaces';
import PathController from './PathController';

class GraphController {
  graph: GraphInterface;
  setGraph: React.Dispatch<React.SetStateAction<GraphInterface>>;
  // graphState: GraphStateInterface;
  // setGraphState: React.Dispatch<React.SetStateAction<GraphStateInterface>>;
  // path: PathInterface;
  // setFindPath: React.Dispatch<React.SetStateAction<boolean>>;
  constructor(
    // [nodeCount, setNodeCount]: [
    //   number,
    //   React.Dispatch<React.SetStateAction<number>>
    // ],
    graph: GraphInterface,
    setGraph: React.Dispatch<React.SetStateAction<GraphInterface>>
    // ],
    // [graphState, setGraphState]: [
    //   GraphStateInterface,
    //   React.Dispatch<React.SetStateAction<GraphStateInterface>>
    // ],
    // path: PathInterface,
    // setFindPath: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    // this.nodeCount = nodeCount;
    // this.setNodeCount = setNodeCount;
    this.graph = graph;
    this.setGraph = setGraph;
    // this.graphState = graphState;
    // this.setGraphState = setGraphState;
    // this.path = path;
    // this.setFindPath = setFindPath;
  }

  addNode(node: NodeInterface) {
    const newGraph = { ...this.graph };
    newGraph.count = newGraph.count + 1;
    // const newGraph.state = { ...this.graphState };
    // const newNodeCount = newGraph.count + 1;

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
    // this.setNodeCount(newGraph.count);
    this.setGraph(newGraph);
    // this.setGraphState(newGraph.state);
  }

  removeNode(idx: number) {
    const newGraph = { ...this.graph };
    // const newGraph.state = { ...this.graphState };
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
    // this.setGraphState(newGraph.state);
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

  // getPath() {
  //   return this.path;
  // }

  setActiveNode(idx: number) {
    if (idx && this.graph.nodes[idx]) {
      const newGraph = { ...this.graph };

      this.setGraph({
        ...newGraph,
        state: {
          ...(this.graph.state ?? {}),
          activeNode: idx,
          prevActiveNode: newGraph.state.activeNode,
        },
      });
      // this.setGraph({
      //   ...(this.graph.state ?? {}),
      //   activeNode: idx,
      //   prevActiveNode: this.graphState.activeNode,
      // });
    }
  }

  setStartNode(idx: number) {
    if (idx && this.graph.nodes[idx]) {
      const newGraph = { ...this.graph };

      this.setGraph({
        ...newGraph,
        state: {
          ...(this.graph.state ?? {}),
          startNode: idx,
          endNode:
            newGraph.state.endNode != idx ? newGraph.state.endNode : undefined,
        },
      });

      // this.setGraphState({
      //   ...(this.graphState ?? {}),
      //   startNode: idx,
      //   endNode:
      //     this.graphState.endNode != idx ? this.graphState.endNode : undefined,
      // });
    }
  }

  setEndNode(idx: number) {
    if (idx && this.graph.nodes[idx]) {
      const newGraph = { ...this.graph };

      this.setGraph({
        ...newGraph,
        state: {
          ...(this.graph.state ?? {}),
          endNode: idx,
          startNode:
            newGraph.state.startNode != idx
              ? newGraph.state.startNode
              : undefined,
        },
      });

      // this.setGraphState({
      //   ...(this.graphState ?? {}),
      //   endNode: idx,
      //   startNode:
      //     this.graphState.startNode != idx
      //       ? this.graphState.startNode
      //       : undefined,
      // });
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
