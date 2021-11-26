import { Marker, Popup } from 'react-leaflet';
import { GraphInterface } from '../../interfaces/interfaces';
import {
  MarkerIconDefault,
  MarkerIconGreen,
  MarkerIconRed,
} from '../constants/MarkerIcons';
import GraphController from '../controller/GraphController';

const MarkerWithPopup = (params: {
  nodeIdx: number;
  graph: GraphInterface;
  setGraph: React.Dispatch<React.SetStateAction<GraphInterface>>;
}) => {
  const activeNode = params.graph.state.activeNode;
  const prevActiveNode = params.graph.state.prevActiveNode;
  const startNode = params.graph.state.startNode;
  const endNode = params.graph.state.endNode;
  const showConnectOption = () => {
    if (prevActiveNode && activeNode && prevActiveNode !== activeNode) {
      return !(
        GraphController.getNode(prevActiveNode, params.graph).edges?.has(
          activeNode
        ) ||
        GraphController.getNode(activeNode, params.graph).edges?.has(
          prevActiveNode
        )
      );
    }
    return false;
  };
  return (
    <Marker
      draggable={true}
      position={GraphController.getNode(params.nodeIdx, params.graph).position}
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
          GraphController.setActiveNode(
            e.target.options.nodeIdx,
            params.graph,
            params.setGraph
          );
        },
        dragend: (e) => {
          GraphController.setNodePosition(
            e.target.options.nodeIdx,
            e.target.getLatLng(),
            params.graph,
            params.setGraph
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
            onClick={() =>
              GraphController.setStartNode(
                params.nodeIdx,
                params.graph,
                params.setGraph
              )
            }
          >
            Start
          </a>
          {' | '}
          {showConnectOption() && (
            <>
              <a
                onClick={() =>
                  GraphController.connectSelectedNodes(
                    params.graph,
                    params.setGraph
                  )
                }
              >
                Connect
              </a>
              {' | '}
            </>
          )}
          <a
            onClick={() =>
              GraphController.setEndNode(
                params.nodeIdx,
                params.graph,
                params.setGraph
              )
            }
          >
            End
          </a>
          <br />
          <a
            onClick={() =>
              GraphController.removeNode(
                params.nodeIdx,
                params.graph,
                params.setGraph
              )
            }
          >
            Remove
          </a>
        </span>
      </Popup>
    </Marker>
  );
};

export default MarkerWithPopup;
