import { LatLng } from 'leaflet';
import { GraphInterface, NodeInterface } from '../../interfaces/interfaces';
import {
  getRandomNumber,
  getRandomNumberExcept,
  sleep,
} from '../../utils/Helper';
import { BUILDER_STATES, BUILDER_SETTINGS } from '../constants/Settings';
import GraphController from './GraphController';
export default class BuilderController {
  static async buildSquareNetwork(
    graph: GraphInterface,
    setGraph: React.Dispatch<React.SetStateAction<GraphInterface>>
  ) {
    const NODES_PER_AXIS = BUILDER_SETTINGS.square.nodesPerAxisMax;

    if (graph.buildState.state < 1) {
      const newGraph = { ...graph };
      newGraph.buildState.counterA = BUILDER_SETTINGS.square.nodesPerAxisMax;
      newGraph.buildState.counterB = -BUILDER_SETTINGS.square.nodesPerAxisMax;
      newGraph.buildState.state++;
      return setGraph(newGraph);
    } else if (graph.buildState.state < 2) {
      const newGraph = { ...graph };
      for (let i = graph.buildState.counterA; i >= -NODES_PER_AXIS; i--) {
        for (let j = graph.buildState.counterB; j <= NODES_PER_AXIS; j++) {
          newGraph.buildState.counterB = j + 1;
          newGraph.buildState.nodeAddresses?.set(
            `${i}#${j}`,
            newGraph.nodeCount + 1
          );
          await sleep(30);
          return GraphController.addNode(
            { position: new LatLng(i / 100, j / 100), edges: undefined },
            newGraph,
            setGraph,
            false
          );
        }
        newGraph.buildState.counterA = i - 1;
        newGraph.buildState.counterB = -NODES_PER_AXIS;
      }
      newGraph.buildState.counterA = NODES_PER_AXIS;
      newGraph.buildState.counterB = -NODES_PER_AXIS;
      newGraph.buildState.state++;
      return setGraph(newGraph);
    } else if (graph.buildState.state < 3) {
      const newGraph = { ...graph };
      for (let i = graph.buildState.counterA; i >= -NODES_PER_AXIS; i--) {
        for (let j = graph.buildState.counterB; j <= NODES_PER_AXIS; j++) {
          newGraph.buildState.counterB = j + 1;
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
        newGraph.buildState.counterA = i - 1;
        newGraph.buildState.counterB = -NODES_PER_AXIS;
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
      const connectionCount = getRandomNumber(
        SETTINGS.connectionsMin,
        SETTINGS.connectionsMax
      );
      graph.buildState.counterB = connectionCount;
    };

    if (graph.buildState.state < 1) {
      const newGraph = { ...graph };
      newGraph.buildState.counterA = 0;
      newGraph.buildState.counterB = 0;
      newGraph.buildState.state++;
      return setGraph(newGraph);
    } else if (graph.buildState.state < 2) {
      const newGraph = { ...graph };
      const randomLat = getRandomNumber(SETTINGS.latFrom, SETTINGS.latTo);
      const randomLng = getRandomNumber(SETTINGS.lngFrom, SETTINGS.lngTo);
      if (graph.nodeCount < SETTINGS.nodesMax) {
        newGraph.buildState.counterA++;
        await sleep(30);
        return GraphController.addNode(
          {
            position: new LatLng(randomLat / 100, randomLng / 100),
            edges: undefined,
          },
          newGraph,
          setGraph,
          false
        );
      }
      newGraph.buildState.counterA = 1;
      setConnectionCounterState(newGraph);
      newGraph.buildState.state++;
      return setGraph(newGraph);
    } else if (graph.buildState.state < 3) {
      const newGraph = { ...graph };
      const currentNodeIdx = graph.buildState.counterA;
      if (currentNodeIdx < SETTINGS.nodesMax) {
        if (graph.buildState.counterB > 0) {
          const nodePairs: [number, number][] = [];
          const neighborNode = getRandomNumberExcept(
            1,
            SETTINGS.nodesMax,
            currentNodeIdx
          );
          nodePairs.push([currentNodeIdx, neighborNode]);
          newGraph.buildState.counterB--;
          await sleep(30);
          return GraphController.connectNodes(nodePairs, newGraph, setGraph);
        }
        setConnectionCounterState(newGraph);
        newGraph.buildState.counterA++;
        return setGraph(newGraph);
      }
      newGraph.buildState.state = BUILDER_STATES.Ready;
      setGraph(newGraph);
    }
  }
}
