import { LatLng } from 'leaflet';
import {
  BuilderStates,
  GraphInterface,
  ProcessIdxInterface,
} from '../../../interfaces';
import { getRandomNumber, sleep } from '../../../utils/Helper';
import { BUILDER_SETTINGS } from '../../constants/Settings';
import GraphController from './GraphController';

export default class BuilderController {
  static async buildGridNetwork(
    graph: GraphInterface,
    processIdxRef: React.MutableRefObject<ProcessIdxInterface>,
    setGraph: React.Dispatch<React.SetStateAction<GraphInterface>>,
    gridNodes: number,
    buildSpeed: React.MutableRefObject<any>
  ) {
    const startProcess = processIdxRef.current.graphIdx;
    const sleepTime = () =>
      BUILDER_SETTINGS.baseSleepDuration * (1 - buildSpeed.current / 100);
    let newGraph = { ...graph };
    newGraph.buildState.state++;
    for (let i = 0; i < gridNodes; i++) {
      for (let j = 0; j < gridNodes; j++) {
        const nextNodeIdx = newGraph.nodeIndexer + 1;
        newGraph.buildState.nodeAddresses?.set(`${i}#${j}`, nextNodeIdx);
        await sleep(sleepTime());
        if (startProcess != processIdxRef.current.graphIdx) return;
        newGraph = GraphController.addNode(
          { position: new LatLng(i / 100, j / 100), edges: undefined },
          newGraph,
          setGraph,
          false
        );
      }
    }

    for (let k = 0; k < gridNodes; k++) {
      for (let l = 0; l < gridNodes; l++) {
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
          await sleep(sleepTime());
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
    setGraph: React.Dispatch<React.SetStateAction<GraphInterface>>,
    randomNodes: number,
    buildSpeed: React.MutableRefObject<any>
  ) {
    const startProcess = processIdxRef.current.graphIdx;
    const SETTINGS = BUILDER_SETTINGS.random;
    let newGraph = { ...graph };
    const sleepTime = () =>
      BUILDER_SETTINGS.baseSleepDuration * (1 - buildSpeed.current / 100);
    newGraph.buildState.state++;

    for (let i = 0; i < randomNodes; i++) {
      const randomLat =
        getRandomNumber(0, BUILDER_SETTINGS.random.latLngMax * 100) / 100;
      const randomLng =
        getRandomNumber(0, BUILDER_SETTINGS.random.latLngMax * 100) / 100;
      await sleep(sleepTime());
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
    const adjacencyMatrix = [...Array(randomNodes)].map(() =>
      Array(randomNodes)
    );
    for (let i = 0; i < randomNodes; i++) {
      for (let j = 0; j < randomNodes; j++) {
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

    for (let i = 0; i < randomNodes; i++) {
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
        await sleep(sleepTime());
        if (startProcess != processIdxRef.current.graphIdx) return;
        newGraph = GraphController.connectNodes(nodePairs, newGraph, setGraph);
      }
    }
    newGraph.buildState.state = BuilderStates.Finalized;
    if (startProcess != processIdxRef.current.graphIdx) return;
    setGraph(newGraph);
  }
}
