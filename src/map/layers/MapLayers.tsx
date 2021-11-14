import React from 'react';
import { Pane, Polyline } from 'react-leaflet';
import { GraphInterface } from '../../interfaces/interfaces';
import MarkerConnection from './MarkerConnection';
import MarkerWithPopup from './MarkerWithPopup';

const MapLayers = (params: { graphController: any }) => {
  const graphController = params.graphController;
  const graph: GraphInterface = graphController.getGraph();

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
      {graph.path.searchPath.length > 1 && (
        <Pane name="tolu-search-path-pane">
          <Polyline
            pathOptions={{
              color: 'blue',
              dashArray: '20, 20',
              dashOffset: '0',
            }}
            positions={graph.path.searchPath.map(
              (nodeIdx) => graphController.getNode(nodeIdx).position
            )}
            {...{ zIndex: 9998 }}
          />
        </Pane>
      )}
      {graph.path.foundPath.length > 1 && (
        <Pane name="tolu-path-pane">
          <Polyline
            pathOptions={{
              color: 'red',
              dashArray: '20, 20',
              dashOffset: '0',
            }}
            positions={graph.path.foundPath.map(
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
