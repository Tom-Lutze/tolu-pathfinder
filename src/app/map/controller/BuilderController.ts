import { LatLng } from 'leaflet';
import {
  BuilderStates,
  GraphInterface,
  ProcessIdxInterface,
} from '../../../interfaces';
import { getRandomNumber, sleep } from '../../../utils/Helper';
import { APP_SETTINGS } from '../../constants/Settings';
import GraphController from './GraphController';

/** Provides program logic to automatically generate graphs. */
export default class BuilderController {
  /**
   * Generates a graph where nodes and their edges represent a grid.
   * @param graph Current graph state object
   * @param processIdxRef Process index reference object
   * @param setGraph Graphs set-state function
   * @param gridNodes Maximum number of nodes
   * @param buildSpeed Current build speed setting
   * @returns
   */
  static async buildGridNetwork(
    graph: GraphInterface,
    processIdxRef: React.MutableRefObject<ProcessIdxInterface>,
    setGraph: React.Dispatch<React.SetStateAction<GraphInterface>>,
    gridNodes: number,
    buildSpeed: React.MutableRefObject<any>
  ) {
    const startProcess = processIdxRef.current.graphIdx;
    const sleepTime = () =>
      APP_SETTINGS.baseSleepDuration * (1 - buildSpeed.current / 100);
    let newGraph = { ...graph };
    newGraph.buildState.state++;

    // create grid nodes
    for (let i = 0; i < gridNodes; i++) {
      for (let j = 0; j < gridNodes; j++) {
        const nextNodeIdx = newGraph.nodeIndexer + 1;
        newGraph.buildState.nodeAddresses?.set(`${i}#${j}`, nextNodeIdx);
        await sleep(sleepTime());
        if (startProcess != processIdxRef.current.graphIdx) return;
        newGraph = GraphController.addNode(
          { location: new LatLng(i / 100, j / 100), edges: undefined },
          newGraph,
          setGraph,
          false
        );
      }
    }

    // connect grid nodes with their neighbors
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

  /**
   * Generates a random graph based on user settings and static parameters in {@link APP_SETTINGS}.
   * @param graph Current graph state object
   * @param processIdxRef Process index reference object
   * @param setGraph Graphs set-state function
   * @param gridNodes Maximum number of nodes
   * @param buildSpeed Current build speed setting
   * @returns
   */
  static async buildRandomNetwork(
    graph: GraphInterface,
    processIdxRef: React.MutableRefObject<ProcessIdxInterface>,
    setGraph: React.Dispatch<React.SetStateAction<GraphInterface>>,
    randomNodes: number,
    buildSpeed: React.MutableRefObject<any>
  ) {
    const startProcess = processIdxRef.current.graphIdx;
    const SETTINGS = APP_SETTINGS.randomGraph;
    let newGraph = { ...graph };
    const sleepTime = () =>
      APP_SETTINGS.baseSleepDuration * (1 - buildSpeed.current / 100);
    newGraph.buildState.state++;

    // create random nodes
    for (let i = 0; i < randomNodes; i++) {
      const randomLat =
        getRandomNumber(0, APP_SETTINGS.randomGraph.latLngMax * 100) / 100;
      const randomLng =
        getRandomNumber(0, APP_SETTINGS.randomGraph.latLngMax * 100) / 100;
      await sleep(sleepTime());
      if (startProcess != processIdxRef.current.graphIdx) return;
      newGraph = GraphController.addNode(
        {
          location: new LatLng(randomLat / 100, randomLng / 100),
          edges: undefined,
        },
        newGraph,
        setGraph,
        false
      );
    }

    // generate adjacency matrix to represent distances between all nodes
    const adjacencyMatrix = [...Array(randomNodes)].map(() =>
      Array(randomNodes)
    );
    for (let i = 0; i < randomNodes; i++) {
      for (let j = 0; j < randomNodes; j++) {
        if (i == j) {
          adjacencyMatrix[i][j] = undefined;
        } else if (!adjacencyMatrix[i][j]) {
          const dist = newGraph.nodes[i + 1].location.distanceTo(
            newGraph.nodes[j + 1].location
          );
          adjacencyMatrix[i][j] = { idx: j + 1, distance: dist };
          adjacencyMatrix[j][i] = { idx: i + 1, distance: dist };
        }
      }
    }

    // sort edges based on their distance to node
    const nodeDistances = adjacencyMatrix.map((node) => {
      return node
        .filter((node) => node != undefined)
        .sort((a, b) => a.distance - b.distance)
        .map((node) => node.idx); //TODO improve performance
    });

    // connect nodes to other randomly selected nodes while prioritizing edges with smaller distances
    for (let i = 0; i < randomNodes; i++) {
      // predefine how many edges current node will get
      const connections = getRandomNumber(
        SETTINGS.connectionsMin,
        SETTINGS.connectionsMax
      );
      // loop over possible edges
      for (let j = connections; j > 0; j--) {
        const nodePairs: [number, number][] = [];
        if (nodeDistances) {
          const sortedNeighbors = nodeDistances[i];
          // reduce possible edges for current node based on the connection index to prioritize small distances
          const maxSortedNeighborsIndex = Math.round(
            (j / SETTINGS.connectionsMax) * sortedNeighbors.length
          );
          const sortedNeighborsIndex = getRandomNumber(
            0,
            maxSortedNeighborsIndex
          );

          // store selected edge for further processing and remove from current iteration set
          const neighborNodeIdx = sortedNeighbors[sortedNeighborsIndex];
          nodePairs.push([i, neighborNodeIdx]);
          sortedNeighbors.splice(sortedNeighborsIndex, 1);
        }
        newGraph.buildState.counterB--;
        await sleep(sleepTime());
        if (startProcess != processIdxRef.current.graphIdx) return;
        // add edges to node
        newGraph = GraphController.connectNodes(nodePairs, newGraph, setGraph);
      }
    }
    newGraph.buildState.state = BuilderStates.Finalized;
    if (startProcess != processIdxRef.current.graphIdx) return;
    setGraph(newGraph);
  }
}
