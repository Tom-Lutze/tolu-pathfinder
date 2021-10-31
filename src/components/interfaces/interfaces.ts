import { LatLng } from 'leaflet';

export interface GraphInterface {
  state: GraphStateInterface;
  nodes: {
    [idx: string]: NodeInterface;
  };
}

export interface NodeInterface {
  position: LatLng;
  edges: Set<string> | undefined;
}

export interface GraphStateInterface {
  activeNode: string | undefined;
  prevActiveNode: string | undefined;
  startNode: string | undefined;
  endNode: string | undefined;
}
