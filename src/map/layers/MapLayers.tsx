import React from 'react';
import { Pane, Polyline } from 'react-leaflet';
import { GraphInterface, PathInterface } from '../../interfaces/interfaces';
import GraphController from '../graph/GraphController';
import Pathfinder from '../graph/Pathfinder';
import MarkerConnection from './MarkerConnection';
import MarkerWithPopup from './MarkerWithPopup';

const MapLayers = (params: { graphController: GraphController }) => {
  const graphController = params.graphController;
  const graph: GraphInterface = graphController.getGraph();
  const path: PathInterface = graphController.getPath();

  return (
    <>
      {graphController.getNodesIdx().map((nodeIdx: number) => {
        return (
          <React.Fragment key={`marker-${nodeIdx}`}>
            <MarkerWithPopup
              nodeIdx={nodeIdx}
              graphController={graphController}
            />
            <MarkerConnection
              nodeIdx={nodeIdx}
              graphController={graphController}
            />
          </React.Fragment>
        );
      })}
      {path.search && path.path.length > 1 && (
        <Pane name="tolu-search-path-pane">
          <Polyline
            pathOptions={{
              color: 'blue',
              dashArray: '20, 20',
              dashOffset: '0',
            }}
            positions={path.path.map(
              (nodeIdx) => graphController.getNode(nodeIdx).position
            )}
            {...{ zIndex: 9998 }}
          />
        </Pane>
      )}
      {!path.search && path.path.length > 1 && (
        <Pane name="tolu-path-pane">
          <Polyline
            pathOptions={{
              color: 'red',
              dashArray: '20, 20',
              dashOffset: '0',
            }}
            positions={path.path.map(
              (nodeIdx) => graphController.getNode(nodeIdx).position
            )}
            {...{ zIndex: 9999 }}
          />
        </Pane>
      )}
    </>
  );
};

export default MapLayers;
