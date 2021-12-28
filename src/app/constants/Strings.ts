import {
  AlgoTypes,
  GraphTypes,
  MenuTypes,
  SettingTypes,
} from '../../interfaces';

export const mainMenuStrings = {
  [MenuTypes.Graph]: 'Graph',
  [MenuTypes.Algo]: 'Algorithm',
  [MenuTypes.Settings]: 'Settings',
};

export const graphMenuStrings = {
  [GraphTypes.None]: 'None',
  [GraphTypes.Random]: 'Random',
  [GraphTypes.Grid]: 'Grid',
};

export const algoMenuStrings = {
  [AlgoTypes.BFS]: 'Breath-First-Search',
  [AlgoTypes.DFS]: 'Depth-First-Search',
  [AlgoTypes.Dijkstra]: 'Dijkstra',
  [AlgoTypes.AStarEuclidean]: 'A* (Euclidean)',
  [AlgoTypes.AStarManhatten]: 'A* (Manhatten)',
};

export const settingMenuStrings = {
  [SettingTypes.BuildSpeed]: 'Build speed',
  [SettingTypes.SearchSpeed]: 'Search speed',
  [SettingTypes.MaxNodes]: 'Nodes count',
};
