import { Marker, Popup } from 'react-leaflet';
import {
  MarkerIconDefault,
  MarkerIconGreen,
  MarkerIconRed,
} from '../constants/MarkerIcons';
import GraphController from '../controller/GraphController';

const MarkerWithPopup = (params: {
  nodeIdx: number;
  graphController: GraphController;
}) => {
  const activeNode = params.graphController.getActiveNode();
  const prevActiveNode = params.graphController.getPrevActiveNode();
  const startNode = params.graphController.getStartNode();
  const endNode = params.graphController.getEndNode();
  const showConnectOption = () => {
    if (prevActiveNode && activeNode && prevActiveNode !== activeNode) {
      return !(
        params.graphController.getNode(prevActiveNode).edges?.has(activeNode) ||
        params.graphController.getNode(activeNode).edges?.has(prevActiveNode)
      );
    }
    return false;
  };
  return (
    <Marker
      draggable={true}
      position={params.graphController.getNode(params.nodeIdx).position}
      opacity={
        activeNode == params.nodeIdx
          ? 1
          : prevActiveNode == params.nodeIdx
          ? 0.75
          : 0.3
      }
      icon={
        params.nodeIdx === startNode
          ? MarkerIconRed
          : params.nodeIdx === endNode
          ? MarkerIconGreen
          : MarkerIconDefault
      }
      eventHandlers={{
        click: (e) => {
          params.graphController.setActiveNode(e.target.options.nodeIdx);
        },
        dragend: (e) => {
          params.graphController.setNodePosition(
            e.target.options.nodeIdx,
            e.target.getLatLng()
          );
        },
      }}
      {...{
        nodeIdx: params.nodeIdx,
      }}
    >
      <Popup>
        <span>
          <a
            onClick={() => params.graphController.setStartNode(params.nodeIdx)}
          >
            Start
          </a>
          {' | '}
          {showConnectOption() && (
            <>
              <a onClick={() => params.graphController.connectNodes()}>
                Connect
              </a>
              {' | '}
            </>
          )}
          <a onClick={() => params.graphController.setEndNode(params.nodeIdx)}>
            End
          </a>
          <br />
          <a onClick={() => params.graphController.removeNode(params.nodeIdx)}>
            Remove
          </a>
        </span>
      </Popup>
    </Marker>
  );
};

export default MarkerWithPopup;
