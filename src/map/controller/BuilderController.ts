import { LatLng } from 'leaflet';
import { GraphInterface, NodeInterface } from '../../interfaces/interfaces';
import { sleep } from '../../utils/Helper';
import { BuilderStates, NODES_PER_AXIS } from '../constants/Settings';
import GraphController from './GraphController';

export default class BuilderController {
  static async buildNetwork(
    graph: GraphInterface,
    setGraph: React.Dispatch<React.SetStateAction<GraphInterface>>
  ) {
    if (graph.buildState.state < 1) {
      const newGraph = { ...graph };
      for (let i = graph.buildState.iNext; i >= -NODES_PER_AXIS; i--) {
        for (let j = graph.buildState.jNext; j <= NODES_PER_AXIS; j++) {
          newGraph.buildState.jNext = j + 1;
          newGraph.buildState.nodeAddresses?.set(
            `${i}#${j}`,
            newGraph.count + 1
          );
          await sleep(30);
          return GraphController.addNode(
            { position: new LatLng(i / 100, j / 100), edges: undefined },
            newGraph,
            setGraph,
            false
          );
        }
        newGraph.buildState.iNext = i - 1;
        newGraph.buildState.jNext = -NODES_PER_AXIS;
      }
      newGraph.buildState.iNext = NODES_PER_AXIS;
      newGraph.buildState.jNext = -NODES_PER_AXIS;
      newGraph.buildState.state = newGraph.buildState.state + 1;
      setGraph(newGraph);
    } else if (graph.buildState.state < 2) {
      const newGraph = { ...graph };
      for (let i = graph.buildState.iNext; i >= -NODES_PER_AXIS; i--) {
        for (let j = graph.buildState.jNext; j <= NODES_PER_AXIS; j++) {
          newGraph.buildState.jNext = j + 1;
          const currentNodeIdx = graph.buildState.nodeAddresses?.get(
            `${i}#${j}`
          );
          const bottomNeighborNodeIdx = graph.buildState.nodeAddresses?.get(
            `${i + 1}#${j}`
          );
          const rightNeighborNodeIdx = graph.buildState.nodeAddresses?.get(
            `${i}#${j + 1}`
          );
          const nodePairs: [number, number][] = [];
          if (currentNodeIdx && bottomNeighborNodeIdx)
            nodePairs.push([currentNodeIdx, bottomNeighborNodeIdx]);
          if (currentNodeIdx && rightNeighborNodeIdx)
            nodePairs.push([currentNodeIdx, rightNeighborNodeIdx]);
          if (nodePairs.length > 0) {
            await sleep(30);
            return GraphController.connectNodes(nodePairs, graph, setGraph);
          }
        }
        newGraph.buildState.iNext = i - 1;
        newGraph.buildState.jNext = -NODES_PER_AXIS;
      }
      newGraph.buildState.state = BuilderStates.Ready;
      setGraph(newGraph);
    }
  }
}
