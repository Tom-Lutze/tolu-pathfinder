import { LatLng } from 'leaflet';

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
  searchIdx: number;
}
