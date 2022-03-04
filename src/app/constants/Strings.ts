import {
  AlgoTypes,
  GraphTypes,
  MenuTypes,
  SettingTypes,
} from '../../interfaces/Interfaces';

// exports all strings that are visible in the UI

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
  startTooltip: 'Set start node',
  end: 'End',
  endTooltip: 'Set end node',
  connect: 'Connect',
  connectTooltip: 'Connect to previous node',
  disconnect: 'Disconnect',
  disconnectTooltip: 'Disconnect nodes',
  remove: 'Remove',
  removeTooltip: 'Remove node',
  nodeIdentifier: 'Node',
  nodeIdentifierTooltip: 'Center map on node',
  closeTooltip: 'Close',
  spinTip: 'Building graph ...',
  resultsTitle: 'Results',
  logoAlt: 'TOLU Pathfinder logo',
  attributionTitle: 'For more info visit lutze-it.com',
  statisticsTitle: 'Statistics',
  statisticsNodesTitle: 'Nodes',
  statisticsEdgesTitle: 'Edges',
  statisticsVisitedTitle: 'Visited',
  statisticsAlgorithmTitle: 'Algorithm',
  helpTooltip: 'About the app',
  helpModalTitle: 'About the TOLU Pathfinder application',
  helpModalText: `<p><i>TOLU Pathfinder</i> illustrates the execution of different graph traversal algorithms on bidirectional weighted graphs in the context of a route planning application.</p>
    <p>To build a graph, arbitrary nodes can be created and connected using the map view. Alternatively, a <i>Grid</i> or <i>Random</i> graph can be generated automatically by selecting the appropriate options under the <i>Graph</i> menu category.</p>
    <p>After the graph has been created, two nodes need to be selected and specified as start and destination nodes.</p>
    <p>The menu item <i>Algorithm</i> provides various search algorithms that can be executed by selecting the corresponding subitem to find a path between the start and destination nodes.</p>
    <p>The <i>Settings</i> section provides options to adjust parameters used by the automatic graph generation and graph traversal algorithms.</p>`,
};
