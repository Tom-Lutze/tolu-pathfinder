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
  helpTooltip: 'Info and Instructions',
  helpModalTitle: 'Info and Instructions',
  helpModalDividerTitle: 'Getting started',
  helpModalTextSec1:
    '<i>TOLU Pathfinder</i> illustrates the execution of different graph traversal algorithms on bidirectional weighted graphs in the context of a route planning application.',
  helpModalTextSec2:
    'In order to build a graph, arbitrary nodes can be manually created by simply clicking into the map view. Their locations are adjustable via drag-and-drop. Connections can be established by selecting two nodes in sequence (indicated by two blue circles) and activating the <i>Connect</i> option in the popup. Alternatively, a <i>Grid</i> or <i>Random</i> graph can be generated automatically by selecting the corresponding options under the <i>Graph</i> menu category.',
  helpModalTextSec3:
    'After the graph has been created, one node needs to be selected and specified as start and another one as end node.',
  helpModalTextSec4:
    'The application then automatically tries to find a path between the start and end nodes. The active search algorithm can be changed under the menu category <i>Algorithm</i>.',
  helpModalTextSec5:
    'Parameters for the automatic graph generation and graph traversal algorithms can be adjusted under the <i>Settings</i> category. The <i>Statistics</i> view in the top-right corner keeps track of all search algorithms that were executed on the current graph and therefore allows comparisons regarding their performances.',
  helpModalTextSec6: 'Thank you and enjoy experimenting!<br>Tom',
  helpModalStartEndImgAlt: 'Select start and end node via popup',
  helpModalConnectImgAlt: 'Connect two nodes via popup',
  helpModalPathResultImgAlt: 'Search result indicated with a green dashed line',
};
