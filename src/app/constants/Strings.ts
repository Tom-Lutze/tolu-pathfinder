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
  [AlgoTypes.BFS]: 'Breadth-First-Search',
  [AlgoTypes.DFS]: 'Depth-First-Search',
  [AlgoTypes.Dijkstra]: 'Dijkstra',
  [AlgoTypes.AStarEuclidean]: 'A* (Euclidean)',
  [AlgoTypes.AStarManhatten]: 'A* (Manhatten)',
};

export const algoMenuStringsShort = {
  [AlgoTypes.BFS]: 'BFS',
  [AlgoTypes.DFS]: 'DFS',
  [AlgoTypes.Dijkstra]: 'Dijk',
  [AlgoTypes.AStarEuclidean]: 'A* (E)',
  [AlgoTypes.AStarManhatten]: 'A* (M)',
};

export const settingMenuStrings = {
  [SettingTypes.BuildSpeed]: 'Build speed',
  [SettingTypes.SearchSpeed]: 'Search speed',
  [SettingTypes.MaxNodesGrid]: 'Grid Nodes (x²)',
  [SettingTypes.MaxNodesRandom]: 'Random Nodes',
};

export const appStrings = {
  start: 'Start',
  startTooltip: 'Set as start node',
  end: 'End',
  endTooltip: 'Set as end node',
  connect: 'Connect',
  connectTooltip: 'Connect with previous node',
  disconnect: 'Disconnect',
  disconnectTooltip: 'Disconnect nodes',
  remove: 'Remove',
  removeTooltip: 'Delete this node',
  nodeIdentifier: 'Node',
  nodeIdentifierTooltip: 'Node identifier',
  closeTooltip: 'Close',
  spinTip: 'Building graph ...',
  resultsTitle: 'Results',
};
