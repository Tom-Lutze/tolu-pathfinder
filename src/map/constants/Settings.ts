export enum BUILDER_STATES {
  Uninitialized = 0,
  Ready = 99,
}

export const BUILDER_SETTINGS = {
  square: {
    nodesPerAxisMax: 3,
  },
  random: {
    nodesMax: 15,
    latFrom: -5,
    latTo: 5,
    lngFrom: -5,
    lngTo: 5,
    connectionsMin: 1,
    connectionsMax: 3,
  },
};
