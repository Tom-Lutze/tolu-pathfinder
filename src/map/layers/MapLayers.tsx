import React from 'react';
import { GraphInterface, PathInterface } from '../../interfaces/interfaces';
import GraphController from '../controller/GraphController';
import MarkerConnection from './MarkerConnection';
import MarkerWithPopup from './MarkerWithPopup';
import SearchPath from './SearchPath';

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
      <SearchPath graph={params.graph} path={params.path} />
    </>
  );
};

export default MapLayers;
