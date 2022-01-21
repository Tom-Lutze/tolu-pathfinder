import { LatLng } from 'leaflet';
import React from 'react';

// Enum types

/** Top level menu or setting types. */
export enum MenuTypes {
  Graph,
  Algo,
  Settings,
}

/** Graph menu or setting types. */
export enum GraphTypes {
  None,
  Grid,
  Random,
}

/** Algorithm menu or setting types. */
export enum AlgoTypes {
  BFS,
  DFS,
  Dijkstra,
  AStarManhatten,
  AStarEuclidean,
}

/** App configuration setting types. */
export enum SettingTypes {
  SearchSpeed,
  BuildSpeed,
  MaxNodesGrid,
  MaxNodesRandom,
}

// Graph interfaces

/** Represents a specific node with it's location and edges. */
export interface NodeInterface {
  location: LatLng;
  edges: Set<number> | undefined;
}

/** Extension of {@link NodeInterface} with additional parameters
 * for the A-Star search algorithm. */
export interface AStarNodeInterface extends NodeInterface {
  distanceFromStart: number;
  combinedDistanceFromStart: number;
  parentNodes: number[];
}

/** Represents the main graph including all nodes, states and
 * configurations for path finding. */
export interface GraphInterface {
  nodeIndexer: number;
  nodes: {
    [idx: number]: NodeInterface;
  };
  state: {
    updated: boolean;
    activeNode: number | undefined;
    prevActiveNode: number | undefined;
    startNode: number | undefined;
    endNode: number | undefined;
  };
  buildState: {
    state: number;
    counterA: number;
    counterB: number;
    nodeAddresses: Map<string, number> | undefined;
    nodeDistances: number[][] | undefined;
  };
  processIdx: number;
}

// Path interfaces

/** Possible states for path search processes. */
export enum PathSearchStates {
  Terminated = 0,
  Uninitialized = 1,
  Initialized = 2,
  Searching = 3,
  Finalized = 99,
}

/** All values required for the path search statistics table. */
interface PathSearchHistoryInterface {
  algo: AlgoTypes;
  visitedNodes: number;
  isCurrent?: boolean;
}

/** Represents the current path finding state. */
export interface PathInterface {
  found: boolean;
  nodes: number[];
  processIdx: number;
  state: PathSearchStates;
  visitedNodesCounter: number;
  history: PathSearchHistoryInterface[];
}

// Generic interfaces

/** Possible states for the graph builder process. */
export enum BuilderStates {
  Terminated = 0,
  Uninitialized = 1,
  Initialized = 2,
  Building = 3,
  Finalized = 99,
}

/** Index values that allow termination of graph-build and path-search processes.*/
export interface ProcessIdxInterface {
  graphIdx: number;
  pathIdx: number;
}
