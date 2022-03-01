import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import L from 'leaflet';
import { useEffect, useRef, useState } from 'react';

/**
 * Provides some guidelines how to use the app.
 */
export const Help = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const HelpModal = () => {
    return (
      <>
        <Modal
          title="Basic Modal"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
      </>
    );
  };

  const controlLayerRef = useRef<any>();
  // prevent forwarding of click events to the map component
  useEffect(() => {
    if (controlLayerRef) {
      L.DomEvent.disableClickPropagation(controlLayerRef.current);
      L.DomEvent.disableScrollPropagation(controlLayerRef.current);
    }
  });

  return (
    <div ref={controlLayerRef}>
      <div className="leaflet-bottom leaflet-left tolu-fade-comp">
        <div className="leaflet-control leaflet-bar">
          <HelpModal />
          <a
            className="tolu-help"
            onClick={() => setIsModalVisible(!isModalVisible)}
          >
            <QuestionCircleOutlined />
          </a>
        </div>
      </div>
    </div>
  );
};
