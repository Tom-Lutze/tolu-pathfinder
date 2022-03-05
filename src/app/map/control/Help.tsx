import { QuestionCircleOutlined } from '@ant-design/icons';
import { Divider, Modal } from 'antd';
import L from 'leaflet';
import { useEffect, useRef, useState } from 'react';
import { appStrings } from '../../constants/Strings';
import parse from 'html-react-parser';
import helpConnectImage from '../../../assets/images/help-connect.png';
import helpStartEndImage from '../../../assets/images/help-start-end.png';
import helpPathResultImage from '../../../assets/images/help-path-result.png';

/**
 * Provides some guidelines how to use the app.
 */
export const Help = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const HelpModal = () => {
    return (
      <>
        <Modal
          title={appStrings.helpModalTitle}
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          cancelText="OK"
          className="tolu-help-modal"
        >
          <p>{parse(appStrings.helpModalTextSec1)}</p>
          <Divider orientation="left">
            {appStrings.helpModalDividerTitle}
          </Divider>
          <p>{parse(appStrings.helpModalTextSec2)}</p>
          <img
            src={helpConnectImage}
            alt={appStrings.helpModalConnectImgAlt}
          ></img>
          <p>{parse(appStrings.helpModalTextSec3)}</p>
          <img
            src={helpStartEndImage}
            alt={appStrings.helpModalStartEndImgAlt}
          ></img>
          <p>{parse(appStrings.helpModalTextSec4)}</p>
          <img
            src={helpPathResultImage}
            alt={appStrings.helpModalPathResultImgAlt}
          ></img>
          <p>{parse(appStrings.helpModalTextSec5)}</p>
          <p>{parse(appStrings.helpModalTextSec6)}</p>
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
            title={appStrings.helpTooltip}
          >
            <QuestionCircleOutlined />
          </a>
        </div>
      </div>
    </div>
  );
};
