export enum BUILDER_STATES {
  Uninitialized = 0,
  Ready = 99,
}

export const BUILDER_SETTINGS = {
  square: {
    nodesPerAxis: 3,
  },
  random: {
    nodes: 15,
    xFrom: -5,
    xTo: 5,
    yFrom: -5,
    yTo: 5,
    minConnections: 1,
    maxConnections: 3,
  },
};
