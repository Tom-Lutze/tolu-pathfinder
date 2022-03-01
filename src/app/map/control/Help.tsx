import { QuestionCircleOutlined } from '@ant-design/icons';
import L from 'leaflet';
import { useEffect, useRef, useState } from 'react';

/**
 * Provides some guidelines how to use the app.
 */
export const Help = () => {
  const [showStatistics, setShowStatistics] = useState(false);
  const controlLayerRef = useRef<any>();

  // prevent forwarding of click events to the map component
  useEffect(() => {
    if (controlLayerRef) {
      L.DomEvent.disableClickPropagation(controlLayerRef.current);
      L.DomEvent.disableScrollPropagation(controlLayerRef.current);
    }
  }, [showStatistics]);

  return (
    <div ref={controlLayerRef}>
      <div className="leaflet-bottom leaflet-left tolu-fade-comp">
        <div className="leaflet-control leaflet-bar">
          <a className="tolu-help">
            <QuestionCircleOutlined />
          </a>
        </div>
      </div>
    </div>
  );
};
