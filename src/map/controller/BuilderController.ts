import { LatLng } from 'leaflet';
import { GraphInterface, NodeInterface } from '../../interfaces/interfaces';
import GraphController from './GraphController';

export const _MAX_NODES = 3;

export default class BuilderController {
  static buildNetwork(
    graph: GraphInterface,
    setGraph: React.Dispatch<React.SetStateAction<GraphInterface>>
  ) {
    if (graph.buildState.state < 1) {
      const newGraph = { ...graph };
      for (let i = graph.buildState.iNext; i <= _MAX_NODES; i++) {
        for (let j = graph.buildState.jNext; j <= _MAX_NODES; j++) {
          newGraph.buildState.jNext = j + 1;
          newGraph.buildState.nodeAddresses?.set(
            `${i}#${j}`,
            newGraph.count + 1
          );
          return GraphController.addNode(
            { position: new LatLng(j / 100, i / 100), edges: undefined },
            newGraph,
            setGraph,
            false
          );
        }
        newGraph.buildState.iNext = i + 1;
        newGraph.buildState.jNext = -_MAX_NODES;
      }
      newGraph.buildState.iNext = -_MAX_NODES;
      newGraph.buildState.jNext = -_MAX_NODES;
      newGraph.buildState.state = newGraph.buildState.state + 1;
      setGraph(newGraph);
    } else if (graph.buildState.state < 2) {
      const newGraph = { ...graph };
      for (let i = graph.buildState.iNext; i <= _MAX_NODES; i++) {
        for (let j = graph.buildState.jNext; j <= _MAX_NODES; j++) {
          newGraph.buildState.jNext = j + 1;
          const currentNodeIdx = graph.buildState.nodeAddresses?.get(
            `${i}#${j}`
          );
          //TODO add connection to neighbors
          if (currentNodeIdx)
            GraphController.connectNodes(
              [[currentNodeIdx, currentNodeIdx + 1]],
              graph,
              setGraph
            );
        }
        newGraph.buildState.iNext = i + 1;
        newGraph.buildState.jNext = -_MAX_NODES;
      }
      newGraph.buildState.state = newGraph.buildState.state + 1;
      setGraph(newGraph);
    }
  }
}
