import { Button, Card, Col, Row, Statistic } from 'antd';
import { GraphInterface, PathInterface } from '../../../interfaces';

const POSITION_CLASSES = {
  bottomleft: 'leaflet-bottom leaflet-left',
  bottomright: 'leaflet-bottom leaflet-right',
  topleft: 'leaflet-top leaflet-left',
  topright: 'leaflet-top leaflet-right',
};

export const ControlLayer = (params: {
  graph: GraphInterface;
  path: PathInterface;
}) => {
  return (
    <div className={POSITION_CLASSES.topright}>
      <div className="leaflet-control leaflet-bar">
        <Card>
          <Row gutter={16}>
            <Col span={12}>
              <Statistic
                title="Nodes"
                value={Object.keys(params.graph.nodes).length}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="Edges"
                value={
                  Object.keys(params.graph.nodes)
                    .map((key) => Number(key))
                    .reduce(
                      (prev: number, current: number, index: number) =>
                        prev + (params.graph.nodes[current].edges?.size ?? 0),
                      0
                    ) / 2
                }
              />
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};
