import { Polyline, Popup } from 'react-leaflet';
import { GraphInterface } from '../../interfaces/interfaces';
import { BUILDER_STATES } from '../constants/Settings';
import GraphController from '../controller/GraphController';

const MarkerConnection = (params: {
  nodeIdx: number;
  graph: GraphInterface;
  setGraph: React.Dispatch<React.SetStateAction<GraphInterface>>;
}) => {
  const nodeIdx = params.nodeIdx;
  const node = GraphController.getNode(nodeIdx, params.graph);
  const drawnEdges = new Set<string>();
  const buildStateReady =
    params.graph.buildState.state === BUILDER_STATES.Ready;

  if (node && node.edges && node.edges.size) {
    return Array.from(node.edges).reduce((prevValue: any, edgeIdx: number) => {
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
              GraphController.getNode(edgeIdx, params.graph).position,
            ]}
            interactive={true}
          >
            {buildStateReady && (
              <Popup>
                <span>
                  <a
                    onClick={() =>
                      GraphController.disconnectNodes(
                        nodeIdx,
                        edgeIdx,
                        params.graph,
                        params.setGraph
                      )
                    }
                  >
                    Disconnect
                  </a>
                </span>
              </Popup>
            )}
          </Polyline>
        );
        prevValue.push(edgePolyline);
      }
      return prevValue;
    }, []);
  } else {
    return null;
  }
};

export default MarkerConnection;
