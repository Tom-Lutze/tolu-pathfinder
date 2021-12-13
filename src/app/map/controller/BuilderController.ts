import { LatLng } from 'leaflet';
import { GraphInterface, NodeInterface } from '../../../interfaces';
import {
  getRandomNumber,
  getRandomNumberExcept,
  sleep,
} from '../../../utils/Helper';
import { BUILDER_STATES, BUILDER_SETTINGS } from '../constants/Settings';
import GraphController from './GraphController';
export default class BuilderController {
  static async buildSquareNetwork(
    graph: GraphInterface,
    // graphRef: React.MutableRefObject<GraphInterface>,
    setGraph: React.Dispatch<React.SetStateAction<GraphInterface>>
  ) {
    // const startSearchIdx = graphRef.current.processIdx;
    const NODES_PER_AXIS = BUILDER_SETTINGS.square.nodesPerAxisMax;
    const buildState = 0;

    // if (graph.buildState.state < 1) {
    //   const newGraph = { ...graph };
    //   // newGraph.buildState.counterA = BUILDER_SETTINGS.square.nodesPerAxisMax;
    //   // newGraph.buildState.counterB = -BUILDER_SETTINGS.square.nodesPerAxisMax;
    //   newGraph.buildState.state++;
    //   return setGraph(newGraph);
    // } else if (graph.buildState.state < 2) {
    let newGraph = { ...graph };
    newGraph.buildState.state++;
    for (
      let i = BUILDER_SETTINGS.square.nodesPerAxisMax;
      i >= -NODES_PER_AXIS;
      i--
    ) {
      for (
        let j = -BUILDER_SETTINGS.square.nodesPerAxisMax;
        j <= NODES_PER_AXIS;
        j++
      ) {
        // newGraph.buildState.counterB = j + 1;
        newGraph.buildState.nodeAddresses?.set(
          `${i}#${j}`,
          newGraph.nodeCount + 1
        );
        await sleep(30);
        newGraph = GraphController.addNode(
          { position: new LatLng(i / 100, j / 100), edges: undefined },
          newGraph,
          setGraph,
          false
        );
      }
      // newGraph.buildState.counterA = i - 1;
      // newGraph.buildState.counterB = -NODES_PER_AXIS;
    }
    // newGraph.buildState.counterA = NODES_PER_AXIS;
    // newGraph.buildState.counterB = -NODES_PER_AXIS;
    // newGraph.buildState.state++;
    // return setGraph(newGraph);
    // } else if (graph.buildState.state < 3) {
    //   const newGraph = { ...graph };
    for (let i = NODES_PER_AXIS; i >= -NODES_PER_AXIS; i--) {
      for (let j = -NODES_PER_AXIS; j <= NODES_PER_AXIS; j++) {
        // newGraph.buildState.counterB = j + 1;
        const currentNodeIdx = graph.buildState.nodeAddresses?.get(`${i}#${j}`);
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
          newGraph = GraphController.connectNodes(nodePairs, graph, setGraph);
        }
      }
      // newGraph.buildState.counterA = i - 1;
      // newGraph.buildState.counterB = -NODES_PER_AXIS;
    }
    newGraph.buildState.state = BUILDER_STATES.Ready;
    setGraph(newGraph);
    // }
  }

  static async buildRandomNetwork(
    graph: GraphInterface,
    // graphRef: React.MutableRefObject<GraphInterface>,
    setGraph: React.Dispatch<React.SetStateAction<GraphInterface>>
  ) {
    const SETTINGS = BUILDER_SETTINGS.random;

    // const setConnectionCounterState = (graph: GraphInterface) => {
    //   const connectionCount = getRandomNumber(
    //     SETTINGS.connectionsMin,
    //     SETTINGS.connectionsMax
    //   );
    //   graph.buildState.counterB = connectionCount;
    // };

    // if (graph.buildState.state < 1) {
    //   const newGraph = { ...graph };
    //   newGraph.buildState.counterA = 0;
    //   newGraph.buildState.counterB = 0;
    //   newGraph.buildState.state++;
    //   return setGraph(newGraph);
    // } else if (graph.buildState.state < 2) {
    let newGraph = { ...graph };
    newGraph.buildState.state++;

    for (let i = 0; i < SETTINGS.nodesMax; i++) {
      const randomLat = getRandomNumber(SETTINGS.latFrom, SETTINGS.latTo);
      const randomLng = getRandomNumber(SETTINGS.lngFrom, SETTINGS.lngTo);
      // if (newGraph.nodeCount < SETTINGS.nodesMax) {
      // newGraph.buildState.counterA++;
      await sleep(30);
      newGraph = GraphController.addNode(
        {
          position: new LatLng(randomLat / 100, randomLng / 100),
          edges: undefined,
        },
        newGraph,
        setGraph,
        false
      );
    }
    // newGraph.buildState.counterA = 0;
    // setConnectionCounterState(newGraph);
    // newGraph.buildState.state++;
    // return setGraph(newGraph);
    // } else if (graph.buildState.state < 3) {
    // const newGraph = { ...graph };
    const adjacencyMatrix = [...Array(SETTINGS.nodesMax)].map(() =>
      Array(SETTINGS.nodesMax)
    );
    for (let i = 0; i < SETTINGS.nodesMax; i++) {
      for (let j = 0; j < SETTINGS.nodesMax; j++) {
        if (i == j) {
          adjacencyMatrix[i][j] = undefined;
        } else if (!adjacencyMatrix[i][j]) {
          const dist = newGraph.nodes[i].position.distanceTo(
            newGraph.nodes[j].position
          );
          adjacencyMatrix[i][j] = { idx: j, distance: dist };
          adjacencyMatrix[j][i] = { idx: i, distance: dist };
        }
      }
    }
    const nodeDistances = adjacencyMatrix.map((node) => {
      return node
        .filter((node) => node != undefined)
        .sort((a, b) => a.distance - b.distance)
        .map((node) => node.idx); //TODO improve performance
    });
    // newGraph.buildState.state++;
    // setGraph(newGraph);
    // } else if (graph.buildState.state < 4) {
    // const newGraph = { ...graph };
    // const currentNodeIdx = 0;
    // const connectionCount = getRandomNumber(
    //   SETTINGS.connectionsMin,
    //   SETTINGS.connectionsMax
    // );

    for (let i = 0; i < SETTINGS.nodesMax; i++) {
      for (
        let j = getRandomNumber(
          SETTINGS.connectionsMin,
          SETTINGS.connectionsMax
        );
        j > 0;
        j--
      ) {
        //TODO testing
        const nodePairs: [number, number][] = [];
        if (nodeDistances) {
          const sortedNeighbors = nodeDistances[i];
          const maxSortedNeighborsIndex = Math.round(
            (j / SETTINGS.connectionsMax) * sortedNeighbors.length
          );
          const sortedNeighborsIndex = getRandomNumber(
            0,
            maxSortedNeighborsIndex
          );
          const neighborNodeIdx = sortedNeighbors[sortedNeighborsIndex];
          nodePairs.push([i, neighborNodeIdx]);
          sortedNeighbors.splice(sortedNeighborsIndex, 1);
        }
        newGraph.buildState.counterB--;
        await sleep(30);
        newGraph = GraphController.connectNodes(nodePairs, newGraph, setGraph);
      }
      // setConnectionCounterState(newGraph);
      // newGraph.buildState.counterA++;
      // return setGraph(newGraph);
    }
    // newGraph.buildState.state = BUILDER_STATES.Ready;
    // setGraph(newGraph);
    // }

    newGraph.buildState.state = BUILDER_STATES.Ready;
    setGraph(newGraph);
  }
}
