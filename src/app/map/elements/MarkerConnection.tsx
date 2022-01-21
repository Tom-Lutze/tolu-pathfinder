import { CloseOutlined } from '@ant-design/icons';
import React, { useRef } from 'react';
import { Polyline, Popup } from 'react-leaflet';
import { BuilderStates, GraphInterface } from '../../../interfaces';
import { appStrings } from '../../constants/Strings';
import GraphController from '../controller/GraphController';

/** This component represents all graph edges as {@link Polyline}'s that have
 *  {@link Popup}'s attached to provide user actions. */
const MarkerConnection = (params: {
  nodeIdx: number;
  graph: GraphInterface;
  setGraph: React.Dispatch<React.SetStateAction<GraphInterface>>;
}) => {
  const nodeIdx = params.nodeIdx;
  const node = GraphController.getNode(nodeIdx, params.graph);
  const drawnEdges = new Set<string>();
  const buildStateReady =
    params.graph.buildState.state === BuilderStates.Finalized;
  const popupRef = useRef<any>();

  if (node && node.edges && node.edges.size) {
    return Array.from(node.edges).reduce((prevValue: any, edgeIdx: number) => {
      // filter duplicate edges for bidirectional graph
      if (
        !drawnEdges.has(`${nodeIdx}-${edgeIdx}`) &&
        !drawnEdges.has(`${edgeIdx}-${nodeIdx}`)
      ) {
        drawnEdges.add(`${nodeIdx}-${edgeIdx}`);
        const edgePolyline = (
          <Polyline
            key={`polyline-${nodeIdx}-${edgeIdx}`}
            pathOptions={{ color: '#002766' }}
            positions={[
              node.location,
              GraphController.getNode(edgeIdx, params.graph).location,
            ]}
            interactive={true}
          >
            {buildStateReady && (
              <Popup ref={popupRef} closeButton={false}>
                <div className="tolu-popup-header-connection">
                  <span>
                    <a
                      title={appStrings.disconnectTooltip}
                      onClick={() =>
                        GraphController.disconnectNodes(
                          nodeIdx,
                          edgeIdx,
                          params.graph,
                          params.setGraph
                        )
                      }
                    >
                      {appStrings.disconnect}
                    </a>
                  </span>
                  <span>
                    <a
                      title={appStrings.closeTooltip}
                      onClick={() => {
                        popupRef.current._close();
                      }}
                    >
                      <CloseOutlined />
                    </a>
                  </span>
                </div>
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
