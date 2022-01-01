import { Marker, Popup } from 'react-leaflet';
import { BuilderStates, GraphInterface } from '../../../../interfaces';
import {
  MarkerIconDefault,
  MarkerIconGreen,
  MarkerIconRed,
} from './MarkerIcons';
import GraphController from '../../controller/GraphController';
import { DeleteOutlined } from '@ant-design/icons';

const MarkerWithPopup = (params: {
  nodeIdx: number;
  graph: GraphInterface;
  setGraph: React.Dispatch<React.SetStateAction<GraphInterface>>;
}) => {
  const activeNode = params.graph.state.activeNode;
  const prevActiveNode = params.graph.state.prevActiveNode;
  const startNode = params.graph.state.startNode;
  const endNode = params.graph.state.endNode;
  const buildStateReady = () =>
    params.graph.buildState.state === BuilderStates.Finalized ? true : false;

  const StartButton = () => {
    if (params.graph.state.startNode == params.nodeIdx) {
      return <span style={{ color: 'gray' }}>Start{' | '}</span>;
    } else {
      return (
        <>
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
        </>
      );
    }
  };

  const ConnectButton = () => {
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
    if (showConnectOption()) {
      return (
        <a
          onClick={() =>
            GraphController.connectSelectedNodes(params.graph, params.setGraph)
          }
        >
          Connect
        </a>
      );
    } else {
      return <span style={{ color: 'gray' }}>Connect</span>;
    }
  };

  const EndButton = () => {
    if (params.graph.state.endNode == params.nodeIdx) {
      return <span style={{ color: 'gray' }}>{' | '}End</span>;
    } else {
      return (
        <>
          {' | '}
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
        </>
      );
    }
  };

  return (
    <Marker
      draggable={buildStateReady()}
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
          if (buildStateReady())
            GraphController.setActiveNode(
              e.target.options.nodeIdx,
              params.graph,
              params.setGraph
            );
        },
        dragend: (e) => {
          if (buildStateReady())
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
      {buildStateReady() && (
        <Popup>
          <div>
            <StartButton />
            <ConnectButton />
            <EndButton />
            <br />
            {`(ID: ${params.nodeIdx})`}
            <span style={{ float: 'right' }}>
              <a
                onClick={() =>
                  GraphController.removeNode(
                    params.nodeIdx,
                    params.graph,
                    params.setGraph
                  )
                }
              >
                <DeleteOutlined />
              </a>
            </span>
          </div>
        </Popup>
      )}
    </Marker>
  );
};

export default MarkerWithPopup;
