import React, { useRef } from 'react';
import { CircleMarker, Marker, Popup, useMap } from 'react-leaflet';
import { CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  BuilderStates,
  GraphInterface,
} from '../../../../interfaces/Interfaces';
import {
  MarkerIconDefault,
  MarkerIconGreen,
  MarkerIconRed,
} from '../../../constants/Markers';
import { appStrings } from '../../../constants/Strings';
import GraphController from '../../../controller/GraphController';

/**
 * Represents a node as {@link Marker} with a {@link Popup} attached to it.
 */
const Node = (params: {
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
  const map = useMap();

  return (
    <>
      <Marker
        title={`Node ${params.nodeIdx}`}
        draggable={buildStateReady()}
        position={
          GraphController.getNode(params.nodeIdx, params.graph).location
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
              GraphController.setNodeLocation(
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
              <a
                onClick={() =>
                  map.flyTo(
                    GraphController.getNode(params.nodeIdx, params.graph)
                      .location
                  )
                }
                title={appStrings.nodeIdentifierTooltip}
              >{`${appStrings.nodeIdentifier} ${params.nodeIdx}`}</a>
              <a
                title={appStrings.closeTooltip}
                onClick={() => {
                  popupRef.current._close();
                }}
              >
                <CloseOutlined />
              </a>
            </div>
            <div className="tolu-popup-actions">
              <StartButton />
              <ConnectButton />
              <EndButton />
            </div>
          </Popup>
        )}
      </Marker>
      {(activeNode == params.nodeIdx || prevActiveNode == params.nodeIdx) && (
        <CircleMarker
          center={
            GraphController.getNode(params.nodeIdx, params.graph).location
          }
          pathOptions={{
            color: '#002766',
            fillOpacity: 1,
          }}
          radius={8}
        />
      )}
    </>
  );
};

export default Node;
