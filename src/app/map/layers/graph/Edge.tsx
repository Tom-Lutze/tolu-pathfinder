import { CloseOutlined } from '@ant-design/icons';
import React, { useRef } from 'react';
import { Polyline, Popup } from 'react-leaflet';
import {
  BuilderStates,
  GraphInterface,
} from '../../../../interfaces/Interfaces';
import { appStrings } from '../../../constants/Strings';
import GraphController from '../../../controller/GraphController';

/** Represents an edge as {@link Polyline} with a {@link Popup} attached to it. */
const Edge = (params: {
  fromNodeIdx: number;
  toNodeIdx: number;
  graph: GraphInterface;
  setGraph: React.Dispatch<React.SetStateAction<GraphInterface>>;
}) => {
  const buildStateReady =
    params.graph.buildState.state === BuilderStates.Finalized;
  const popupRef = useRef<any>();

  return (
    <Polyline
      key={`polyline-${params.fromNodeIdx}-${params.toNodeIdx}`}
      pathOptions={{ color: '#002766' }}
      positions={[
        GraphController.getNode(params.fromNodeIdx, params.graph).location,
        GraphController.getNode(params.toNodeIdx, params.graph).location,
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
                    params.fromNodeIdx,
                    params.toNodeIdx,
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
};

export default Edge;
