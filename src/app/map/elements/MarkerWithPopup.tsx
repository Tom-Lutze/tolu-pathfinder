import { CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import React, { useRef } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { BuilderStates, GraphInterface } from '../../../interfaces';
import { appStrings } from '../../constants/Strings';
import GraphController from '../controller/GraphController';
import {
  MarkerIconDefault,
  MarkerIconGreen,
  MarkerIconRed,
} from './MarkerIcons';

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
      return (
        <span className="tolu-text-disabled">
          {appStrings.start}
          {' | '}
        </span>
      );
    } else {
      return (
        <>
          <a
            title={appStrings.startTooltip}
            onClick={() =>
              GraphController.setStartNode(
                params.nodeIdx,
                params.graph,
                params.setGraph
              )
            }
          >
            {appStrings.start}
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
          title={appStrings.connectTooltip}
          onClick={() =>
            GraphController.connectSelectedNodes(params.graph, params.setGraph)
          }
        >
          {appStrings.connect}
        </a>
      );
    } else {
      return <span className="tolu-text-disabled">{appStrings.connect}</span>;
    }
  };

  const EndButton = () => {
    if (params.graph.state.endNode == params.nodeIdx) {
      return (
        <span className="tolu-text-disabled">
          {' | '}
          {appStrings.end}
        </span>
      );
    } else {
      return (
        <>
          {' | '}
          <a
            title={appStrings.endTooltip}
            onClick={() =>
              GraphController.setEndNode(
                params.nodeIdx,
                params.graph,
                params.setGraph
              )
            }
          >
            {appStrings.end}
          </a>
        </>
      );
    }
  };

  const popupRef = useRef<any>();

  return (
    <Marker
      title={`Node ${params.nodeIdx}`}
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
        <Popup closeButton={false} ref={popupRef}>
          <div className="tolu-popup-header">
            <span>
              <a
                title={appStrings.removeTooltip}
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
            <span
              title={appStrings.nodeIdentifierTooltip}
            >{`${appStrings.nodeIdentifier} ${params.nodeIdx}`}</span>
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
          <div className="tolu-popup-actions">
            <StartButton />
            <ConnectButton />
            <EndButton />
          </div>
        </Popup>
      )}
    </Marker>
  );
};

export default MarkerWithPopup;
