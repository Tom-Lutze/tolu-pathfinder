import { Polyline, Popup } from 'react-leaflet';
import { GraphInterface } from '../../interfaces/interfaces';
import GraphController from '../controller/GraphController';

const MarkerConnection = (params: {
  nodeIdx: number;
  graph: GraphInterface;
  setGraph: React.Dispatch<React.SetStateAction<GraphInterface>>;
}) => {
  const nodeIdx = params.nodeIdx;
  const node = GraphController.getNode(nodeIdx, params.graph);
  const drawnEdges = new Set<string>();

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
          >
            <Popup>
              <span>Test</span>
            </Popup>
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
