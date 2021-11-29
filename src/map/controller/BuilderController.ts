import { LatLng } from 'leaflet';
import { GraphInterface, NodeInterface } from '../../interfaces/interfaces';
import { getRandomInt, getRandomIntExcept, sleep } from '../../utils/Helper';
import { BUILDER_STATES, BUILDER_SETTINGS } from '../constants/Settings';
import GraphController from './GraphController';
export default class BuilderController {
  static async buildSquareNetwork(
    graph: GraphInterface,
    setGraph: React.Dispatch<React.SetStateAction<GraphInterface>>
  ) {
    const NODES_PER_AXIS = BUILDER_SETTINGS.square.nodesPerAxis;

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
      newGraph.buildState.state = BUILDER_STATES.Ready;
      setGraph(newGraph);
    }
  }

  static async buildRandomNetwork(
    graph: GraphInterface,
    setGraph: React.Dispatch<React.SetStateAction<GraphInterface>>
  ) {
    const SETTINGS = BUILDER_SETTINGS.random;

    const setConnectionCounterState = (graph: GraphInterface) => {
      const connectionCount = getRandomInt(
        SETTINGS.minConnections,
        SETTINGS.maxConnections
      );
      graph.buildState.jNext = connectionCount;
    };

    if (graph.buildState.state < 1) {
      const newGraph = { ...graph };
      const randomX = getRandomInt(SETTINGS.xFrom, SETTINGS.xTo);
      const randomY = getRandomInt(SETTINGS.yFrom, SETTINGS.yTo);
      if (graph.count < SETTINGS.nodes) {
        newGraph.buildState.iNext = newGraph.buildState.iNext + 1;
        await sleep(30);
        return GraphController.addNode(
          {
            position: new LatLng(randomX / 100, randomY / 100),
            edges: undefined,
          },
          newGraph,
          setGraph,
          false
        );
      }
      newGraph.buildState.iNext = 1;
      setConnectionCounterState(newGraph);
      newGraph.buildState.state = newGraph.buildState.state + 1;
      setGraph(newGraph);
    } else if (graph.buildState.state < 2) {
      const newGraph = { ...graph };
      const currentNodeIdx = graph.buildState.iNext;
      if (currentNodeIdx < SETTINGS.nodes) {
        if (graph.buildState.jNext > 0) {
          const nodePairs: [number, number][] = [];
          const neighborNode = getRandomIntExcept(
            1,
            SETTINGS.nodes,
            currentNodeIdx
          );
          nodePairs.push([currentNodeIdx, neighborNode]);
          newGraph.buildState.jNext = newGraph.buildState.jNext - 1;
          await sleep(30);
          return GraphController.connectNodes(nodePairs, newGraph, setGraph);
        }
        setConnectionCounterState(newGraph);
        newGraph.buildState.iNext = currentNodeIdx + 1;
        return setGraph(newGraph);
      }
      newGraph.buildState.state = BUILDER_STATES.Ready;
      setGraph(newGraph);
    }
  }
}
