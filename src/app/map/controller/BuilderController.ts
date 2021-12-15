import { LatLng } from 'leaflet';
import {
  BuilderStates,
  GraphInterface,
  ProcessIdxInterface,
} from '../../../interfaces';
import { getRandomNumber, sleep } from '../../../utils/Helper';
import { BUILDER_SETTINGS } from '../constants/Settings';
import GraphController from './GraphController';

export default class BuilderController {
  static async buildSquareNetwork(
    graph: GraphInterface,
    processIdxRef: React.MutableRefObject<ProcessIdxInterface>,
    setGraph: React.Dispatch<React.SetStateAction<GraphInterface>>
  ) {
    const startProcess = processIdxRef.current.graphIdx;
    const NODES_PER_AXIS = BUILDER_SETTINGS.square.nodesPerAxisMax;
    let newGraph = { ...graph };
    newGraph.buildState.state++;
    for (let i = NODES_PER_AXIS; i >= -NODES_PER_AXIS; i--) {
      for (let j = -NODES_PER_AXIS; j <= NODES_PER_AXIS; j++) {
        const nextNodeIdx = newGraph.nodeCount + 1;
        newGraph.buildState.nodeAddresses?.set(`${i}#${j}`, nextNodeIdx);
        await sleep(30);
        if (startProcess != processIdxRef.current.graphIdx) return;
        newGraph = GraphController.addNode(
          { position: new LatLng(i / 100, j / 100), edges: undefined },
          newGraph,
          setGraph,
          false
        );
      }
    }

    for (let k = NODES_PER_AXIS; k >= -NODES_PER_AXIS; k--) {
      for (let l = -NODES_PER_AXIS; l <= NODES_PER_AXIS; l++) {
        const currentNodeIdx = newGraph.buildState.nodeAddresses?.get(
          `${k}#${l}`
        );
        const bottomNeighborNodeIdx = newGraph.buildState.nodeAddresses?.get(
          `${k - 1}#${l}`
        );
        const rightNeighborNodeIdx = newGraph.buildState.nodeAddresses?.get(
          `${k}#${l + 1}`
        );
        const nodePairs: [number, number][] = [];
        if (currentNodeIdx && bottomNeighborNodeIdx)
          nodePairs.push([currentNodeIdx, bottomNeighborNodeIdx]);
        if (currentNodeIdx && rightNeighborNodeIdx)
          nodePairs.push([currentNodeIdx, rightNeighborNodeIdx]);
        if (nodePairs.length > 0) {
          await sleep(30);
          if (startProcess != processIdxRef.current.graphIdx) return;
          newGraph = GraphController.connectNodes(
            nodePairs,
            newGraph,
            setGraph
          );
        }
      }
    }
    newGraph.buildState.state = BuilderStates.Finalized;
    if (startProcess != processIdxRef.current.graphIdx) return;
    setGraph(newGraph);
  }

  static async buildRandomNetwork(
    graph: GraphInterface,
    processIdxRef: React.MutableRefObject<ProcessIdxInterface>,
    setGraph: React.Dispatch<React.SetStateAction<GraphInterface>>
  ) {
    const startProcess = processIdxRef.current.graphIdx;
    const SETTINGS = BUILDER_SETTINGS.random;
    let newGraph = { ...graph };
    newGraph.buildState.state++;

    for (let i = 0; i < SETTINGS.nodesMax; i++) {
      const randomLat = getRandomNumber(SETTINGS.latFrom, SETTINGS.latTo);
      const randomLng = getRandomNumber(SETTINGS.lngFrom, SETTINGS.lngTo);
      await sleep(30);
      if (startProcess != processIdxRef.current.graphIdx) return;
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
    const adjacencyMatrix = [...Array(SETTINGS.nodesMax)].map(() =>
      Array(SETTINGS.nodesMax)
    );
    for (let i = 0; i < SETTINGS.nodesMax; i++) {
      for (let j = 0; j < SETTINGS.nodesMax; j++) {
        if (i == j) {
          adjacencyMatrix[i][j] = undefined;
        } else if (!adjacencyMatrix[i][j]) {
          const dist = newGraph.nodes[i + 1].position.distanceTo(
            newGraph.nodes[j + 1].position
          );
          adjacencyMatrix[i][j] = { idx: j + 1, distance: dist };
          adjacencyMatrix[j][i] = { idx: i + 1, distance: dist };
        }
      }
    }
    const nodeDistances = adjacencyMatrix.map((node) => {
      return node
        .filter((node) => node != undefined)
        .sort((a, b) => a.distance - b.distance)
        .map((node) => node.idx); //TODO improve performance
    });

    for (let i = 0; i < SETTINGS.nodesMax; i++) {
      const connections = getRandomNumber(
        SETTINGS.connectionsMin,
        SETTINGS.connectionsMax
      );
      for (let j = connections; j > 0; j--) {
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
        if (startProcess != processIdxRef.current.graphIdx) return;
        newGraph = GraphController.connectNodes(nodePairs, newGraph, setGraph);
      }
    }
    newGraph.buildState.state = BuilderStates.Finalized;
    if (startProcess != processIdxRef.current.graphIdx) return;
    setGraph(newGraph);
  }
}
