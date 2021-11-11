import { LatLng } from 'leaflet';

export interface GraphInterface {
  state: GraphStateInterface;
  nodes: {
    [idx: number]: NodeInterface;
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
