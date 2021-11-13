import 'leaflet/dist/leaflet.css';
import React from 'react';
import { Pane, Polyline, Popup } from 'react-leaflet';
import { GraphInterface } from '../../interfaces/interfaces';
import MarkerWithPopup from './MarkerWithPopup';

const MapLayers = (params: any) => {
  const graphController = params.graphController;
  const graph: GraphInterface = graphController.getGraph();
  const drawnEdges = new Set<string>();

  return (
    <>
      {graphController.getNodesIdx().map((nodeIdx: number) => {
        const node = graph.nodes[nodeIdx];
        return (
          <React.Fragment key={`marker-${nodeIdx}`}>
            <MarkerWithPopup
              nodeIdx={nodeIdx}
              graphController={graphController}
            />
            {node.edges &&
              node.edges.size > 0 &&
              Array.from(node.edges).reduce(
                (prevValue: any, edgeIdx: number) => {
                  if (
                    !drawnEdges.has(`${nodeIdx}-${edgeIdx}`) &&
                    !drawnEdges.has(`${edgeIdx}-${nodeIdx}`)
                  ) {
                    drawnEdges.add(`${nodeIdx}-${edgeIdx}`);
                    const edgePolyline = (
                      <Polyline
                        key={`polyline-${nodeIdx}-${edgeIdx}`}
                        pathOptions={{ color: 'lime' }}
                        positions={[
                          node.position,
                          graphController.getNode(edgeIdx).position,
                        ]}
                      >
                        <Popup>
                          <span>Test</span>
                        </Popup>
                      </Polyline>
                    );
                    prevValue.push(edgePolyline);
                  }
                  return prevValue;
                },
                []
              )}
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
