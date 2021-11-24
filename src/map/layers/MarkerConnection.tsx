import { Polyline, Popup } from 'react-leaflet';
import GraphController from '../controller/GraphController';

const MarkerConnection = (params: {
  nodeIdx: number;
  graphController: GraphController;
}) => {
  const nodeIdx = params.nodeIdx;
  const node = params.graphController.getNode(nodeIdx);
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
              params.graphController.getNode(edgeIdx).position,
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
