import { Pane, Polyline } from 'react-leaflet';
import { GraphInterface, PathInterface } from '../../../interfaces';
import GraphController from '../controller/GraphController';

const SearchPath = (params: { graph: GraphInterface; path: PathInterface }) => {
  return (
    <>
      {!params.graph.state.updated &&
        !params.path.found &&
        params.path.nodes.length > 1 && (
          <Pane name="tolu-search-path-pane">
            <Polyline
              pathOptions={{
                color: 'blue',
                dashArray: '10, 10',
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
                dashArray: '10, 10',
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

export default SearchPath;
