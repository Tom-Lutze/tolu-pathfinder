import { Card, Col, Divider, Row, Statistic, Table } from 'antd';
import { GraphInterface, PathInterface } from '../../../interfaces';
import { algoMenuStrings, appStrings } from '../../constants/Strings';

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
          <Row gutter={2}>
            <Col span={8}>
              <Statistic
                title="Nodes"
                value={Object.keys(params.graph.nodes).length}
              />
            </Col>
            <Col span={8}>
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
            <Col span={8}>
              <Statistic
                title="Visited"
                value={params.path.visitedNodesCounter}
              />
            </Col>
            <Col span={24}>
              <Divider orientation="left">{appStrings.resultsTitle}</Divider>
            </Col>
            <Col span={24}>
              {/* <List
                size="small"
                header={<div>Results</div>}
                dataSource={params.path.history.sort(
                  (a, b) => a.visitedNodes - b.visitedNodes
                )}
                renderItem={(item) => (
                  <List.Item>{`${item.visitedNodes} - ${
                    AlgoTypes[item.algo]
                  }`}</List.Item>
                )}
              /> */}
              <Table
                className="tolu-results-table"
                showHeader={false}
                size="small"
                tableLayout="auto"
                pagination={false}
                dataSource={params.path.history
                  .sort((a, b) => a.visitedNodes - b.visitedNodes)
                  .map((ele) => {
                    return { ...ele, algo: algoMenuStrings[ele.algo] };
                  })}
                columns={[
                  {
                    title: 'Visited',
                    dataIndex: 'visitedNodes',
                    key: 'visitedNodes',
                  },
                  {
                    title: 'Algorithm',
                    dataIndex: 'algo',
                    key: 'algo',
                  },
                ]}
              />
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};
