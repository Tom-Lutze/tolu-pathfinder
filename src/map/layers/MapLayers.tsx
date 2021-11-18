import React from 'react';
import { Pane, Polyline } from 'react-leaflet';
import { PathInterface } from '../../interfaces/interfaces';
import GraphController from '../controller/GraphController';
import PathController from '../controller/PathController';
import MarkerConnection from './MarkerConnection';
import MarkerWithPopup from './MarkerWithPopup';

const MapLayers = (params: {
  graphController: GraphController;
  pathController: PathController;
}) => {
  const graphController = params.graphController;
  const pathController = params.pathController;
  const graph = graphController.getGraph();
  const path: PathInterface = pathController.getPath();

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
      {!graph.state.updated && !path.found && path.nodes.length > 1 && (
        <Pane name="tolu-search-path-pane">
          <Polyline
            pathOptions={{
              color: 'blue',
              dashArray: '20, 20',
              dashOffset: '0',
            }}
            positions={path.nodes.map(
              (nodeIdx) => graphController.getNode(nodeIdx).position
            )}
            {...{ zIndex: 9998 }}
          />
        </Pane>
      )}
      {!graph.state.updated && path.found && path.nodes.length > 1 && (
        <Pane name="tolu-path-pane">
          <Polyline
            pathOptions={{
              color: 'red',
              dashArray: '20, 20',
              dashOffset: '0',
            }}
            positions={path.nodes.map(
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
