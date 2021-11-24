import React from 'react';
import { Pane, Polyline } from 'react-leaflet';
import { GraphInterface, PathInterface } from '../../interfaces/interfaces';
import GraphController from '../controller/GraphController';
import PathController from '../controller/PathController';
import MarkerConnection from './MarkerConnection';
import MarkerWithPopup from './MarkerWithPopup';

const MapLayers = (params: {
  graph: GraphInterface;
  setGraph: React.Dispatch<React.SetStateAction<GraphInterface>>;
  path: PathInterface;
}) => {
  return (
    <>
      {GraphController.getNodesIdx(params.graph).map((nodeIdx: number) => {
        return (
          <React.Fragment key={`marker-${nodeIdx}`}>
            <MarkerWithPopup
              nodeIdx={nodeIdx}
              graph={params.graph}
              setGraph={params.setGraph}
            />
            <MarkerConnection
              nodeIdx={nodeIdx}
              graph={params.graph}
              setGraph={params.setGraph}
            />
          </React.Fragment>
        );
      })}
      {!params.graph.state.updated &&
        !params.path.found &&
        params.path.nodes.length > 1 && (
          <Pane name="tolu-search-path-pane">
            <Polyline
              pathOptions={{
                color: 'blue',
                dashArray: '20, 20',
                dashOffset: '0',
              }}
              positions={params.path.nodes.map(
                (nodeIdx) =>
                  GraphController.getNode(nodeIdx, params.graph).position
              )}
              {...{ zIndex: 9998 }}
            />
          </Pane>
        )}
      {!params.graph.state.updated &&
        params.path.found &&
        params.path.nodes.length > 1 && (
          <Pane name="tolu-path-pane">
            <Polyline
              pathOptions={{
                color: 'red',
                dashArray: '20, 20',
                dashOffset: '0',
              }}
              positions={params.path.nodes.map(
                (nodeIdx) =>
                  GraphController.getNode(nodeIdx, params.graph).position
              )}
              {...{ zIndex: 9999 }}
            />
          </Pane>
        )}
    </>
  );
};

export default MapLayers;
