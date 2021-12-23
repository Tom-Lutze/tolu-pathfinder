import { LatLng } from 'leaflet';
import React from 'react';

export interface GraphInterface {
  nodeCount: number;
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

export interface NodeInterface {
  position: LatLng;
  edges: Set<number> | undefined;
}

export interface GraphStateInterface {
  activeNode: number | undefined;
  prevActiveNode: number | undefined;
  startNode: number | undefined;
  endNode: number | undefined;
}

export interface PathInterface {
  found: boolean;
  nodes: number[];
  processIdx: number;
  state: PathSearchStates;
}

export enum MenuTypes {
  Graph,
  Algo,
}

export enum GraphTypes {
  None,
  Grid,
  Random,
}

export enum AlgoTypes {
  BFS,
  DFS,
  Dijkstra,
  AStarManhatten,
  AStarEuclidean,
}

export enum BuilderStates {
  Terminated = 0,
  Uninitialized = 1,
  Initialized = 2,
  Building = 3,
  Finalized = 99,
}

export enum PathSearchStates {
  Terminated = 0,
  Uninitialized = 1,
  Initialized = 2,
  Searching = 3,
  Finalized = 99,
}

export interface PreserveRefInterface
  extends React.MutableRefObject<{
    prevGraph: GraphInterface | undefined;
    prevAlgo: AlgoTypes | undefined;
  }> {}

export interface ProcessIdxInterface {
  graphIdx: number;
  pathIdx: number;
}

export interface AStarNodeInterface extends NodeInterface {
  distanceFromStart: number;
  combinedDistanceFromStart: number;
  parentNodes: number[];
}
